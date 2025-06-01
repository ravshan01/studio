
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Station } from "@/types";
import { useLanguage } from "@/contexts/language-context";
import { PlusCircle, Trash2, Plus, Minus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "@/lib/constants";
import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const generatePortId = () => `port_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const portSchema = z.object({
  id: z.string(),
  type: z.enum(["Type 1", "Type 2", "CCS", "CHAdeMO"]),
  powerKW: z.coerce.number().min(1, "Power must be positive"),
  status: z.enum(["available", "occupied", "out_of_order"]),
  pricePerKWh: z.coerce.number().nonnegative("Price cannot be negative").optional(),
});

const stationFormSchema = z.object({
  name: z.string().min(3, "Station name must be at least 3 characters"),
  address: z.string().optional(),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  type: z.enum(["AC", "DC", "Hybrid"]),
  operator: z.string().optional(),
  openingHours: z.string().optional(),
  ports: z.array(portSchema).min(1, "At least one port is required"),
});

export type StationFormData = z.infer<typeof stationFormSchema> & { id?: string };

interface StationFormProps {
  initialData?: Station | null;
  onSubmit: (data: StationFormData) => Promise<void>;
  onCancel: () => void;
  onDelete?: (stationId: string) => Promise<void>; // Optional delete handler
  isSubmitting?: boolean;
  isDeleting?: boolean; // Optional deleting state
}

function FormMapZoomControls() {
  const map = useMap();
  const { t } = useLanguage();

  const handleZoomIn = () => {
    if (map) {
      const currentZoom = map.getZoom();
      if (currentZoom !== undefined) {
        map.setZoom(currentZoom + 1);
      }
    }
  };

  const handleZoomOut = () => {
    if (map) {
      const currentZoom = map.getZoom();
      if (currentZoom !== undefined && currentZoom > 0) {
        map.setZoom(currentZoom - 1);
      }
    }
  };

  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col space-y-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleZoomIn}
        className="bg-background shadow-md"
        aria-label={t("zoomIn", "Zoom in")}
      >
        <Plus className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleZoomOut}
        className="bg-background shadow-md"
        aria-label={t("zoomOut", "Zoom out")}
      >
        <Minus className="h-5 w-5" />
      </Button>
    </div>
  );
}

export function StationForm({
  initialData,
  onSubmit,
  onCancel,
  onDelete,
  isSubmitting,
  isDeleting,
}: StationFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isGeocoding, setIsGeocoding] = useState(false);

  const form = useForm<StationFormData>({
    resolver: zodResolver(stationFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          ports: initialData.ports.map(p => ({...p, id: p.id || generatePortId() }))
        }
      : {
          name: "",
          address: "",
          latitude: DEFAULT_MAP_CENTER.lat,
          longitude: DEFAULT_MAP_CENTER.lng,
          type: "AC",
          operator: "",
          openingHours: "24/7",
          ports: [{ id: generatePortId(), type: "Type 2", powerKW: 22, status: "available", pricePerKWh: 0 }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ports",
  });

  const watchedLatitude = form.watch("latitude");
  const watchedLongitude = form.watch("longitude");

  const currentPosition = { lat: watchedLatitude, lng: watchedLongitude };

  const initialMapCenter = initialData
    ? { lat: initialData.latitude, lng: initialData.longitude }
    : DEFAULT_MAP_CENTER;

  const geocodeLocation = useCallback((lat: number, lng: number) => {
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      console.error("Google Maps Geocoder not available.");
      toast({ title: t("geocodingFailed", "Address lookup failed."), description: "Google Maps Geocoder not available.", variant: "destructive" });
      return;
    }
    setIsGeocoding(true);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      setIsGeocoding(false);
      if (status === "OK") {
        if (results && results[0]) {
          form.setValue("address", results[0].formatted_address, { shouldValidate: true, shouldDirty: true });
        } else {
          form.setValue("address", "", { shouldValidate: true, shouldDirty: true });
          toast({ title: t("noAddressFound", "No address found for this location."), variant: "default" });
        }
      } else {
        form.setValue("address", "", { shouldValidate: true, shouldDirty: true });
        toast({ title: t("geocodingFailed", "Address lookup failed."), description: `Geocoder failed due to: ${status}`, variant: "destructive" });
        console.error(`Geocoder failed due to: ${status}`);
      }
    });
  }, [form, t, toast]);

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.detail.latLng) {
        const lat = event.detail.latLng.lat;
        const lng = event.detail.latLng.lng;
        form.setValue("latitude", parseFloat(lat.toFixed(6)), { shouldValidate: true, shouldDirty: true });
        form.setValue("longitude", parseFloat(lng.toFixed(6)), { shouldValidate: true, shouldDirty: true });
        geocodeLocation(lat, lng);
    }
  }, [form, geocodeLocation]);

  const handleMarkerDragEnd = useCallback((event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          form.setValue("latitude", parseFloat(lat.toFixed(6)), { shouldValidate: true, shouldDirty: true });
          form.setValue("longitude", parseFloat(lng.toFixed(6)), { shouldValidate: true, shouldDirty: true });
          geocodeLocation(lat,lng);
      }
  }, [form, geocodeLocation]);

  const handleSubmit = (data: StationFormData) => {
    const dataToSubmit: StationFormData = { ...data };
    if (initialData?.id) {
        dataToSubmit.id = initialData.id;
    }
    onSubmit(dataToSubmit);
  };

  const handleDeleteConfirm = async () => {
    if (initialData?.id && onDelete) {
      await onDelete(initialData.id);
      // Parent (AdminStationsPage) will handle toast and navigation/form closing
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Card>
          <CardHeader><CardTitle>{t("stationDetails", "Station Details")}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("stationName", "Station Name")}</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("type", "Type")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select station type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="AC">{t("AC")}</SelectItem>
                        <SelectItem value="DC">{t("DC")}</SelectItem>
                        <SelectItem value="Hybrid">{t("Hybrid")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("address", "Address")} ({t("optional", "Optional")}) {isGeocoding ? `(${t("fetchingAddress", "Fetching address...")})`: ''}</FormLabel>
                  <FormControl><Textarea {...field} placeholder={t("stationAddressPlaceholder", "Enter full address or pick from map")} disabled={isGeocoding} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("latitude", "Latitude")}</FormLabel>
                    <FormControl><Input type="number" step="any" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("longitude", "Longitude")}</FormLabel>
                    <FormControl><Input type="number" step="any" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
                <FormLabel>{t("locationOnMap", "Location on Map")}</FormLabel>
                <div style={{ height: "400px", width: "100%", borderRadius: "var(--radius)" }} className="overflow-hidden border bg-muted relative">
                    <Map
                        center={currentPosition.lat && currentPosition.lng ? currentPosition : initialMapCenter }
                        defaultZoom={initialData ? DEFAULT_MAP_ZOOM + 4 : DEFAULT_MAP_ZOOM +1}
                        gestureHandling={"greedy"}
                        disableDefaultUI={true}
                        onClick={handleMapClick}
                        mapId="station_form_map_id"
                        className="h-full w-full"
                    >
                        { (watchedLatitude && watchedLongitude) && (
                            <AdvancedMarker
                                position={currentPosition}
                                draggable={true}
                                onDragEnd={handleMarkerDragEnd}
                            />
                        )}
                        <FormMapZoomControls />
                    </Map>
                </div>
                <p className="text-sm text-muted-foreground">
                    {t("mapFormHelpText", "Click on the map or drag the marker to set coordinates. Address will be auto-filled.")}
                </p>
            </div>

             <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="operator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("operator", "Operator")} ({t("optional", "Optional")})</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="openingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("openingHours", "Opening Hours")} ({t("optional", "Optional")})</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g., 24/7 or 09:00 - 18:00" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t("ports", "Ports")}</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-md space-y-4 relative">
                <h4 className="font-medium">{t("port", "Port")} {index + 1}</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`ports.${index}.type`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>{t("portType", "Port Type")}</FormLabel>
                        <Select onValueChange={f.onChange} defaultValue={f.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select port type" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Type 1">Type 1</SelectItem>
                            <SelectItem value="Type 2">Type 2</SelectItem>
                            <SelectItem value="CCS">CCS</SelectItem>
                            <SelectItem value="CHAdeMO">CHAdeMO</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`ports.${index}.status`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>{t("status", "Status")}</FormLabel>
                        <Select onValueChange={f.onChange} defaultValue={f.value}>
                           <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                           <SelectContent>
                            <SelectItem value="available">{t("available", "Available")}</SelectItem>
                            <SelectItem value="occupied">{t("occupied", "Occupied")}</SelectItem>
                            <SelectItem value="out_of_order">{t("outOfOrder", "Out of Order")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                   <FormField
                    control={form.control}
                    name={`ports.${index}.powerKW`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>{t("power", "Power (kW)")}</FormLabel>
                        <FormControl><Input type="number" step="any" {...f} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`ports.${index}.pricePerKWh`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>{t("pricePerKWh", "Price (UZS/kWh)")} ({t("optional", "Optional")})</FormLabel>
                        <FormControl><Input type="number" step="any" {...f} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {fields.length > 1 && (
                    <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="absolute top-2 right-2 text-destructive hover:text-destructive"
                    aria-label={t("removePort", "Remove port")}
                    >
                    <Trash2 className="h-4 w-4" />
                    </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ id: generatePortId(), type: "Type 2", powerKW: 22, status: "available", pricePerKWh: 0 })}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" /> {t("addPort", "Add Port")}
            </Button>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-end gap-4">
          {initialData?.id && onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" className="sm:mr-auto" disabled={isSubmitting || isDeleting || isGeocoding}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? t("deleting", "Deleting...") : t("deleteStationButtonLabel", "Delete Station")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("confirmDeleteTitle", "Confirm Deletion")}</AlertDialogTitle>
                  <AlertDialogDescription>
                     {t("confirmDeleteStationMsg", `Are you sure you want to delete station "${initialData.name}"? This action cannot be undone.`).replace("{stationName}", initialData.name)}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>{t("cancel", "Cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? t("deleting", "Deleting...") :t("delete", "Delete")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 ml-auto"> {/* Wrapper for cancel and save */}
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting || isDeleting || isGeocoding}>
              {t("cancel", "Cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting || isDeleting || isGeocoding} className="bg-primary hover:bg-primary/90">
              {isSubmitting ? t("saving", "Saving...") : (initialData ? t("saveChanges", "Save Changes") : t("save", "Save Station"))}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

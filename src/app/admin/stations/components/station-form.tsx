
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
import { PlusCircle, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "@/lib/constants";
import { useCallback } from "react";

const portSchema = z.object({
  type: z.enum(["Type 1", "Type 2", "CCS", "CHAdeMO"]),
  powerKW: z.coerce.number().min(1, "Power must be positive"),
  status: z.enum(["available", "occupied", "out_of_order"]),
  pricePerKWh: z.coerce.number().nonnegative("Price cannot be negative").optional(),
});

const stationFormSchema = z.object({
  name: z.string().min(3, "Station name must be at least 3 characters"),
  address: z.string().optional(), // Made address optional
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  type: z.enum(["AC", "DC", "Hybrid"]),
  operator: z.string().optional(),
  openingHours: z.string().optional(),
  ports: z.array(portSchema).min(1, "At least one port is required"),
});

type StationFormData = z.infer<typeof stationFormSchema>;

interface StationFormProps {
  initialData?: Station | null;
  onSubmit: (data: StationFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function StationForm({ initialData, onSubmit, onCancel, isSubmitting }: StationFormProps) {
  const { t } = useLanguage();
  const form = useForm<StationFormData>({
    resolver: zodResolver(stationFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          ports: initialData.ports.map(p => ({...p})) // ensure ports are new objects
        }
      : {
          name: "",
          address: "",
          latitude: DEFAULT_MAP_CENTER.lat, // Default to Tashkent
          longitude: DEFAULT_MAP_CENTER.lng, // Default to Tashkent
          type: "AC",
          operator: "",
          openingHours: "24/7",
          ports: [{ type: "Type 2", powerKW: 22, status: "available", pricePerKWh: 0 }],
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

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.detail.latLng) {
        const lat = event.detail.latLng.lat;
        const lng = event.detail.latLng.lng;
        form.setValue("latitude", parseFloat(lat.toFixed(6)), { shouldValidate: true, shouldDirty: true });
        form.setValue("longitude", parseFloat(lng.toFixed(6)), { shouldValidate: true, shouldDirty: true });
    }
  }, [form]);

  const handleMarkerDragEnd = useCallback((event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          form.setValue("latitude", parseFloat(lat.toFixed(6)), { shouldValidate: true, shouldDirty: true });
          form.setValue("longitude", parseFloat(lng.toFixed(6)), { shouldValidate: true, shouldDirty: true });
      }
  }, [form]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <FormLabel>{t("address", "Address")} ({t("optional", "Optional")})</FormLabel>
                  <FormControl><Textarea {...field} placeholder={t("stationAddressPlaceholder", "Enter full address")} /></FormControl>
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
                <div style={{ height: "400px", width: "100%", borderRadius: "var(--radius)" }} className="overflow-hidden border bg-muted">
                    <Map
                        center={currentPosition.lat && currentPosition.lng ? currentPosition : initialMapCenter }
                        zoom={initialData ? DEFAULT_MAP_ZOOM + 4 : DEFAULT_MAP_ZOOM +1}
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
                    </Map>
                </div>
                <p className="text-sm text-muted-foreground">
                    {t("mapFormHelpText", "Click on the map or drag the marker to set coordinates.")}
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
              onClick={() => append({ type: "Type 2", powerKW: 22, status: "available", pricePerKWh: 0 })}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" /> {t("addPort", "Add Port")}
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {t("cancel", "Cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
            {isSubmitting ? t("saving", "Saving...") : t("save", "Save Station")}
          </Button>
        </div>
      </form>
    </Form>
  );
}


"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Station, Port } from "@/types";
import { useLanguage } from "@/contexts/language-context";
import { StationTypeIcon } from "@/components/icons/station-type-icon";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Globe, Clock, Settings, Zap, Tag, MapPin, PowerIcon, Navigation, Heart } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { addStationToFavorites, removeStationFromFavorites } from "@/app/actions/userActions";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface StationDetailsPanelProps {
  station: Station | null;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusBadgeVariant = (status: Port["status"]): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "available":
      return "default";
    case "occupied":
      return "secondary";
    case "out_of_order":
      return "destructive";
    default:
      return "outline";
  }
};


export function StationDetailsPanel({ station, isOpen, onClose }: StationDetailsPanelProps) {
  const { t } = useLanguage();
  const { user, favoriteStationIds, addFavoriteId, removeFavoriteId: removeFavoriteIdFromContext } = useAuth();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  useEffect(() => {
    if (station && user) {
      setIsFavorite(favoriteStationIds.includes(station.id));
    } else {
      setIsFavorite(false);
    }
  }, [station, user, favoriteStationIds]);

  if (!station) return null;

  const handleGetDirections = () => {
    if (!station) return;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleToggleFavorite = async () => {
    if (!user || !station) return;
    setIsTogglingFavorite(true);
    try {
      if (isFavorite) {
        await removeStationFromFavorites(user.uid, station.id);
        removeFavoriteIdFromContext(station.id);
        toast({ title: t("removedFromFavorites", "Removed from Favorites") });
      } else {
        await addStationToFavorites(user.uid, station.id);
        addFavoriteId(station.id);
        toast({ title: t("addedToFavorites", "Added to Favorites") });
      }
      // No need to call setIsFavorite here as it's driven by the useEffect watching favoriteStationIds
    } catch (error) {
      toast({
        title: t("errorFavoriteAction", "Error updating favorites"),
        description: String(error),
        variant: "destructive",
      });
    }
    setIsTogglingFavorite(false);
  };


  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full md:max-w-md p-0 flex flex-col" side="right">
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <SheetTitle className="flex items-center gap-3 text-xl">
                <StationTypeIcon type={station.type} className="h-7 w-7 text-primary" />
                {station.name}
              </SheetTitle>
              {station.address && (
                <SheetDescription className="flex items-start gap-2 text-sm pt-1">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0"/>
                  <span>{station.address}</span>
                </SheetDescription>
              )}
            </div>
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                aria-label={isFavorite ? t("removeFromFavorites", "Remove from Favorites") : t("addToFavorites", "Add to Favorites")}
                className="ml-2 shrink-0"
              >
                <Heart className={`h-6 w-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
              </Button>
            )}
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-grow">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-md mb-3">{t("stationDetails", "Station Details")}</h3>
              <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-3 text-sm">
                <Globe className="h-5 w-5 text-muted-foreground self-center"/>
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">{t("type", "Type")}</span>
                    <span className="text-muted-foreground">{t(station.type, station.type)}</span>
                </div>

                {station.operator && (
                  <>
                    <Settings className="h-5 w-5 text-muted-foreground self-center"/>
                     <div className="flex flex-col">
                        <span className="font-medium text-foreground">{t("operator", "Operator")}</span>
                        <span className="text-muted-foreground">{station.operator}</span>
                    </div>
                  </>
                )}
                {station.openingHours && (
                  <>
                    <Clock className="h-5 w-5 text-muted-foreground self-center"/>
                    <div className="flex flex-col">
                        <span className="font-medium text-foreground">{t("openingHours", "Opening Hours")}</span>
                        <span className="text-muted-foreground">{station.openingHours}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-md mb-3">{t("ports", "Ports")}</h3>
              {station.ports && station.ports.length > 0 ? (
                <ul className="space-y-4">
                  {station.ports.map((port, index) => (
                    <li key={port.id || `port-${index}`} className="p-4 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-3">
                        <div className="font-medium flex items-center gap-2 text-foreground">
                           <PowerIcon className="h-5 w-5 text-primary" />
                           {port.type}
                        </div>
                        <Badge variant={getStatusBadgeVariant(port.status)} className="text-xs">
                          {t(port.status, port.status)}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Zap className="h-4 w-4 shrink-0" />
                            <span>{t("power", "Power")}: {port.powerKW} kW</span>
                        </div>
                        {typeof port.pricePerKWh === 'number' && (
                           <div className="flex items-center gap-2 text-muted-foreground">
                            <Tag className="h-4 w-4 shrink-0" />
                            <span>{t("price", "Price")}: {port.pricePerKWh.toLocaleString()} UZS/kWh</span>
                           </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">{t("noPortsAvailable", "No port information available.")}</p>
              )}
            </div>
          </div>
        </ScrollArea>
        <div className="p-4 border-t mt-auto bg-background flex flex-col sm:flex-row-reverse gap-2">
          <Button type="button" className="flex-1 bg-primary hover:bg-primary/90" onClick={handleGetDirections}>
            <Navigation className="mr-2 h-4 w-4" />
            {t("getDirections", "Get Directions")}
          </Button>
          <SheetClose asChild>
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              {t("close", "Close")}
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

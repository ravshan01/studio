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
import { Globe, Clock, Settings, Zap, Tag, BatteryCharging, MapPin } from "lucide-react";

interface StationDetailsPanelProps {
  station: Station | null;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusBadgeVariant = (status: Port["status"]): "default" | "secondary" | "destructive" => {
  switch (status) {
    case "available":
      return "default"; // Will use primary color in dark theme, looks like success
    case "occupied":
      return "secondary";
    case "out_of_order":
      return "destructive";
    default:
      return "secondary";
  }
};


export function StationDetailsPanel({ station, isOpen, onClose }: StationDetailsPanelProps) {
  const { t } = useLanguage();

  if (!station) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col" side="right">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <StationTypeIcon type={station.type} className="h-6 w-6 text-primary" />
            {station.name}
          </SheetTitle>
          <SheetDescription className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4"/>
            {station.address}
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="flex-grow">
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-md">{t("stationDetails", "Station Details")}</h3>
              <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-2 text-sm">
                <Globe className="h-5 w-5 text-muted-foreground"/>
                <span className="font-medium">{t("type", "Type")}:</span>
                <span>{t(station.type)}</span>

                {station.operator && (
                  <>
                    <Settings className="h-5 w-5 text-muted-foreground"/>
                    <span className="font-medium">{t("operator", "Operator")}:</span>
                    <span>{station.operator}</span>
                  </>
                )}
                {station.openingHours && (
                  <>
                    <Clock className="h-5 w-5 text-muted-foreground"/>
                    <span className="font-medium">{t("openingHours", "Opening Hours")}:</span>
                    <span>{station.openingHours}</span>
                  </>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-md">{t("ports", "Ports")}</h3>
              {station.ports.length > 0 ? (
                <ul className="space-y-4">
                  {station.ports.map((port) => (
                    <li key={port.id} className="p-4 border rounded-lg shadow-sm bg-card">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium flex items-center gap-2">
                           <BatteryCharging className="h-5 w-5 text-primary" />
                           {t('portType', "Port Type")}: {port.type}
                        </div>
                        <Badge variant={getStatusBadgeVariant(port.status)}>
                          {t(port.status, port.status)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        <Zap className="h-4 w-4 mt-0.5" />
                        <span>{t("power", "Power")}: {port.powerKW} kW</span>
                        {port.pricePerKWh !== undefined && (
                           <>
                            <Tag className="h-4 w-4 mt-0.5" />
                            <span>{t("price", "Price")}: {port.pricePerKWh} UZS/kWh</span>
                           </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No port information available.</p>
              )}
            </div>
          </div>
        </ScrollArea>
        <div className="p-6 border-t mt-auto">
          <SheetClose asChild>
            <Button type="button" variant="outline" className="w-full" onClick={onClose}>
              {t("close", "Close")}
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

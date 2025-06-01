
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
import { Globe, Clock, Settings, Zap, Tag, BatteryCharging, MapPin, PowerIcon } from "lucide-react";

interface StationDetailsPanelProps {
  station: Station | null;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusBadgeVariant = (status: Port["status"]): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "available":
      return "default"; // Using primary color, often green-ish or blue-ish
    case "occupied":
      return "secondary"; // Neutral, like gray
    case "out_of_order":
      return "destructive"; // Red
    default:
      return "outline"; // A fallback
  }
};


export function StationDetailsPanel({ station, isOpen, onClose }: StationDetailsPanelProps) {
  const { t } = useLanguage();

  if (!station) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full md:max-w-md p-0 flex flex-col" side="right">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-3 text-xl"> {/* Increased gap */}
            <StationTypeIcon type={station.type} className="h-7 w-7 text-primary" /> {/* Slightly larger icon */}
            {station.name}
          </SheetTitle>
          {station.address && (
            <SheetDescription className="flex items-start gap-2 text-sm pt-1"> {/* Align items-start for multi-line addresses */}
              <MapPin className="h-4 w-4 mt-0.5 shrink-0"/>
              <span>{station.address}</span>
            </SheetDescription>
          )}
        </SheetHeader>
        
        <ScrollArea className="flex-grow">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-md mb-3">{t("stationDetails", "Station Details")}</h3>
              <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-3 text-sm"> {/* Increased gap-y */}
                <Globe className="h-5 w-5 text-muted-foreground self-center"/>
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">{t("type", "Type")}</span>
                    <span className="text-muted-foreground">{t(station.type)}</span>
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
                  {station.ports.map((port, index) => ( // Added index for a more robust key if port.id is not perfectly unique temporarily
                    <li key={port.id || `port-${index}`} className="p-4 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-3">
                        <div className="font-medium flex items-center gap-2 text-foreground">
                           <PowerIcon className="h-5 w-5 text-primary" /> {/* Changed to PowerIcon for general port */}
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
                        {typeof port.pricePerKWh === 'number' && ( // Check if price is a number
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
        <div className="p-4 border-t mt-auto bg-background"> {/* Added p-4 and bg for consistency */}
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


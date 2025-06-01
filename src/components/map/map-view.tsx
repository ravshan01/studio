
"use client";

import { Map, useMap } from "@vis.gl/react-google-maps";
import type { Station, StationType } from "@/types";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "@/lib/constants";
import { StationMarker } from "./station-marker";
import { useState } from "react";
import { LocateFixed, Plus, Minus } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";
import { useLanguage } from "@/contexts/language-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Google Maps Dark Mode Style
const mapStyleDark = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

// Google Maps Light Mode Style (default styling, can be customized)
const mapStyleLight: google.maps.MapTypeStyle[] = [];


function UserLocationButton() {
  const map = useMap();
  const [loading, setLoading] = useState(false);

  const handleLocateUser = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map?.moveCamera({ center: userLocation, zoom: 15 });
          setLoading(false);
        },
        () => {
          // Handle error (e.g., user denied location access)
          console.error("Error getting user location.");
          setLoading(false);
        }
      );
    } else {
      // Geolocation not supported
      console.error("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleLocateUser}
      disabled={loading}
      className="absolute bottom-6 right-4 z-10 bg-background shadow-md" 
      aria-label="Locate me"
    >
      <LocateFixed className="h-5 w-5" />
    </Button>
  );
}

function ZoomControls() {
  const map = useMap();

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
      // Prevent zooming out too much (Google Maps usually has a min zoom like 0 or 1)
      if (currentZoom !== undefined && currentZoom > 0) { 
        map.setZoom(currentZoom - 1);
      }
    }
  };

  return (
    <div className="absolute bottom-[4.5rem] right-4 z-10 flex flex-col space-y-2"> 
      <Button
        variant="outline"
        size="icon"
        onClick={handleZoomIn}
        className="bg-background shadow-md"
        aria-label="Zoom in"
      >
        <Plus className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleZoomOut}
        className="bg-background shadow-md"
        aria-label="Zoom out"
      >
        <Minus className="h-5 w-5" />
      </Button>
    </div>
  );
}

interface StationTypeFilterControlProps {
  selectedType: StationType | "all";
  onTypeChange: (type: StationType | "all") => void;
}

function StationTypeFilterControl({ selectedType, onTypeChange }: StationTypeFilterControlProps) {
  const { t } = useLanguage();
  const stationTypes: (StationType | "all")[] = ["all", "AC", "DC", "Hybrid"];

  return (
    <div className="absolute top-4 right-4 z-10 bg-background p-1.5 rounded-md shadow-lg border">
      <Select
        value={selectedType}
        onValueChange={(value) => onTypeChange(value as StationType | "all")}
      >
        <SelectTrigger className="w-[160px] h-9 text-sm">
          <SelectValue placeholder={t("filterByType", "Filter by type")} />
        </SelectTrigger>
        <SelectContent>
          {stationTypes.map((type) => (
            <SelectItem key={type} value={type} className="text-sm">
              {type === "all" ? t("allTypes", "All Types") : t(type, type)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface MapViewProps {
  stations: Station[];
  onStationSelect: (station: Station) => void;
  selectedTypeFilter: StationType | "all";
  onTypeFilterChange: (type: StationType | "all") => void;
}


export function MapView({ stations, onStationSelect, selectedTypeFilter, onTypeFilterChange }: MapViewProps) {
  const { theme } = useTheme();
  
  return (
    <div className="relative h-full w-full">
      <Map
        key={theme} // Force re-render on theme change
        mapId="DEMO_MAP_ID" // Added for AdvancedMarker compatibility
        defaultCenter={DEFAULT_MAP_CENTER}
        defaultZoom={DEFAULT_MAP_ZOOM}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        styles={theme === 'dark' ? mapStyleDark : mapStyleLight}
        className="h-full w-full"
      >
        {stations.map((station) => (
          <StationMarker
            key={station.id}
            station={station}
            onClick={onStationSelect}
          />
        ))}
      </Map>
      <StationTypeFilterControl 
        selectedType={selectedTypeFilter}
        onTypeChange={onTypeFilterChange}
      />
      <ZoomControls />
      <UserLocationButton />
    </div>
  );
}


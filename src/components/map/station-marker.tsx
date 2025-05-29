
"use client";

import type { Station, StationType } from "@/types";
import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useTheme } from "@/contexts/theme-context";
import { StationTypeIcon } from "@/components/icons/station-type-icon"; // Import StationTypeIcon

interface StationMarkerProps {
  station: Station;
  onClick: (station: Station) => void;
}

const getMarkerColor = (type: StationType, theme: "light" | "dark") => {
  // Using theme colors: primary for DC, accent for AC
  // Hex values for primary (#468499), accent (#FFB347)
  // A neutral secondary color might be better
  switch (type) {
    case "DC": // Fast chargers - make them prominent (primary)
      return theme === 'dark' ? "#468499" : "#468499"; // Deep Turquoise
    case "AC": // Standard chargers - use accent
      return theme === 'dark' ? "#FFB347" : "#FFB347"; // Warm Amber
    case "Hybrid": // Hybrid - use a distinct color
      return theme === 'dark' ? "#A0AEC0" : "#718096"; // Gray
    default:
      return theme === 'dark' ? "#718096" : "#A0AEC0"; // Default gray
  }
};

export function StationMarker({ station, onClick }: StationMarkerProps) {
  const { theme } = useTheme();
  const markerColor = getMarkerColor(station.type, theme);
  const iconColor = theme === 'dark' ? "#FFFFFF" : "#2B3035";

  return (
    <AdvancedMarker
      position={{ lat: station.latitude, lng: station.longitude }}
      title={station.name}
      onClick={() => onClick(station)}
    >
      <Pin
        background={markerColor}
        borderColor={theme === 'dark' ? "#2B3035" : "#FFFFFF"} // Background color for border contrast
        glyphColor={iconColor} // This will color the StationTypeIcon
        glyph={<StationTypeIcon type={station.type} className="h-4 w-4" />} // Use StationTypeIcon as glyph
      />
    </AdvancedMarker>
  );
}

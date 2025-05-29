
"use client";

import type { Station } from "@/types";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
// Import the new dedicated map marker icon component
import { MapStationMarkerIcon } from "@/components/icons/map-station-marker-icon";

interface StationMarkerProps {
  station: Station;
  onClick: (station: Station) => void;
}

// Define visual properties for the marker
const MARKER_SIZE = 36; // Diameter of the marker in pixels
const SYMBOL_COLOR_ORANGE = "#F98E2D"; // Orange color for the symbol (lightning bolt etc.)
const CIRCLE_FILL_COLOR_WHITE = "#FFFFFF"; // White fill for the circle background
const CIRCLE_STROKE_COLOR_BLACK = "#000000"; // Black stroke for the circle outline

export function StationMarker({ station, onClick }: StationMarkerProps) {
  return (
    <AdvancedMarker
      position={{ lat: station.latitude, lng: station.longitude }}
      title={station.name}
      onClick={() => onClick(station)}
    >
      {/* Use the custom icon component */}
      <MapStationMarkerIcon
        type={station.type}
        size={MARKER_SIZE}
        symbolColor={SYMBOL_COLOR_ORANGE}
        circleFillColor={CIRCLE_FILL_COLOR_WHITE}
        circleStrokeColor={CIRCLE_STROKE_COLOR_BLACK}
      />
    </AdvancedMarker>
  );
}

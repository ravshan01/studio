
"use client";

import type { StationType } from "@/types";
import { Bolt } from "lucide-react";

interface MapStationMarkerIconProps {
  type: StationType; // This prop is received but not used to determine the icon shape for map markers.
                     // We make all map icons use the Bolt symbol for consistency.
  size: number;           // Overall diameter of the marker
  symbolColor: string;    // Color for the inner symbol (e.g., orange)
  circleFillColor: string; // Fill color of the main circle (e.g., white)
  circleStrokeColor: string; // Stroke color of the main circle (e.g., black)
}

export function MapStationMarkerIcon({
  // 'type' prop is passed from StationMarker but we always use Bolt here.
  size,
  symbolColor,
  circleFillColor,
  circleStrokeColor,
}: MapStationMarkerIconProps) {
  // Always use the Bolt icon for all station types on the map,
  // to match the user's request for uniform icons based on the provided image.
  const InnerIconComponent = Bolt;

  // Define thickness for the outer circle's stroke
  const circleStrokeThickness = Math.max(1.5, size / 12);
  // Define size for the inner symbol (lightning bolt).
  // Increased from 0.55 to 0.75 to make the bolt more prominent.
  const innerSymbolSize = size * 0.75;

  // Calculate position to center the symbol
  const symbolX = (size - innerSymbolSize) / 2;
  const symbolY = (size - innerSymbolSize) / 2;
  // Define stroke width for the inner Lucide symbol itself.
  // Set to 1 for a cleaner, more "filled" look when stroke and fill are the same color.
  const symbolItselfStrokeWidth = 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }} // Ensures proper rendering as a marker
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={(size / 2) - (circleStrokeThickness / 2)} // Adjust radius for stroke
        fill={circleFillColor}
        stroke={circleStrokeColor}
        strokeWidth={circleStrokeThickness}
      />
      {/* Group for positioning the inner Lucide icon */}
      <g transform={`translate(${symbolX}, ${symbolY})`}>
        <InnerIconComponent
          color={symbolColor} // Sets the stroke color for Lucide icons (orange)
          fill={symbolColor}   // Explicitly fill the icon with the symbol color (orange)
          size={innerSymbolSize}
          strokeWidth={symbolItselfStrokeWidth} // Use a thin stroke for a solid filled look
        />
      </g>
    </svg>
  );
}

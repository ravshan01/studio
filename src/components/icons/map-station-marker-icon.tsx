
"use client";

import type { StationType } from "@/types";
import { Bolt, Zap, Blend, HelpCircle } from "lucide-react";

interface MapStationMarkerIconProps {
  type: StationType;
  size: number;           // Overall diameter of the marker
  symbolColor: string;    // Color for the inner symbol (e.g., orange)
  circleFillColor: string; // Fill color of the main circle (e.g., white)
  circleStrokeColor: string; // Stroke color of the main circle (e.g., black)
}

export function MapStationMarkerIcon({
  type,
  size,
  symbolColor,
  circleFillColor,
  circleStrokeColor,
}: MapStationMarkerIconProps) {
  let InnerIconComponent;
  switch (type) {
    case "AC": InnerIconComponent = Bolt; break;
    case "DC": InnerIconComponent = Zap; break;
    case "Hybrid": InnerIconComponent = Blend; break;
    default: InnerIconComponent = HelpCircle; break;
  }

  // Define thickness for the outer circle's stroke
  const circleStrokeThickness = Math.max(1.5, size / 12); 
  // Define size for the inner symbol (lightning bolt, etc.)
  const innerSymbolSize = size * 0.55; 
  
  // Calculate position to center the symbol
  const symbolX = (size - innerSymbolSize) / 2;
  const symbolY = (size - innerSymbolSize) / 2;
  // Define stroke width for the inner Lucide symbol itself
  const symbolItselfStrokeWidth = Math.max(1.5, innerSymbolSize / 12);

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
          color={symbolColor} // Sets the stroke color for Lucide icons
          fill={symbolColor}   // Explicitly fill the icon with the symbol color to match image
          size={innerSymbolSize}
          strokeWidth={symbolItselfStrokeWidth}
        />
      </g>
    </svg>
  );
}

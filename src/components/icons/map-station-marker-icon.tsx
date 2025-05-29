
"use client";

import type { StationType } from "@/types";
// Lucide Bolt is no longer needed as we are using a custom SVG path.

interface MapStationMarkerIconProps {
  type: StationType; // This prop is received but not used to determine the icon shape for map markers.
                     // We make all map icons use the same lightning bolt symbol for consistency, per user request.
  size: number;           // Overall diameter of the marker
  symbolColor: string;    // Color for the inner symbol (e.g., orange)
  circleFillColor: string; // Fill color of the main circle (e.g., white)
  circleStrokeColor: string; // Stroke color of the main circle (e.g., black)
}

export function MapStationMarkerIcon({
  // 'type' prop is passed but not used for the icon shape, ensuring all map markers are visually consistent.
  size,
  symbolColor,
  circleFillColor,
  circleStrokeColor,
}: MapStationMarkerIconProps) {
  // Define thickness for the outer circle's stroke
  const circleStrokeThickness = Math.max(1.5, size / 12);
  // Define size for the inner symbol (lightning bolt).
  // 75% of the marker size makes the bolt prominent.
  const innerSymbolSize = size * 0.75;

  // Calculate position to center the symbol
  const symbolX = (size - innerSymbolSize) / 2;
  const symbolY = (size - innerSymbolSize) / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`} // Outer SVG matches the marker size
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
      {/* Group for positioning the inner SVG symbol */}
      <g transform={`translate(${symbolX}, ${symbolY})`}>
        <svg
          width={innerSymbolSize}
          height={innerSymbolSize}
          viewBox="0 0 24 24" // Standard viewBox for the chosen zigzag lightning bolt path
          fill={symbolColor}   // Symbol color applied as fill
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Zigzag lightning bolt path */}
          <path d="M7 21L10.2632 13H6L17 3L13.7368 11H18L7 21Z" />
        </svg>
      </g>
    </svg>
  );
}

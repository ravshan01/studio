
"use client";

import type { StationType } from "@/types";

interface MapStationMarkerIconProps {
  type: StationType;
  size: number;
  symbolColor: string;
  circleFillColor: string;
  circleStrokeColor: string;
}

export function MapStationMarkerIcon({
  type,
  size,
  symbolColor,
  circleFillColor,
  circleStrokeColor,
}: MapStationMarkerIconProps) {
  const circleStrokeThickness = Math.max(1.5, size / 12);
  const innerSymbolSize = size * 0.65; // Adjusted for potentially wider/taller icons

  const symbolX = (size - innerSymbolSize) / 2;
  const symbolY = (size - innerSymbolSize) / 2;

  let symbolPath;
  let viewBox = "0 0 24 24"; // Default viewBox for Lucide icons
  let useFill = false; // Default to stroke-based icons

  switch (type) {
    case "AC":
      // Lucide 'Plug' icon
      symbolPath = (
        <>
          <path d="M12 22v-5"/>
          <path d="M9 8V2"/>
          <path d="M15 8V2"/>
          <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>
        </>
      );
      break;
    case "DC":
      // Lightning Bolt Icon (existing)
      symbolPath = (
        <path
          d="M7 21L10.2632 13H6L17 3L13.7368 11H18L7 21Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
      useFill = true; // DC icon uses fill
      break;
    case "Hybrid":
      // Lucide 'Cable' icon
      symbolPath = (
        <>
          <path d="M11 18.5v-1.5a2.5 2.5 0 0 0-5 0V18c0 2.8 2.2 5 5 5h0a5 5 0 0 0 5-5v-.5a2.5 2.5 0 0 0-5 0v1.5"/>
          <path d="M9 17V8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1"/>
          <path d="M21 6A2.5 2.5 0 0 0 18.5 3H0"/>
          <path d="M3 6A2.5 2.5 0 0 0 .5 3H0"/>
        </>
      );
      break;
    default:
      // Fallback to lightning bolt if type is unrecognized
      symbolPath = (
        <path
          d="M7 21L10.2632 13H6L17 3L13.7368 11H18L7 21Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
      useFill = true;
      break;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={(size / 2) - (circleStrokeThickness / 2)}
        fill={circleFillColor}
        stroke={circleStrokeColor}
        strokeWidth={circleStrokeThickness}
      />
      <g transform={`translate(${symbolX}, ${symbolY})`}>
        <svg
          width={innerSymbolSize}
          height={innerSymbolSize}
          viewBox={viewBox}
          fill={useFill ? symbolColor : "none"}
          stroke={useFill ? "none" : symbolColor}
          strokeWidth={useFill ? "0" : "2"} // Standard stroke width for line icons
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          {symbolPath}
        </svg>
      </g>
    </svg>
  );
}

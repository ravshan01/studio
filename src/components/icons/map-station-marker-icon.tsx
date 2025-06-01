
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
  const innerSymbolSize = size * 0.70; // Adjusted slightly for potentially wider icons

  const symbolX = (size - innerSymbolSize) / 2;
  const symbolY = (size - innerSymbolSize) / 2;

  let symbolPath;
  let viewBox = "0 0 24 24"; // Default viewBox

  switch (type) {
    case "AC":
      // Simple Power Plug Icon
      symbolPath = (
        <path
          d="M16 7V3h-2v4h-4V3H8v4h-.01C6.89 7 6 7.89 6 8.99v5.02C6 15.1 6.89 16 7.99 16h7.02c1.1 0 1.99-.9 1.99-2v-5.02C17.01 7.89 16.11 7 16 7z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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
      break;
    case "Hybrid":
      // Blend Icon (from Lucide)
      symbolPath = (
        <>
          <path d="M18 16H6a4 4 0 1 0 0-8h12a4 4 0 0 1 0 8Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 12v9" strokeLinecap="round" strokeLinejoin="round" />
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
          fill={symbolColor}
          stroke={type === 'Hybrid' ? symbolColor : "none"} // Hybrid icon uses stroke, others fill
          strokeWidth={type === 'Hybrid' ? "2" : "0"} // Stroke width for Hybrid icon
          xmlns="http://www.w3.org/2000/svg"
        >
          {symbolPath}
        </svg>
      </g>
    </svg>
  );
}

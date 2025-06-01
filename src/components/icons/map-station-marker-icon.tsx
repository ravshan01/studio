
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
  const innerSymbolSize = size * 0.6; // Adjusted for potentially wider/taller icons

  const symbolX = (size - innerSymbolSize) / 2;
  const symbolY = (size - innerSymbolSize) / 2;

  let symbolPath;
  let viewBox = "0 0 24 24"; // Default viewBox for Lucide icons
  let useFill = false; 
  let SvgStrokeWidth: string | number = 2;


  switch (type) {
    case "AC":
      // Lucide 'Plug' icon path
      symbolPath = (
        <>
          <path d="M12 22v-5"/>
          <path d="M9 8V2"/>
          <path d="M15 8V2"/>
          <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>
        </>
      );
      useFill = false;
      SvgStrokeWidth = 2;
      break;
    case "DC":
      // Lucide 'Zap' icon path (lightning bolt)
      symbolPath = (
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      );
      useFill = true; // Zap icon is often better filled for emphasis
      SvgStrokeWidth = 0;
      break;
    case "Hybrid":
      // Lucide 'PlugZap' icon path
      symbolPath = (
        <>
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z"/>
            <path d="M18 6h2a2 2 0 0 1 2 2v2"/>
            <path d="M18 18h2a2 2 0 0 0 2-2v-2"/>
        </>
      );
      useFill = false;
      SvgStrokeWidth = 2;
      break;
    default:
      // Fallback to a generic symbol (e.g., Zap for unknown)
      symbolPath = (
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      );
      useFill = true;
      SvgStrokeWidth = 0;
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
          strokeWidth={SvgStrokeWidth}
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

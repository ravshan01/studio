
import type { StationType } from "@/types";
import { Bolt, Zap, Blend, Circle } from "lucide-react";

interface StationTypeIconProps {
  type: StationType;
  /** Diameter of the entire glyph, which includes the white circle. */
  glyphSize: number;
  /** Color of the inner symbol (e.g., Bolt, Zap). */
  iconSymbolColor: string;
}

export function StationTypeIcon({ type, glyphSize, iconSymbolColor }: StationTypeIconProps) {
  let InnerIconComponent;
  switch (type) {
    case "AC":
      InnerIconComponent = Bolt;
      break;
    case "DC":
      InnerIconComponent = Zap;
      break;
    case "Hybrid":
      InnerIconComponent = Blend;
      break;
    default:
      InnerIconComponent = Circle;
      break;
  }

  // The inner Lucide icon should be smaller than the white circle.
  const symbolSize = glyphSize * 0.6; // Adjust ratio as needed for aesthetics
  // Calculate padding to center the symbol
  const symbolOffset = (glyphSize - symbolSize) / 2;

  return (
    <svg
      width={glyphSize}
      height={glyphSize}
      viewBox={`0 0 ${glyphSize} ${glyphSize}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none" // Important for outer SVG if inner elements have fill
    >
      <circle cx={glyphSize / 2} cy={glyphSize / 2} r={glyphSize / 2} fill="white" />
      {/* Position the InnerIconComponent within the circle */}
      {/* The Lucide components render a full <svg> tag. 
          We wrap it in a group and apply transform for positioning.
          The inner SVG will scale based on its 'size' prop.
      */}
      <g transform={`translate(${symbolOffset}, ${symbolOffset})`}>
        <InnerIconComponent size={symbolSize} color={iconSymbolColor} strokeWidth={2}/>
      </g>
    </svg>
  );
}

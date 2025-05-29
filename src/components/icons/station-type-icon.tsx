
import type { StationType } from "@/types";
import { Bolt, Zap, Blend, Circle } from "lucide-react";

interface StationTypeIconProps {
  type: StationType;
  size?: number;
  color?: string;
  className?: string; // Kept for other potential usages, but size/color are primary for markers
}

export function StationTypeIcon({ type, size = 20, color, className }: StationTypeIconProps) {
  // Default size is 20px (equivalent to h-5 w-5).
  // For markers, a smaller size like 14-16px is usually better.
  const iconProps = {
    size,
    color,
    className, // Pass className along for any other styling needs or non-marker contexts
  };

  switch (type) {
    case "AC":
      return <Bolt {...iconProps} />;
    case "DC":
      return <Zap {...iconProps} />;
    case "Hybrid":
      return <Blend {...iconProps} />;
    default:
      return <Circle {...iconProps} />; // Fallback icon
  }
}

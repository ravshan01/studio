import type { StationType } from "@/types";
import { Bolt, Zap, Blend, Circle } from "lucide-react"; // Using Bolt for AC

interface StationTypeIconProps {
  type: StationType;
  className?: string;
}

export function StationTypeIcon({ type, className }: StationTypeIconProps) {
  const commonProps = { className: className || "h-5 w-5" };
  switch (type) {
    case "AC":
      return <Bolt {...commonProps} />;
    case "DC":
      return <Zap {...commonProps} />;
    case "Hybrid":
      return <Blend {...commonProps} />;
    default:
      return <Circle {...commonProps} />; // Fallback icon
  }
}

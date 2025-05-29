
import type { StationType } from "@/types";
import { Bolt, Zap, Blend, HelpCircle } from "lucide-react";
import type { LucideProps } from "lucide-react";
import React from "react";

interface StationTypeIconProps extends LucideProps {
  type: StationType;
}

export function StationTypeIcon({ type, ...props }: StationTypeIconProps) {
  let IconComponent: React.ElementType = HelpCircle; // Default icon

  switch (type) {
    case "AC":
      IconComponent = Bolt;
      break;
    case "DC":
      IconComponent = Zap;
      break;
    case "Hybrid":
      IconComponent = Blend;
      break;
  }
  return <IconComponent {...props} />;
}

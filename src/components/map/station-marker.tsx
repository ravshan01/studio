
"use client";

import type { Station, StationType } from "@/types";
import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useTheme } from "@/contexts/theme-context";
import { StationTypeIcon } from "@/components/icons/station-type-icon";
import ReactDOMServer from 'react-dom/server';

interface StationMarkerProps {
  station: Station;
  onClick: (station: Station) => void;
}

const getMarkerColor = (type: StationType, theme: "light" | "dark") => {
  switch (type) {
    case "DC":
      return theme === 'dark' ? "#468499" : "#468499"; // Deep Turquoise
    case "AC":
      return theme === 'dark' ? "#FFB347" : "#FFB347"; // Warm Amber
    case "Hybrid":
      return theme === 'dark' ? "#A0AEC0" : "#718096"; // Gray
    default:
      return theme === 'dark' ? "#718096" : "#A0AEC0"; // Default gray
  }
};

export function StationMarker({ station, onClick }: StationMarkerProps) {
  const { theme } = useTheme();
  const markerColor = getMarkerColor(station.type, theme);
  const iconColor = theme === 'dark' ? "#FFFFFF" : "#2B3035"; // Color for the icon itself
  const iconSize = 14; // Size of the icon in pixels for the pin glyph

  // Render StationTypeIcon to an SVG string
  const iconComponent = <StationTypeIcon type={station.type} size={iconSize} color={iconColor} />;
  const svgString = ReactDOMServer.renderToStaticMarkup(iconComponent);
  
  // Create a Base64 data URI for the SVG
  // window.btoa is used as this is a "use client" component
  const glyphDataUri = typeof window !== 'undefined' 
    ? `data:image/svg+xml;base64,${window.btoa(svgString)}`
    : '';

  return (
    <AdvancedMarker
      position={{ lat: station.latitude, lng: station.longitude }}
      title={station.name}
      onClick={() => onClick(station)}
    >
      <Pin
        background={markerColor}
        borderColor={theme === 'dark' ? "#2B3035" : "#FFFFFF"} // Contrast border
        glyph={glyphDataUri} // Use the data URI as the glyph
        // glyphColor prop is not needed here as color is part of the SVG data URI
      />
    </AdvancedMarker>
  );
}

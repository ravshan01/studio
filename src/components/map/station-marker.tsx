
"use client";

import type { Station, StationType } from "@/types";
import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useTheme } from "@/contexts/theme-context";
import { StationTypeIcon } from "@/components/icons/station-type-icon";
import ReactDOMServer from 'react-dom/server';
import { useMemo } from "react"; // Import useMemo

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
  const iconSize = 14; // Size of the icon in pixels for the pin glyph

  // Memoize the glyphValue to prevent re-computation on every render unless dependencies change.
  const glyphValue = useMemo(() => {
    // This logic should only run on the client
    if (typeof window === 'undefined') {
      return undefined; // Or a placeholder character e.g. '?' for SSR if needed
    }
    
    // Calculate iconColor based on the current theme inside useMemo, as it's a dependency
    const currentIconColor = "#B8860B"; // DarkGoldenrod for a dark yellow icon

    const iconComponent = <StationTypeIcon type={station.type} size={iconSize} color={currentIconColor} />;
    const svgString = ReactDOMServer.renderToStaticMarkup(iconComponent);

    if (!svgString) {
      console.warn("StationMarker: ReactDOMServer.renderToStaticMarkup returned empty string for StationTypeIcon.");
      return station.type.charAt(0).toUpperCase() || '?'; // Fallback to first letter of type or '?'
    }

    try {
      const base64Svg = window.btoa(svgString);
      if (!base64Svg && svgString) { 
        // btoa can return empty string for an empty input svgString, 
        // but if svgString is not empty and btoa is, it's an issue.
        console.warn("StationMarker: window.btoa returned empty string for a non-empty SVG.");
        return station.type.charAt(0).toUpperCase() || '?';
      }
      const glyphDataUri = `data:image/svg+xml;base64,${base64Svg}`;
      return new URL(glyphDataUri);
    } catch (e) {
      console.error("StationMarker: Error creating URL from data URI or during btoa:", e, "\nSVG string length:", svgString.length);
      // Fallback to a simple character if URL creation fails
      return station.type.charAt(0).toUpperCase() || '?';
    }
  }, [station.type, iconSize]); // Dependencies: station.type, and iconSize. Theme removed as icon color is now fixed.

  return (
    <AdvancedMarker
      position={{ lat: station.latitude, lng: station.longitude }}
      title={station.name}
      onClick={() => onClick(station)}
    >
      <Pin
        background={markerColor}
        borderColor={theme === 'dark' ? "#2B3035" : "#FFFFFF"} // Contrast border
        glyph={glyphValue}
      />
    </AdvancedMarker>
  );
}

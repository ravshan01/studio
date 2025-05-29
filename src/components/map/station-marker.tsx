
"use client";

import type { Station } from "@/types";
import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useTheme } from "@/contexts/theme-context";
import { StationTypeIcon } from "@/components/icons/station-type-icon";
import ReactDOMServer from 'react-dom/server';
import { useMemo } from "react";

interface StationMarkerProps {
  station: Station;
  onClick: (station: Station) => void;
}

const PIN_BACKGROUND_COLOR = "#FFC107"; // Bright dark yellow
const PIN_BORDER_COLOR_LIGHT = "#FFFFFF"; // White border for light theme
const PIN_BORDER_COLOR_DARK = "#E0E0E0"; // Slightly off-white for dark theme for better map contrast if needed, or stick to white
const ICON_SYMBOL_COLOR = "#FFC107"; // Yellow for the plug/bolt icon inside the white circle

export function StationMarker({ station, onClick }: StationMarkerProps) {
  const { theme } = useTheme();

  const markerBorderColor = theme === 'dark' ? PIN_BORDER_COLOR_DARK : PIN_BORDER_COLOR_LIGHT;

  // Define the overall size of the glyph (white circle + icon)
  // This was previously `iconSize`, now it's the diameter of the white circle part of the glyph.
  const glyphOverallSize = 16; // Adjust for desired appearance

  const glyphValue = useMemo(() => {
    // This logic should only run on the client
    if (typeof window === 'undefined') {
      return undefined; 
    }
    
    const iconComponent = (
      <StationTypeIcon
        type={station.type}
        glyphSize={glyphOverallSize}
        iconSymbolColor={ICON_SYMBOL_COLOR}
      />
    );
    const svgString = ReactDOMServer.renderToStaticMarkup(iconComponent);

    if (!svgString) {
      console.warn("StationMarker: ReactDOMServer.renderToStaticMarkup returned empty string for StationTypeIcon.");
      return station.type.charAt(0).toUpperCase() || '?'; 
    }

    try {
      // Ensure string is not empty before btoa
      if (svgString.trim() === "") {
        console.warn("StationMarker: SVG string is empty before btoa.");
        return station.type.charAt(0).toUpperCase() || '?';
      }
      const base64Svg = window.btoa(svgString);
      if (!base64Svg && svgString) { 
        console.warn("StationMarker: window.btoa returned empty string for a non-empty SVG.");
        return station.type.charAt(0).toUpperCase() || '?';
      }
      const glyphDataUri = `data:image/svg+xml;base64,${base64Svg}`;
      return new URL(glyphDataUri);
    } catch (e) {
      console.error("StationMarker: Error creating URL from data URI or during btoa:", e, "\nSVG string length:", svgString.length);
      return station.type.charAt(0).toUpperCase() || '?';
    }
  // Dependencies: station.type. glyphOverallSize and ICON_SYMBOL_COLOR are constants for this memo.
  }, [station.type]); 

  return (
    <AdvancedMarker
      position={{ lat: station.latitude, lng: station.longitude }}
      title={station.name}
      onClick={() => onClick(station)}
    >
      <Pin
        background={PIN_BACKGROUND_COLOR}
        borderColor={markerBorderColor}
        glyph={glyphValue}
        // glyphColor prop is not needed as colors are embedded in the SVG glyph
      />
    </AdvancedMarker>
  );
}

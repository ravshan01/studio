
"use client";

import type { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/theme-context';
import { LanguageProvider } from '@/contexts/language-context';
import { SelectedStationProvider } from '@/contexts/selected-station-context';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Toaster } from '@/components/ui/toaster';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: Readonly<AppProvidersProps>) {
  if (!GOOGLE_MAPS_API_KEY) {
    console.error("Google Maps API Key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable.");
    // Potentially render an error message or a placeholder
  }
  return (
    <ThemeProvider>
      <LanguageProvider>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY || "fallback-key-if-absolutely-needed-for-dev-only"}>
          <SelectedStationProvider>
            {children}
            <Toaster />
          </SelectedStationProvider>
        </APIProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

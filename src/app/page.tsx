
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { MapView } from "@/components/map/map-view";
import { StationDetailsPanel } from "@/components/station-details-panel";
import { mockStations as initialMockStationsFromFile } from "@/lib/station-data";
import type { Station } from "@/types";
import { useSelectedStation } from "@/contexts/selected-station-context";

const STATIONS_STORAGE_KEY = "electroCarStationsData"; 

export default function HomePage() {
  const { selectedStation, setSelectedStation, isPanelOpen, setIsPanelOpen } = useSelectedStation();
  const [searchTerm, setSearchTerm] = useState("");
  
  const [allStations, setAllStations] = useState<Station[]>([]);
  const [displayedStations, setDisplayedStations] = useState<Station[]>([]);

  useEffect(() => {
    let loadedStations: Station[];
    if (typeof window !== 'undefined') { // Client-side only
        const stored = localStorage.getItem(STATIONS_STORAGE_KEY);
        if (stored) {
            try {
                loadedStations = JSON.parse(stored);
            } catch (error) {
                console.error("Error parsing stations from localStorage on map page. Resetting localStorage.", error);
                localStorage.removeItem(STATIONS_STORAGE_KEY); // Clear potentially corrupted data
                loadedStations = [...initialMockStationsFromFile]; // Use a fresh copy of initial data
                localStorage.setItem(STATIONS_STORAGE_KEY, JSON.stringify(loadedStations)); // Re-initialize localStorage
            }
        } else { // localStorage is empty, initialize it
            loadedStations = [...initialMockStationsFromFile]; // Use a fresh copy
            localStorage.setItem(STATIONS_STORAGE_KEY, JSON.stringify(loadedStations));
        }
    } else { // SSR fallback
        loadedStations = [...initialMockStationsFromFile]; // Use a fresh copy
    }
    setAllStations(loadedStations);
  }, []); // Empty dependency array: runs once on mount

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (!lowerSearchTerm) {
      setDisplayedStations(allStations); 
      return;
    }
    const filtered = allStations.filter(station =>
      station.name.toLowerCase().includes(lowerSearchTerm) ||
      (station.address || "").toLowerCase().includes(lowerSearchTerm)
    );
    setDisplayedStations(filtered);
  }, [searchTerm, allStations]); 

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    setIsPanelOpen(true);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showSearch={true}
      />
      <main className="flex-grow relative">
        <MapView stations={displayedStations} onStationSelect={handleStationSelect} />
      </main>
      <StationDetailsPanel
        station={selectedStation}
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
      />
    </div>
  );
}

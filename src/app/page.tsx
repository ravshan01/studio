
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { MapView } from "@/components/map/map-view";
import { StationDetailsPanel } from "@/components/station-details-panel";
import { mockStations as initialMockStationsFromFile } from "@/lib/station-data"; // Renamed import
import type { Station } from "@/types";
import { useSelectedStation } from "@/contexts/selected-station-context";

const STATIONS_STORAGE_KEY = "electroCarStationsData"; // Must be the same key as in admin panel

export default function HomePage() {
  const { selectedStation, setSelectedStation, isPanelOpen, setIsPanelOpen } = useSelectedStation();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Holds all stations loaded from localStorage or initial file
  const [allStations, setAllStations] = useState<Station[]>([]);
  // Holds stations to be displayed on the map (filtered or all)
  const [displayedStations, setDisplayedStations] = useState<Station[]>([]);

  useEffect(() => {
    // Load stations from localStorage or use initial mock data from file
    let loadedStations: Station[];
    if (typeof window !== 'undefined') {
        try {
            const stored = localStorage.getItem(STATIONS_STORAGE_KEY);
            if (stored) {
                loadedStations = JSON.parse(stored);
            } else {
                // If nothing in storage, initialize with mock data and save it
                loadedStations = [...initialMockStationsFromFile]; // Use a copy
                localStorage.setItem(STATIONS_STORAGE_KEY, JSON.stringify(loadedStations));
            }
        } catch (error) {
            console.error("Error loading/parsing stations from localStorage on map page:", error);
            loadedStations = [...initialMockStationsFromFile]; // Fallback, use a copy
        }
    } else {
        loadedStations = [...initialMockStationsFromFile]; // SSR fallback, use a copy
    }
    setAllStations(loadedStations);
    setDisplayedStations(loadedStations); // Initially display all loaded stations
  }, []); // Empty dependency array: runs once on mount

  useEffect(() => {
    // This effect filters `allStations` based on `searchTerm`
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (!lowerSearchTerm) {
      setDisplayedStations(allStations); // If no search term, display all stations
      return;
    }
    const filtered = allStations.filter(station =>
      station.name.toLowerCase().includes(lowerSearchTerm) ||
      (station.address || "").toLowerCase().includes(lowerSearchTerm)
    );
    setDisplayedStations(filtered);
  }, [searchTerm, allStations]); // Re-run when searchTerm or allStations changes

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    setIsPanelOpen(true);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
    // Optionally clear selectedStation if panel is closed by other means than selecting another station
    // setSelectedStation(null); 
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

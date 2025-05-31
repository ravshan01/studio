
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { MapView } from "@/components/map/map-view";
import { StationDetailsPanel } from "@/components/station-details-panel";
import { mockStations } from "@/lib/station-data";
import type { Station } from "@/types";
import { useSelectedStation } from "@/contexts/selected-station-context";

export default function HomePage() {
  const { selectedStation, setSelectedStation, isPanelOpen, setIsPanelOpen } = useSelectedStation();
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedStations, setDisplayedStations] = useState<Station[]>(mockStations);

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (!lowerSearchTerm) {
      setDisplayedStations(mockStations);
      return;
    }
    const filtered = mockStations.filter(station =>
      station.name.toLowerCase().includes(lowerSearchTerm) ||
      (station.address || "").toLowerCase().includes(lowerSearchTerm)
    );
    setDisplayedStations(filtered);
  }, [searchTerm]);

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

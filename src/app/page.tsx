"use client";

import { Header } from "@/components/layout/header";
import { MapView } from "@/components/map/map-view";
import { StationDetailsPanel } from "@/components/station-details-panel";
import { mockStations } from "@/lib/station-data";
import type { Station } from "@/types";
import { useSelectedStation } from "@/contexts/selected-station-context";

export default function HomePage() {
  const { selectedStation, setSelectedStation, isPanelOpen, setIsPanelOpen } = useSelectedStation();

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
      <Header />
      <main className="flex-grow relative">
        <MapView stations={mockStations} onStationSelect={handleStationSelect} />
      </main>
      <StationDetailsPanel
        station={selectedStation}
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
      />
    </div>
  );
}

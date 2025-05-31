
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { MapView } from "@/components/map/map-view";
import { StationDetailsPanel } from "@/components/station-details-panel";
import type { Station } from "@/types";
import { useSelectedStation } from "@/contexts/selected-station-context";
import { getStations } from "@/app/actions/stationActions"; // Import the server action
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";


export default function HomePage() {
  const { selectedStation, setSelectedStation, isPanelOpen, setIsPanelOpen } = useSelectedStation();
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [allStations, setAllStations] = useState<Station[]>([]);
  const [displayedStations, setDisplayedStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function loadStations() {
      setIsLoading(true);
      try {
        const stationsFromDb = await getStations();
        setAllStations(stationsFromDb);
      } catch (error) {
        console.error("Failed to load stations:", error);
        toast({
          title: t("errorFetchingStations", "Error fetching stations"),
          description: (error as Error).message,
          variant: "destructive",
        });
        setAllStations([]); // Set to empty array on error
      }
      setIsLoading(false);
    }
    loadStations();
  }, [toast, t]);

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
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p>{t("loadingStations", "Loading stations...")}</p>
          </div>
        ) : (
          <MapView stations={displayedStations} onStationSelect={handleStationSelect} />
        )}
      </main>
      <StationDetailsPanel
        station={selectedStation}
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
      />
    </div>
  );
}

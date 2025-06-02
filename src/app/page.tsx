
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { MapView } from "@/components/map/map-view";
import { StationDetailsPanel } from "@/components/station-details-panel";
import type { Station, StationType } from "@/types";
import { useSelectedStation } from "@/contexts/selected-station-context";
// import { getStations } from "@/app/actions/stationActions"; // Comment out Firestore fetching
import { mockStations } from "@/lib/station-data"; // Import mock data
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";


export default function HomePage() {
  const { selectedStation, setSelectedStation, isPanelOpen, setIsPanelOpen } = useSelectedStation();
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [allStations, setAllStations] = useState<Station[]>(mockStations); // Use mock stations directly
  const [displayedStations, setDisplayedStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Set to false as mock data is loaded synchronously
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<StationType | "all">("all");


  // useEffect(() => {
  //   async function loadStations() {
  //     setIsLoading(true);
  //     try {
  //       const stationsFromDb = await getStations();
  //       setAllStations(stationsFromDb);
  //     } catch (error) {
  //       console.error("Failed to load stations:", error);
  //       toast({
  //         title: t("errorFetchingStations", "Error fetching stations"),
  //         description: (error as Error).message,
  //         variant: "destructive",
  //       });
  //       setAllStations([]); // Set to empty array on error
  //     }
  //     setIsLoading(false);
  //   }
  //   loadStations();
  // }, [toast, t]);
  // Mock data is loaded directly, so no need for the above useEffect for fetching

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    let filtered = allStations;

    if (lowerSearchTerm) {
      filtered = filtered.filter(station =>
        station.name.toLowerCase().includes(lowerSearchTerm) ||
        (station.address || "").toLowerCase().includes(lowerSearchTerm)
      );
    }

    if (selectedTypeFilter !== "all") {
      filtered = filtered.filter(station => station.type === selectedTypeFilter);
    }

    setDisplayedStations(filtered);
  }, [searchTerm, allStations, selectedTypeFilter]); 

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
          <MapView 
            stations={displayedStations} 
            onStationSelect={handleStationSelect}
            selectedTypeFilter={selectedTypeFilter}
            onTypeFilterChange={setSelectedTypeFilter}
          />
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


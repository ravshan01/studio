
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import { Header } from "@/components/layout/header";
import { MapView } from "@/components/map/map-view";
import { StationDetailsPanel } from "@/components/station-details-panel";
import type { Station, StationType } from "@/types";
import { useSelectedStation } from "@/contexts/selected-station-context";
import { getStations } from "@/app/actions/stationActions"; 
// import { mockStations } from "@/lib/station-data"; // Using Firestore data now
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";


export default function HomePage() {
  const { selectedStation, setSelectedStation, isPanelOpen, setIsPanelOpen } = useSelectedStation();
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();
  const searchParams = useSearchParams(); // For reading URL query params
  
  const [allStations, setAllStations] = useState<Station[]>([]); 
  const [displayedStations, setDisplayedStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<StationType | "all">("all");


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
        setAllStations([]); 
      }
      setIsLoading(false);
    }
    loadStations();
  }, [toast, t]);

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

  // Effect to handle pre-selecting a station from URL query parameter
  useEffect(() => {
    const stationIdFromQuery = searchParams.get('stationId');
    if (stationIdFromQuery && allStations.length > 0) {
      const stationToSelect = allStations.find(s => s.id === stationIdFromQuery);
      if (stationToSelect) {
        setSelectedStation(stationToSelect);
        setIsPanelOpen(true);
        // Optionally, clear the query parameter from URL after use
        // router.replace('/', undefined); // or router.replace(pathname, undefined, { shallow: true });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, allStations, setSelectedStation, setIsPanelOpen]);


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
        {isLoading && allStations.length === 0 ? ( // Show loading only if stations are not yet loaded at all
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

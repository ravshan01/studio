
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StationForm } from "./components/station-form";
import { StationsTable } from "./components/stations-table";
import type { Station } from "@/types";
import { mockStations as initialMockStationsFromFile } from "@/lib/station-data";
import { useLanguage } from "@/contexts/language-context";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATIONS_STORAGE_KEY = "electroCarStationsData";

// Helper to get stations from localStorage
function getStoredStations(): Station[] {
  if (typeof window === 'undefined') return [...initialMockStationsFromFile]; // SSR fallback

  const stored = localStorage.getItem(STATIONS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error parsing stations from localStorage in getStoredStations. Resetting.", error);
      localStorage.removeItem(STATIONS_STORAGE_KEY);
    }
  }
  const initialData = [...initialMockStationsFromFile];
  localStorage.setItem(STATIONS_STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
}

// Helper to save stations to localStorage
function storeStations(stationsToStore: Station[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATIONS_STORAGE_KEY, JSON.stringify(stationsToStore));
  } catch (error) {
    console.error("Error saving stations to localStorage:", error);
  }
}

// API simulation functions updated to use localStorage
async function fetchStationsApi(): Promise<Station[]> {
  return new Promise(resolve => setTimeout(() => resolve(getStoredStations()), 100));
}

async function saveStationApi(stationData: Omit<Station, 'id'> | Station): Promise<Station[]> { // Return full list
  console.log("Saving station via localStorage:", stationData);
  let currentStations = getStoredStations();
  
  const stationId = ('id' in stationData && stationData.id) ? stationData.id : `station-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  if ('id' in stationData && stationData.id) { // Update
    const index = currentStations.findIndex(s => s.id === stationData.id);
    if (index !== -1) {
      currentStations[index] = { ...currentStations[index], ...stationData, id: stationId };
    } else { 
      const newStation = { ...stationData, id: stationId } as Station;
      currentStations.push(newStation);
    }
  } else { // Create new
    const newStation = { ...stationData, id: stationId } as Station;
    currentStations.push(newStation);
  }
  storeStations(currentStations); // Save the modified list
  
  // Read back from LS to ensure we use the stored version
  return new Promise(resolve => setTimeout(() => resolve(getStoredStations()), 50)); 
}

async function deleteStationApi(stationId: string): Promise<void> {
  console.log("Deleting station via localStorage:", stationId);
  let currentStations = getStoredStations();
  currentStations = currentStations.filter(s => s.id !== stationId);
  storeStations(currentStations);
  return new Promise(resolve => setTimeout(() => resolve(), 100));
}


export default function AdminStationsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    loadStations();
  }, []);

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    setFilteredStations(
      stations.filter(station => 
        station.name.toLowerCase().includes(lowerSearchTerm) ||
        (station.address || "").toLowerCase().includes(lowerSearchTerm)
      )
    );
  }, [searchTerm, stations]);

  const loadStations = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStationsApi();
      setStations(data);
    } catch (error) {
      toast({ title: t("errorFetchingStations", "Error fetching stations"), description: String(error), variant: "destructive" });
      setStations([...initialMockStationsFromFile]); 
    }
    setIsLoading(false);
  };

  const handleAddStation = () => {
    setEditingStation(null);
    setIsFormOpen(true);
  };

  const handleEditStation = (station: Station) => {
    setEditingStation(station);
    setIsFormOpen(true);
  };

  const handleDeleteStation = async (stationId: string) => {
    try {
      await deleteStationApi(stationId);
      toast({ title: t("stationDeleted", "Station deleted successfully") });
      loadStations(); 
    } catch (error) {
      toast({ title: t("errorDeletingStation", "Error deleting station"), description: String(error), variant: "destructive" });
    }
  };

  const handleFormSubmit = async (data: Omit<Station, 'id'> | Station) => {
    setIsSubmitting(true);
    try {
      const updatedStationsList = await saveStationApi(data);
      const stationNameForToast = ('name' in data && data.name) ? data.name : "Station";
      
      toast({ title: editingStation ? t("stationUpdated", "Station updated") : t("stationAdded", "Station added"), description: stationNameForToast });
      setStations(updatedStationsList); // Update state with the list returned by saveStationApi
      setIsFormOpen(false);
      setEditingStation(null);
      // No need to call loadStations() as setStations was called directly
    } catch (error) {
      toast({ title: t("errorSavingStation", "Error saving station"), description: String(error), variant: "destructive" });
      // If saving failed, we might want to reload stations to reflect actual persisted state
      loadStations();
    }
    setIsSubmitting(false);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingStation(null);
  };


  if (isFormOpen) {
    return (
        <StationForm
          initialData={editingStation}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isSubmitting={isSubmitting}
        />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">{t("stationList", "Station List")}</h1>
        <Button onClick={handleAddStation} className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" /> {t("addStation", "Add New Station")}
        </Button>
      </div>

      <Card>
        <CardHeader>
           <CardTitle>{t("filterStations", "Filter Stations")}</CardTitle>
        </CardHeader>
        <CardContent>
            <Input 
                type="text"
                placeholder={t("searchByNameOrAddress", "Search by name or address...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
        </CardContent>
      </Card>

      {isLoading ? (
        <p>{t("loadingStations", "Loading stations...")}</p>
      ) : (
        <StationsTable
          stations={filteredStations}
          onEdit={handleEditStation}
          onDelete={handleDeleteStation}
        />
      )}
    </div>
  );
}

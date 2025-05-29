"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StationForm } from "./components/station-form";
import { StationsTable } from "./components/stations-table";
import type { Station } from "@/types";
import { mockStations } from "@/lib/station-data"; // Using mock data
import { useLanguage } from "@/contexts/language-context";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


// In a real app, this would involve API calls. We'll simulate it.
async function fetchStations(): Promise<Station[]> {
  return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(mockStations))), 500));
}

async function saveStationApi(stationData: Omit<Station, 'id'> | Station): Promise<Station> {
  console.log("Saving station:", stationData);
  // Simulate API call
  return new Promise(resolve => setTimeout(() => {
    if ('id' in stationData) { // Update
      const index = mockStations.findIndex(s => s.id === stationData.id);
      if (index !== -1) mockStations[index] = { ...mockStations[index], ...stationData };
      resolve(stationData as Station);
    } else { // Create
      const newStation = { ...stationData, id: `station-${Date.now()}` };
      mockStations.push(newStation);
      resolve(newStation);
    }
  }, 500));
}

async function deleteStationApi(stationId: string): Promise<void> {
  console.log("Deleting station:", stationId);
   // Simulate API call
  return new Promise(resolve => setTimeout(() => {
    const index = mockStations.findIndex(s => s.id === stationId);
    if (index !== -1) mockStations.splice(index, 1);
    resolve();
  }, 500));
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
        station.address.toLowerCase().includes(lowerSearchTerm)
      )
    );
  }, [searchTerm, stations]);

  const loadStations = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStations();
      setStations(data);
    } catch (error) {
      toast({ title: t("errorFetchingStations", "Error fetching stations"), description: String(error), variant: "destructive" });
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
      loadStations(); // Refresh list
    } catch (error) {
      toast({ title: t("errorDeletingStation", "Error deleting station"), description: String(error), variant: "destructive" });
    }
  };

  const handleFormSubmit = async (data: Omit<Station, 'id'> | Station) => {
    setIsSubmitting(true);
    try {
      const savedStation = await saveStationApi(data);
      toast({ title: editingStation ? t("stationUpdated", "Station updated") : t("stationAdded", "Station added"), description: savedStation.name });
      setIsFormOpen(false);
      setEditingStation(null);
      loadStations();
    } catch (error) {
      toast({ title: t("errorSavingStation", "Error saving station"), description: String(error), variant: "destructive" });
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

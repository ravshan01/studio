
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StationForm } from "./components/station-form";
import { StationsTable } from "./components/stations-table";
import type { Station } from "@/types";
import { useLanguage } from "@/contexts/language-context";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStations, addStation, updateStation, deleteStation } from "@/app/actions/stationActions";

export default function AdminStationsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadStations = async () => {
    setIsLoading(true);
    try {
      const data = await getStations();
      setStations(data);
    } catch (error) {
      toast({ title: t("errorFetchingStations", "Error fetching stations"), description: String(error), variant: "destructive" });
      setStations([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadStations();
  }, [t, toast]); // Added t and toast to dependencies as they are used in loadStations error handling

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    setFilteredStations(
      stations.filter(station =>
        station.name.toLowerCase().includes(lowerSearchTerm) ||
        (station.address || "").toLowerCase().includes(lowerSearchTerm)
      )
    );
  }, [searchTerm, stations]);

  const handleAddStation = () => {
    setEditingStation(null);
    setIsFormOpen(true);
  };

  const handleEditStation = (station: Station) => {
    setEditingStation(station);
    setIsFormOpen(true);
  };

  const handleDeleteStation = async (stationId: string) => {
    setIsDeleting(true);
    try {
      await deleteStation(stationId);
      toast({ title: t("stationDeleted", "Station deleted successfully") });
      await loadStations();
      // If the deleted station was being edited, close the form
      if (editingStation?.id === stationId) {
        setIsFormOpen(false);
        setEditingStation(null);
      }
    } catch (error) {
      toast({ title: t("errorDeletingStation", "Error deleting station"), description: String(error), variant: "destructive" });
    }
    setIsDeleting(false);
  };

  const handleFormSubmit = async (data: Omit<Station, 'id'> & { id?: string }) => {
    setIsSubmitting(true);
    try {
      if (editingStation && editingStation.id) {
        const { id, ...updateData } = data;
        await updateStation(editingStation.id, updateData);
        toast({ title: t("stationUpdated", "Station updated") });
      } else {
        const { id, ...addData } = data;
        await addStation(addData);
        toast({ title: t("stationAdded", "Station added") });
      }
      await loadStations();
      setIsFormOpen(false);
      setEditingStation(null);
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
          onDelete={editingStation?.id ? handleDeleteStation : undefined}
          isSubmitting={isSubmitting}
          isDeleting={isDeleting}
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
                className="w-full sm:max-w-sm"
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

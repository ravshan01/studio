
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StationForm } from "./components/station-form";
import { StationsTable } from "./components/stations-table";
import type { Station } from "@/types";
import { useLanguage } from "@/contexts/language-context";
import { PlusCircle, UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStations, addStation, updateStation, deleteStation, bulkAddMockStations } from "@/app/actions/stationActions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

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
  const [isBulkImporting, setIsBulkImporting] = useState(false);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...updateData } = data;
        await updateStation(editingStation.id, updateData);
        toast({ title: t("stationUpdated", "Station updated") });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const handleBulkImport = async () => {
    setIsBulkImporting(true);
    try {
      const result = await bulkAddMockStations();
      toast({
        title: result.success ? t("bulkImportSuccessTitle", "Bulk Import Successful") : t("bulkImportPartialFailTitle", "Bulk Import Issue"),
        description: `${result.message} ${result.errors.length > 0 ? t("bulkImportErrorsCount", `Errors: ${result.errors.length}`) : ''}`,
        variant: result.success && result.errors.length === 0 ? "default" : "destructive",
        duration: result.errors.length > 0 || !result.success ? 10000 : 5000,
      });
      if (result.errors.length > 0) {
        console.error("Bulk import errors:", result.errors);
      }
      if (result.importedCount > 0) {
        await loadStations();
      }
    } catch (error) {
      toast({ title: t("bulkImportErrorTitle", "Bulk Import Failed"), description: String(error), variant: "destructive" });
    }
    setIsBulkImporting(false);
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
        <Button onClick={handleAddStation} className="flex items-center gap-2" disabled={isBulkImporting}>
          <PlusCircle className="h-5 w-5" /> {t("addStation", "Add New Station")}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
           <CardTitle>{t("advancedOperations", "Advanced Operations")}</CardTitle>
        </CardHeader>
        <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" disabled={isBulkImporting}>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  {isBulkImporting ? t("bulkImportingInProgress", "Importing...") : t("bulkImportButtonLabel", "Import Mock Stations")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("bulkImportConfirmTitle", "Confirm Mock Data Import")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("bulkImportConfirmMsg", "This will attempt to add all stations from the mock data file into the database. This operation is intended for initial setup. Running it multiple times may create duplicate entries. Are you sure you want to proceed?")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isBulkImporting}>{t("cancel", "Cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkImport} disabled={isBulkImporting}>
                    {isBulkImporting ? t("bulkImportingInProgress", "Importing...") : t("confirm", "Confirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-sm text-muted-foreground mt-2">{t("bulkImportWarning", "Warning: Use this feature осторожно for initial data population. It may create duplicates if run on an existing dataset.")}</p>
        </CardContent>
      </Card>
      <Separator />

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
                disabled={isBulkImporting}
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

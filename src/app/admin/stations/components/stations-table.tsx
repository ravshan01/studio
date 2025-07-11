
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Station } from "@/types";
import { Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
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
import { Card, CardContent } from "@/components/ui/card";

interface StationsTableProps {
  stations: Station[];
  onEdit: (station: Station) => void;
  onDelete: (stationId: string) => Promise<void>;
}

export function StationsTable({ stations, onEdit, onDelete }: StationsTableProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("stationName", "Name")}</TableHead>
              <TableHead>{t("address", "Address")}</TableHead>
              <TableHead>{t("type", "Type")}</TableHead>
              <TableHead className="text-center">{t("ports", "Ports")}</TableHead>
              <TableHead className="text-right">{t("actions", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stations.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  {t("noStationsFound", "No stations found.")}
                </TableCell>
              </TableRow>
            )}
            {stations.map((station) => (
              <TableRow
                key={station.id}
                onClick={() => onEdit(station)}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell className="font-medium">{station.name}</TableCell>
                <TableCell className="max-w-xs truncate">{station.address}</TableCell>
                <TableCell>
                  <Badge variant={station.type === 'DC' ? 'default' : station.type === 'AC' ? 'secondary' : 'outline'}>
                    {t(station.type, station.type)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">{station.ports.length}</TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()} >
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        aria-label={t("delete", "Delete")}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("confirmDeleteTitle", "Confirm Deletion")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("confirmDeleteStationMsg", `Are you sure you want to delete station "${station.name}"? This action cannot be undone.`).replace("{stationName}", station.name)}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("cancel", "Cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => await onDelete(station.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {t("delete", "Delete")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

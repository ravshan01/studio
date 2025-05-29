"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { ListChecks, MapIcon, Users } from "lucide-react"; // Assuming MapIcon exists for generic map icon

export default function AdminDashboardPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("dashboard", "Dashboard")}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-6 w-6 text-primary" />
              {t("manageStations", "Manage Stations")}
            </CardTitle>
            <CardDescription>{t("stationsDashboardDesc", "View, add, edit, or delete charging stations.")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/stations">{t("goToStations", "Go to Stations")}</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              {t("manageUsers", "Manage Users")}
            </CardTitle>
            <CardDescription>{t("usersDashboardDesc", "Oversee user accounts and permissions (Future Feature).")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>{t("goToUsers", "Go to Users (Soon)")}</Button>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <MapIcon className="h-6 w-6 text-primary" />
              {t("viewMap", "View Live Map")}
            </CardTitle>
            <CardDescription>{t("mapDashboardDesc", "Return to the main map view of charging stations.")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="/">{t("openMap", "Open Map")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

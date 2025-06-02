
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { getStationsByIds } from "@/app/actions/stationActions";
import { removeStationFromFavorites } from "@/app/actions/userActions";
import type { Station } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { Loader2, MapPin, Trash2, Eye, HeartCrack, Frown } from "lucide-react";
import Link from "next/link";

export default function MyFavoritesPage() {
  const { user, loading: authLoading, favoriteStationIds, removeFavoriteId: removeFavoriteIdFromContext } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [favoriteStations, setFavoriteStations] = useState<Station[]>([]);
  const [isLoadingStations, setIsLoadingStations] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null); // Store ID of station being removed

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/"); // Redirect to home if not logged in
      toast({ title: t("loginRequiredTitle", "Login Required"), description: t("loginRequiredForFavoritesDesc", "Please log in to view your favorites."), variant: "destructive" });
      return;
    }

    if (favoriteStationIds.length > 0) {
      setIsLoadingStations(true);
      getStationsByIds(favoriteStationIds)
        .then(setFavoriteStations)
        .catch(err => {
          console.error("Error fetching favorite stations:", err);
          toast({ title: t("errorFetchingStations", "Error fetching stations"), description: String(err), variant: "destructive" });
          setFavoriteStations([]);
        })
        .finally(() => setIsLoadingStations(false));
    } else {
      setFavoriteStations([]);
      setIsLoadingStations(false);
    }
  }, [user, authLoading, favoriteStationIds, router, toast, t]);

  const handleRemoveFavorite = async (stationId: string) => {
    if (!user) return;
    setIsRemoving(stationId);
    try {
      await removeStationFromFavorites(user.uid, stationId);
      removeFavoriteIdFromContext(stationId); // Update context
      // No need to call setFavoriteStations here, useEffect on favoriteStationIds will re-fetch
      toast({ title: t("removedFromFavorites", "Removed from Favorites") });
    } catch (error) {
      toast({ title: t("errorFavoriteAction", "Error updating favorites"), description: String(error), variant: "destructive" });
    }
    setIsRemoving(null);
  };

  if (authLoading || (user && isLoadingStations && favoriteStationIds.length > 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">{t("loadingFavorites", "Loading your favorites...")}</p>
      </div>
    );
  }

  if (!user) {
     // Should be caught by useEffect redirect, but as a fallback
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <Frown className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold mb-2">{t("accessDenied", "Access Denied")}</h1>
        <p className="text-muted-foreground mb-6">{t("loginRequiredForFavoritesDesc", "Please log in to view your favorites.")}</p>
        <Button onClick={() => router.push('/')}>{t("backToMap", "← Back to Map View")}</Button>
      </div>
    );
  }

  if (favoriteStationIds.length === 0 || favoriteStations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <HeartCrack className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-2xl font-semibold mb-2">{t("noFavoritesTitle", "No Favorites Yet")}</h1>
        <p className="text-muted-foreground mb-6">{t("noFavoritesMessage", "You haven't added any stations to your favorites. Start exploring the map!")}</p>
        <Button asChild>
          <Link href="/">{t("exploreMap", "Explore Map")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center sm:text-left">{t("myFavoritesTitle", "My Favorite Stations")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteStations.map(station => (
          <Card key={station.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{station.name}</CardTitle>
              {station.address && (
                <CardDescription className="flex items-start gap-1.5 pt-1">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{station.address}</span>
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                {t("type", "Type")}: <span className="font-medium text-foreground">{t(station.type, station.type)}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {t("ports", "Ports")}: <span className="font-medium text-foreground">{station.ports.length}</span>
              </p>
              {/* Could add more details like operator or a summary of port types/statuses */}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => router.push(`/?stationId=${station.id}`)}
                aria-label={`${t("viewOnMap", "View on Map")} ${station.name}`}
              >
                <Eye className="mr-2 h-4 w-4" />
                {t("viewOnMapButton", "View on Map")}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => handleRemoveFavorite(station.id)}
                disabled={isRemoving === station.id}
                aria-label={`${t("removeFromFavoritesHere", "Remove from favorites")} ${station.name}`}
              >
                {isRemoving === station.id ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                {t("remove", "Remove")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

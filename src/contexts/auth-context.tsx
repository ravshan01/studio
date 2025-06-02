
"use client";

import type { ReactNode, Dispatch, SetStateAction } from "react";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { auth } from "@/lib/firebase";
import type { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { getOrCreateUserDocument, getUserFavoriteStationIds } from "@/app/actions/userActions";

interface AuthContextType {
  user: FirebaseUser | null;
  setUser: Dispatch<SetStateAction<FirebaseUser | null>>;
  loading: boolean;
  error: Error | null;
  favoriteStationIds: string[];
  fetchFavoriteStationIds: (userId: string) => Promise<void>;
  addFavoriteId: (stationId: string) => void;
  removeFavoriteId: (stationId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [favoriteStationIds, setFavoriteStationIds] = useState<string[]>([]);

  const fetchFavoriteStationIds = useCallback(async (userId: string) => {
    if (!userId) {
      setFavoriteStationIds([]);
      return;
    }
    try {
      const ids = await getUserFavoriteStationIds(userId);
      setFavoriteStationIds(ids);
    } catch (err) {
      console.error("Failed to fetch favorite station IDs in context:", err);
      setFavoriteStationIds([]); // Reset on error
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          await getOrCreateUserDocument(firebaseUser.uid, {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          });
          await fetchFavoriteStationIds(firebaseUser.uid);
        } catch (docError) {
          console.error("Error during user document creation or favorites fetch:", docError);
          // Potentially set an error state or clear favorites
          setFavoriteStationIds([]);
        }
      } else {
        setFavoriteStationIds([]); // Clear favorites if no user
      }
      setLoading(false);
    }, (err) => {
      setError(err);
      setFavoriteStationIds([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchFavoriteStationIds]);

  const addFavoriteId = (stationId: string) => {
    setFavoriteStationIds((prevIds) => [...new Set([...prevIds, stationId])]);
  };

  const removeFavoriteId = (stationId: string) => {
    setFavoriteStationIds((prevIds) => prevIds.filter(id => id !== stationId));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, error, favoriteStationIds, fetchFavoriteStationIds, addFavoriteId, removeFavoriteId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

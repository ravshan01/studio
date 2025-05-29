"use client";

import type { ReactNode, Dispatch, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";
import type { Station } from "@/types";

interface SelectedStationContextType {
  selectedStation: Station | null;
  setSelectedStation: Dispatch<SetStateAction<Station | null>>;
  isPanelOpen: boolean;
  setIsPanelOpen: Dispatch<SetStateAction<boolean>>;
}

const SelectedStationContext = createContext<SelectedStationContextType | undefined>(undefined);

export function SelectedStationProvider({ children }: { children: ReactNode }) {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <SelectedStationContext.Provider value={{ selectedStation, setSelectedStation, isPanelOpen, setIsPanelOpen }}>
      {children}
    </SelectedStationContext.Provider>
  );
}

export function useSelectedStation() {
  const context = useContext(SelectedStationContext);
  if (context === undefined) {
    throw new Error("useSelectedStation must be used within a SelectedStationProvider");
  }
  return context;
}

export type StationType = "AC" | "DC" | "Hybrid";

export interface Port {
  id: string;
  type: "Type 1" | "Type 2" | "CCS" | "CHAdeMO";
  powerKW: number;
  status: "available" | "occupied" | "out_of_order";
  pricePerKWh?: number; // Optional price
}

export interface Station {
  id: string;
  name: string;
  address?: string; // Made address optional
  latitude: number;
  longitude: number;
  type: StationType;
  ports: Port[];
  operator?: string;
  openingHours?: string;
}

export type Language = "en" | "ru" | "uz";

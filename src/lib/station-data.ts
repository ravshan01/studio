import type { Station } from "@/types";

export const mockStations: Station[] = [
  {
    id: "station-1",
    name: "Tashkent City Charger",
    address: "1 Navoi Street, Tashkent",
    latitude: 41.311081,
    longitude: 69.240562,
    type: "DC",
    ports: [
      { id: "p1-1", type: "CCS", powerKW: 50, status: "available", pricePerKWh: 2500 },
      { id: "p1-2", type: "CHAdeMO", powerKW: 50, status: "occupied", pricePerKWh: 2500 },
    ],
    operator: "ElectroCar",
    openingHours: "24/7",
  },
  {
    id: "station-2",
    name: "Mega Planet SuperCharge",
    address: "17 Zulfiyakhanum Street, Tashkent",
    latitude: 41.3357,
    longitude: 69.2883,
    type: "AC",
    ports: [
      { id: "p2-1", type: "Type 2", powerKW: 22, status: "available", pricePerKWh: 1500 },
      { id: "p2-2", type: "Type 2", powerKW: 22, status: "available", pricePerKWh: 1500 },
    ],
    operator: "UzCharge",
    openingHours: "08:00 - 22:00",
  },
  {
    id: "station-3",
    name: "Samarqand Darvoza Hybrid Point",
    address: "5A Samarqand Darvoza Street, Tashkent",
    latitude: 41.3195,
    longitude: 69.2288,
    type: "Hybrid",
    ports: [
      { id: "p3-1", type: "CCS", powerKW: 60, status: "out_of_order", pricePerKWh: 2800 },
      { id: "p3-2", type: "Type 2", powerKW: 11, status: "available", pricePerKWh: 1200 },
    ],
    operator: "ElectroCar",
    openingHours: "24/7",
  },
  {
    id: "station-4",
    name: "Airport Fast Charge",
    address: "Tashkent International Airport",
    latitude: 41.2579,
    longitude: 69.2821,
    type: "DC",
    ports: [
      { id: "p4-1", type: "CCS", powerKW: 120, status: "available", pricePerKWh: 3000 },
      { id: "p4-2", type: "CHAdeMO", powerKW: 50, status: "available", pricePerKWh: 2500 },
    ],
    operator: "ChargeNet",
    openingHours: "24/7",
  }
];

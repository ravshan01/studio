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
  },
  {
    id: "station-5",
    name: "Yunusabad EcoCharge",
    address: "7 Amir Temur Avenue, Yunusabad District, Tashkent",
    latitude: 41.3450,
    longitude: 69.2880,
    type: "AC",
    ports: [
      { id: "p5-1", type: "Type 2", powerKW: 22, status: "available", pricePerKWh: 1600 },
      { id: "p5-2", type: "Type 2", powerKW: 11, status: "occupied", pricePerKWh: 1400 }
    ],
    operator: "Tashkent Charge",
    openingHours: "24/7",
  },
  {
    id: "station-6",
    name: "Chilonzor QuickPower",
    address: "1 Lutfi Street, Chilonzor District, Tashkent",
    latitude: 41.2775,
    longitude: 69.2021,
    type: "DC",
    ports: [
      { id: "p6-1", type: "CCS", powerKW: 75, status: "available", pricePerKWh: 2900 }
    ],
    operator: "ElectroCar",
    openingHours: "07:00 - 23:00",
  },
  {
    id: "station-7",
    name: "Mirzo Ulugbek Innovation Hub EV",
    address: "22 Ibrat St, Mirzo Ulugbek District, Tashkent",
    latitude: 41.3220,
    longitude: 69.3300,
    type: "Hybrid",
    ports: [
      { id: "p7-1", type: "CHAdeMO", powerKW: 40, status: "out_of_order", pricePerKWh: 2000 },
      { id: "p7-2", type: "Type 2", powerKW: 22, status: "available", pricePerKWh: 1500 }
    ],
    operator: "UzCharge",
    openingHours: "Mon-Fri 09:00 - 18:00",
  },
  {
    id: "station-8",
    name: "Sergeli Bazaar EV Point",
    address: "Sergeli Dehqon Bozori, Sergeli District, Tashkent",
    latitude: 41.2250,
    longitude: 69.2080,
    type: "AC",
    ports: [
      { id: "p8-1", type: "Type 1", powerKW: 7.4, status: "available", pricePerKWh: 1000 },
      { id: "p8-2", type: "Type 2", powerKW: 7.4, status: "available", pricePerKWh: 1000 }
    ],
    operator: "Local Power",
    openingHours: "06:00 - 20:00",
  },
  {
    id: "station-9",
    name: "Magic City Park Charger",
    address: "Magic City Park, Babur Street, Tashkent",
    latitude: 41.2922, // Approximate location
    longitude: 69.2487, // Approximate location
    type: "DC",
    ports: [
      { id: "p9-1", type: "CCS", powerKW: 75, status: "available", pricePerKWh: 2800 },
      { id: "p9-2", type: "CCS", powerKW: 75, status: "occupied", pricePerKWh: 2800 },
    ],
    operator: "ElectroCar",
    openingHours: "10:00 - 23:00",
  },
  {
    id: "station-10",
    name: "Next Shopping Mall AC Point",
    address: "Next Mall, Bobur Street, Yakkasaray District, Tashkent",
    latitude: 41.2865, // Approximate location
    longitude: 69.2495, // Approximate location
    type: "AC",
    ports: [
      { id: "p10-1", type: "Type 2", powerKW: 22, status: "available", pricePerKWh: 1500 },
      { id: "p10-2", type: "Type 2", powerKW: 22, status: "available", pricePerKWh: 1500 },
      { id: "p10-3", type: "Type 2", powerKW: 11, status: "out_of_order", pricePerKWh: 1400 },
    ],
    operator: "UzCharge",
    openingHours: "24/7",
  },
  {
    id: "station-11",
    name: "Grand Mir Hotel EV Stop",
    address: "2 Mirabad Street, Tashkent", // Grand Mir Hotel actual address
    latitude: 41.29801, // More precise for Grand Mir
    longitude: 69.26800, // More precise for Grand Mir
    type: "Hybrid",
    ports: [
      { id: "p11-1", type: "CCS", powerKW: 50, status: "available", pricePerKWh: 3000 },
      { id: "p11-2", type: "Type 2", powerKW: 22, status: "available", pricePerKWh: 1800 },
    ],
    operator: "ChargeNet",
    openingHours: "24/7",
  },
  {
    id: "station-12",
    name: "Chorsu Bazaar Public Charging",
    address: "Near Chorsu Bazaar, Sagban Street, Old City, Tashkent",
    latitude: 41.3265, // Approximate for Chorsu Bazaar
    longitude: 69.2372, // Approximate for Chorsu Bazaar
    type: "AC",
    ports: [
      { id: "p12-1", type: "Type 1", powerKW: 7.4, status: "available", pricePerKWh: 1200 },
      { id: "p12-2", type: "Type 2", powerKW: 11, status: "available", pricePerKWh: 1300 },
      { id: "p12-3", type: "Type 2", powerKW: 7.4, status: "occupied", pricePerKWh: 1200 },
    ],
    operator: "Tashkent Charge",
    openingHours: "07:00 - 19:00",
  }
];


'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, DocumentData, Timestamp, getDoc, query, where, documentId } from 'firebase/firestore';
import type { Station, Port } from '@/types';
import { revalidatePath } from 'next/cache';
import { mockStations } from '@/lib/station-data'; // Import mock stations

// Helper to convert Firestore Timestamps in ports to string or keep as is if not a Timestamp
const processPortsForClient = (ports: any[]): Port[] => {
  return ports.map(port => ({
    ...port,
    // Firestore timestamps might be nested, ensure they are handled if needed.
    // For now, assuming port structure is flat and doesn't contain Timestamps directly that need conversion.
    // If pricePerKWh or powerKW were Timestamps, they'd need similar handling.
  })) as Port[];
};


const stationFromDoc = (docSnap: DocumentData): Station => {
  const data = docSnap.data();
  if (!data) throw new Error(`No data for station ${docSnap.id}`);
  return {
    id: docSnap.id,
    name: data.name,
    address: data.address,
    latitude: data.latitude,
    longitude: data.longitude,
    type: data.type,
    operator: data.operator,
    openingHours: data.openingHours,
    ports: processPortsForClient(data.ports || []),
  } as Station;
};

export async function getStations(): Promise<Station[]> {
  try {
    const stationsCol = collection(db, 'stations');
    const stationSnapshot = await getDocs(stationsCol);
    const stationList = stationSnapshot.docs.map(doc => stationFromDoc(doc));
    return stationList;
  } catch (error) {
    console.error("Error fetching stations: ", error);
    throw new Error("Failed to fetch stations.");
  }
}

export async function getStationsByIds(ids: string[]): Promise<Station[]> {
  if (!ids || ids.length === 0) {
    return [];
  }
  try {
    // Firestore 'in' query has a limit of 30 items in the array.
    // If you expect more than 30 favorite stations, you'll need to batch these requests.
    // For now, assuming less than 30.
    const stationsCol = collection(db, 'stations');
    const q = query(stationsCol, where(documentId(), 'in', ids));
    const stationSnapshot = await getDocs(q);
    
    const stationList = stationSnapshot.docs.map(docSnap => stationFromDoc(docSnap));
    // The order of results from an 'in' query is not guaranteed.
    // We might need to reorder them based on the original 'ids' array if order matters.
    // For favorites, order might not be critical, or could be based on when they were added.
    return stationList;
  } catch (error) {
    console.error("Error fetching stations by IDs: ", error);
    throw new Error("Failed to fetch stations by IDs.");
  }
}


export async function addStation(stationData: Omit<Station, 'id'>): Promise<Station> {
  try {
    const docRef = await addDoc(collection(db, 'stations'), stationData);
    revalidatePath('/admin/stations');
    revalidatePath('/');
    revalidatePath('/favorites');
    const newDocSnap = await getDoc(docRef);
    return stationFromDoc(newDocSnap);
  } catch (error) {
    console.error("Error adding station: ", error);
    throw new Error("Failed to add station.");
  }
}

export async function updateStation(id: string, stationData: Partial<Omit<Station, 'id'>>): Promise<void> {
  try {
    const stationDoc = doc(db, 'stations', id);
    await updateDoc(stationDoc, stationData);
    revalidatePath('/admin/stations');
    revalidatePath('/');
    revalidatePath(`/admin/stations/${id}/edit`);
    revalidatePath('/favorites');
  } catch (error) {
    console.error("Error updating station: ", error);
    throw new Error("Failed to update station.");
  }
}

export async function deleteStation(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'stations', id));
    revalidatePath('/admin/stations');
    revalidatePath('/');
    revalidatePath('/favorites');
  } catch (error) {
    console.error("Error deleting station: ", error);
    throw new Error("Failed to delete station.");
  }
}

export async function bulkAddMockStations(): Promise<{ success: boolean; message: string; importedCount: number; totalCount: number; errors: string[] }> {
  try {
    const stationsToImport = mockStations;
    let importedCount = 0;
    const errors: string[] = [];

    for (const station of stationsToImport) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...stationDataForDb } = station; // Remove mock ID, Firestore will generate one
      try {
        await addDoc(collection(db, 'stations'), stationDataForDb);
        importedCount++;
      } catch (e: any) {
        console.error(`Error adding station ${station.name} during bulk import: `, e);
        errors.push(`Failed to import ${station.name}: ${e.message}`);
      }
    }

    if (importedCount > 0) {
      revalidatePath('/admin/stations');
      revalidatePath('/'); 
      revalidatePath('/favorites');
    }

    if (errors.length > 0) {
      return {
        success: importedCount > 0, // Success is true if at least one was imported
        message: `Bulk import completed. Imported ${importedCount} out of ${stationsToImport.length} stations. Some errors occurred.`,
        importedCount,
        totalCount: stationsToImport.length,
        errors,
      };
    }

    return {
      success: true,
      message: `Successfully imported ${importedCount} out of ${stationsToImport.length} stations.`,
      importedCount,
      totalCount: stationsToImport.length,
      errors: [],
    };
  } catch (error: any) {
    console.error("Error in bulkAddMockStations: ", error);
    return {
      success: false,
      message: "A general error occurred during bulk import. Check console for details.",
      importedCount: 0,
      totalCount: mockStations.length,
      errors: [error.message || "Unknown error"],
    };
  }
}

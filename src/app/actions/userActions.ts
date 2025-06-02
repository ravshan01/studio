
'use server';

import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, Timestamp,FieldValue  } from 'firebase/firestore';
import type { Station } from '@/types';

interface UserData {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  createdAt?: FieldValue;
  favoriteStationIds?: string[];
}

export async function getOrCreateUserDocument(
  userId: string,
  userData: { email?: string | null; displayName?: string | null }
): Promise<void> {
  const userDocRef = doc(db, 'users', userId);
  try {
    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        uid: userId,
        email: userData.email || '',
        displayName: userData.displayName || '',
        createdAt: Timestamp.now(),
        favoriteStationIds: [],
      });
      console.log('User document created for:', userId);
    } else {
      // Optionally update display name or email if they change, though not strictly necessary for favorites
      // await updateDoc(userDocRef, {
      //   displayName: userData.displayName || userDocSnap.data()?.displayName,
      //   email: userData.email || userDocSnap.data()?.email,
      // });
      console.log('User document already exists for:', userId);
    }
  } catch (error) {
    console.error('Error ensuring user document:', error);
    // Potentially throw new Error("Failed to ensure user document.");
    // For now, we'll log and let auth proceed. Critical for favorites though.
  }
}

export async function addStationToFavorites(userId: string, stationId: string): Promise<void> {
  if (!userId) throw new Error('User ID is required to add favorites.');
  const userDocRef = doc(db, 'users', userId);
  try {
    await updateDoc(userDocRef, {
      favoriteStationIds: arrayUnion(stationId),
    });
  } catch (error) {
    console.error('Error adding station to favorites:', error);
    throw new Error('Failed to add station to favorites.');
  }
}

export async function removeStationFromFavorites(userId: string, stationId: string): Promise<void> {
  if (!userId) throw new Error('User ID is required to remove favorites.');
  const userDocRef = doc(db, 'users', userId);
  try {
    await updateDoc(userDocRef, {
      favoriteStationIds: arrayRemove(stationId),
    });
  } catch (error) {
    console.error('Error removing station from favorites:', error);
    throw new Error('Failed to remove station from favorites.');
  }
}

export async function getUserFavoriteStationIds(userId: string): Promise<string[]> {
  if (!userId) return [];
  const userDocRef = doc(db, 'users', userId);
  try {
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data() as UserData;
      return userData.favoriteStationIds || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching user favorite station IDs:', error);
    // Consider how to handle this error in the UI, perhaps by returning empty or throwing
    return []; 
  }
}

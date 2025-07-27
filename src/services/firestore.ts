import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  Firestore,
  Timestamp,
} from 'firebase/firestore';
import { getDatabase } from '@config/firebase';

/**
 * Data shape for a user's profile document in Firestore.
 */
export interface UserProfile {
  onboardingArchetype?: string | null;
  pantryLastUpdated?: number | null;
  consecutiveInactiveOpens?: number;
}

/**
 * Get a reference to the user's pantry collection in Firestore.
 *
 * @param db - Firestore instance
 * @param userId - Unique identifier of the user
 */
function pantryCollection(db: Firestore, userId: string) {
  return collection(db, 'users', userId, 'pantry');
}

/**
 * Retrieve all pantry item names for a given user.
 *
 * @param userId - Unique identifier of the user
 */
export async function getUserPantry(userId: string): Promise<string[]> {
  const db = getDatabase();
  try {
    const snapshot = await getDocs(pantryCollection(db, userId));
    return snapshot.docs.map(doc => doc.id);
  } catch (error) {
    console.error('getUserPantry error', error);
    throw new Error('Failed to retrieve pantry');
  }
}

/**
 * Add an item to a user's pantry. If the document already exists, it is
 * overwritten with the provided data.
 *
 * @param userId - Unique identifier of the user
 * @param item - Name of the ingredient to add
 */
export async function addItemToPantry(userId: string, item: string): Promise<void> {
  const db = getDatabase();
  try {
    await setDoc(doc(db, 'users', userId, 'pantry', item.toLowerCase()), { name: item.toLowerCase() });
  } catch (error) {
    console.error('addItemToPantry error', error);
    throw new Error('Failed to add item to pantry');
  }
}

/**
 * Remove an item from a user's pantry.
 *
 * @param userId - Unique identifier of the user
 * @param item - Name of the ingredient to remove
 */
export async function removeItemFromPantry(userId: string, item: string): Promise<void> {
  const db = getDatabase();
  try {
    await deleteDoc(doc(db, 'users', userId, 'pantry', item.toLowerCase()));
  } catch (error) {
    console.error('removeItemFromPantry error', error);
    throw new Error('Failed to remove item from pantry');
  }
}

/**
 * Update fields on the user's profile document. Existing data not specified
 * in the partial update is preserved.
 *
 * @param userId - Unique identifier of the user
 * @param data - Partial profile data to merge
 */
export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
  const db = getDatabase();
  try {
    await setDoc(doc(db, 'users', userId, 'profile'), data, { merge: true });
  } catch (error) {
    console.error('updateUserProfile error', error);
    throw new Error('Failed to update user profile');
  }
}
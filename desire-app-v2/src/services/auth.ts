import { signOut } from 'firebase/auth';
import { getAuthInstance } from '@config/firebase';
import { showToast } from '@utils/toastService';
import { useUserStore } from '@store/userStore';
import { usePantryStore } from '@store/pantryStore';

/**
 * Sign the current user out of Firebase and clear all local state. This
 * function should be called when the user explicitly requests to log out.
 * It will trigger Firebase's signOut method and then reset both the
 * user and pantry stores to prevent any data from leaking between
 * sessions.
 */
export async function signOutUser(): Promise<void> {
  const auth = getAuthInstance();
  try {
    await signOut(auth);
  } catch (error) {
    showToast('Failed to sign out');
    throw error;
  }
  // Clear local Zustand stores after signing out
  useUserStore.getState().actions.resetUser();
  usePantryStore.getState().actions.resetPantry();
}
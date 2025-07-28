import { useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getAuthInstance } from '@config/firebase';
import { getUserProfile, getUserPantry, UserProfile } from '@services/firestore';
import { useUserStore } from '@store/userStore';
import { usePantryStore } from '@store/pantryStore';
import { showToast } from '@utils/toastService';

/**
 * Hook that subscribes to Firebase Authentication state and hydrates
 * application state when a user signs in. When the authentication state
 * changes, this hook updates the user identifier in the user store,
 * fetches the associated profile and pantry from Firestore, and populates
 * the Zustand stores accordingly. It also exposes a loading flag while
 * the initial state is being determined.
 *
 * @returns An object containing the current Firebase user (or `null`) and
 *          a boolean indicating whether the auth state is still loading.
 */
export function useAuth(): { user: FirebaseUser | null; loading: boolean } {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const setUserId = useUserStore((state) => state.actions.setUserId);
  const setHasOnboarded = useUserStore((state) => state.actions.setHasOnboarded);
  const setOnboardingArchetype = useUserStore((state) => state.actions.setOnboardingArchetype);
  const setPantryLastUpdated = useUserStore((state) => state.actions.setPantryLastUpdated);
  const resetUser = useUserStore((state) => state.actions.resetUser);

  const setPantry = usePantryStore((state) => state.actions.setPantry);
  const resetPantry = usePantryStore((state) => state.actions.resetPantry);

  useEffect(() => {
    // Ensure Firebase is initialised elsewhere (App.tsx)
    const auth = getAuthInstance();
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          // User is signed in
          setCurrentUser(fbUser);
          setUserId(fbUser.uid);
          // Hydrate Firestore data
          const [profile, pantry] = await Promise.all([
            getUserProfile(fbUser.uid),
            getUserPantry(fbUser.uid),
          ]);
          // Populate pantry store
          setPantry(pantry.map((i) => i.toLowerCase()));
          // Populate user store fields; derive onboarding state
          if (profile) {
            const userProfile: UserProfile = profile;
            // Determine onboarding status based on presence of onboardingArchetype
            await setHasOnboarded(!!userProfile.onboardingArchetype);
            setOnboardingArchetype(userProfile.onboardingArchetype ?? null);
            if (userProfile.pantryLastUpdated) {
              setPantryLastUpdated(userProfile.pantryLastUpdated);
            }
          } else {
            // No profile document means user has not been onboarded
            await setHasOnboarded(false);
            setOnboardingArchetype(null);
            setPantryLastUpdated(null);
          }
        } else {
          // No user signed in; clear local state
          setCurrentUser(null);
          resetUser();
          resetPantry();
        }
      } catch (err) {
        showToast('Error during authentication state change');
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user: currentUser, loading };
}
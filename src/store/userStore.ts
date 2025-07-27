import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Interface describing the shape of the user state held in the Zustand store.
 */
export interface UserState {
  /** Unique identifier for the user. */
  userId: string | null;
  /** Flag indicating whether the onboarding flow has been completed. */
  hasOnboarded: boolean;
  /** The archetype chosen during onboarding, if any. */
  onboardingArchetype: string | null;
  /** Unix timestamp (milliseconds) of when the pantry was last updated. */
  pantryLastUpdated: number | null;
  /** Count of consecutive app launches without performing a search. */
  consecutiveInactiveOpens: number;
  actions: {
    /** Persist the user ID into state. */
    setUserId: (id: string) => void;
    /** Persist the onboarding flag both in memory and AsyncStorage. */
    setHasOnboarded: (value: boolean) => Promise<void>;
    /** Store the selected archetype in memory. */
    setOnboardingArchetype: (value: string | null) => void;
    /** Update the timestamp of the last pantry update. */
    setPantryLastUpdated: (timestamp: number) => void;
    /** Increment the counter tracking inactive opens. */
    incrementInactiveOpens: () => void;
    /** Reset the inactive opens counter back to zero. */
    resetInactiveOpens: () => void;
    /** Load persisted onboarding flag from storage on app start. */
    loadFromStorage: () => Promise<void>;
  };
}

/**
 * Zustand store for managing user–level state. This store holds the minimal
 * information required across screens, such as whether the user has
 * completed onboarding and when the pantry was last updated.
 */
export const useUserStore = create<UserState>((set) => ({
  userId: null,
  hasOnboarded: false,
  onboardingArchetype: null,
  pantryLastUpdated: null,
  consecutiveInactiveOpens: 0,
  actions: {
    setUserId: (id: string) => set({ userId: id }),
    setHasOnboarded: async (value: boolean) => {
      await AsyncStorage.setItem('hasOnboarded', value ? 'true' : 'false');
      set({ hasOnboarded: value });
    },
    setOnboardingArchetype: (value: string | null) => set({ onboardingArchetype: value }),
    setPantryLastUpdated: (timestamp: number) => set({ pantryLastUpdated: timestamp }),
    incrementInactiveOpens: () => set((state: UserState) => ({ consecutiveInactiveOpens: state.consecutiveInactiveOpens + 1 })),
    resetInactiveOpens: () => set({ consecutiveInactiveOpens: 0 }),
    loadFromStorage: async () => {
      const flag = await AsyncStorage.getItem('hasOnboarded');
      set({ hasOnboarded: flag === 'true' });
    },
  },
}));
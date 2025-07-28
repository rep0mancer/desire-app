import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Interface describing the shape of the user state held in the Zustand store.
 */
export type OnboardingStep =
  | 'unstarted'
  | 'archetype_selected'
  | 'pantry_complete'
  | 'finished';

export interface UserState {
  /** Unique identifier for the user. */
  userId: string | null;
  /** Tracks progress through the onboarding flow. */
  onboardingStep: OnboardingStep;
  /** The archetype chosen during onboarding, if any. */
  onboardingArchetype: string | null;
  /** Unix timestamp (milliseconds) of when the pantry was last updated. */
  pantryLastUpdated: number | null;
  /** Count of consecutive app launches without performing a search. */
  consecutiveInactiveOpens: number;
  actions: {
    /** Persist the user ID into state. */
    setUserId: (id: string) => void;
    /** Persist the onboarding step both in memory and AsyncStorage. */
    setOnboardingStep: (step: OnboardingStep) => Promise<void>;
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

    /**
     * Reset all user state back to its initial values. This is useful when
     * signing out to ensure no stale data remains in memory.
     */
    resetUser: () => void;
  };
}

/**
 * Zustand store for managing user–level state. This store holds the minimal
 * information required across screens, such as whether the user has
 * completed onboarding and when the pantry was last updated.
 */
export const useUserStore = create<UserState>((set) => ({
  userId: null,
  onboardingStep: 'unstarted',
  onboardingArchetype: null,
  pantryLastUpdated: null,
  consecutiveInactiveOpens: 0,
  actions: {
    setUserId: (id: string) => set({ userId: id }),
    setOnboardingStep: async (step: OnboardingStep) => {
      await AsyncStorage.setItem('onboardingStep', step);
      set({ onboardingStep: step });
    },
    setOnboardingArchetype: (value: string | null) => set({ onboardingArchetype: value }),
    setPantryLastUpdated: (timestamp: number) => set({ pantryLastUpdated: timestamp }),
    incrementInactiveOpens: () => set((state: UserState) => ({ consecutiveInactiveOpens: state.consecutiveInactiveOpens + 1 })),
    resetInactiveOpens: () => set({ consecutiveInactiveOpens: 0 }),
    loadFromStorage: async () => {
      const step = await AsyncStorage.getItem('onboardingStep');
      set({ onboardingStep: (step as OnboardingStep) || 'unstarted' });
    },
    resetUser: () =>
      set({
        userId: null,
        onboardingStep: 'unstarted',
        onboardingArchetype: null,
        pantryLastUpdated: null,
        consecutiveInactiveOpens: 0,
      }),
  },
}));
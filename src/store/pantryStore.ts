import create from 'zustand';

/**
 * Interface describing the shape of the pantry state held in the Zustand store.
 */
export interface PantryState {
  /** The list of ingredient names currently stored in the user's pantry. */
  items: Record<string, boolean>;
  actions: {
    /** Replace the entire pantry with a new set of items. */
    setPantry: (items: Record<string, boolean>) => void;
    /** Add a single item to the pantry. */
    addItem: (item: string) => void;
    /** Remove a single item from the pantry. */
    removeItem: (item: string) => void;
    /**
     * Reset the pantry back to an empty list. This should be used when
     * signing out or switching accounts to ensure no stale data remains.
     */
    resetPantry: () => void;
  };
}

/**
 * Zustand store for managing the user's pantry. This store is kept in memory
 * and synchronised with Firestore via the services functions. Screens can
 * subscribe to `items` to reactively update when the pantry changes.
 */
export const usePantryStore = create<PantryState>((set) => ({
  items: {},
  actions: {
    setPantry: (items: Record<string, boolean>) => set({ items }),
    addItem: (item: string) =>
      set((state: PantryState) => ({
        items: { ...state.items, [item.toLowerCase()]: true },
      })),
    removeItem: (item: string) =>
      set((state: PantryState) => {
        const updated = { ...state.items };
        delete updated[item.toLowerCase()];
        return { items: updated };
      }),
    resetPantry: () => set({ items: {} }),
  },
}));
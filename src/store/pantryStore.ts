import create from 'zustand';

/**
 * Interface describing the shape of the pantry state held in the Zustand store.
 */
export interface PantryState {
  /** The list of ingredient names currently stored in the user's pantry. */
  items: string[];
  actions: {
    /** Replace the entire pantry with a new array of items. */
    setPantry: (items: string[]) => void;
    /** Add a single item to the pantry. */
    addItem: (item: string) => void;
    /** Remove a single item from the pantry. */
    removeItem: (item: string) => void;
  };
}

/**
 * Zustand store for managing the user's pantry. This store is kept in memory
 * and synchronised with Firestore via the services functions. Screens can
 * subscribe to `items` to reactively update when the pantry changes.
 */
export const usePantryStore = create<PantryState>((set) => ({
  items: [],
  actions: {
    setPantry: (items: string[]) => set({ items }),
    addItem: (item: string) => set((state: PantryState) => ({ items: [...state.items, item.toLowerCase()] })),
    removeItem: (item: string) => set((state: PantryState) => ({ items: state.items.filter((i) => i !== item.toLowerCase()) })),
  },
}));
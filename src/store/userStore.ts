import create from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: any | null;
  loading: boolean;
  error: string | null;
  setUser(user: any): void;
  setLoading(loading: boolean): void;
  setError(error: string | null): void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    { name: 'user-storage' },
  ),
);

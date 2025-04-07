import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  favorites: string[];
  theme: 'light' | 'dark';
  addFavorite: (recipeId: string) => void;
  removeFavorite: (recipeId: string) => void;
  toggleFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  toggleTheme: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      favorites: [],
      theme: 'light',
      addFavorite: (recipeId) =>
        set((state) => ({ favorites: [...state.favorites, recipeId] })),
      removeFavorite: (recipeId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== recipeId),
        })),
      toggleFavorite: (recipeId) => {
        const isFavorite = get().favorites.includes(recipeId);
        if (isFavorite) {
          get().removeFavorite(recipeId);
        } else {
          get().addFavorite(recipeId);
        }
      },
      isFavorite: (recipeId) => get().favorites.includes(recipeId),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light'
        })),
    }),
    {
      name: 'recipe-storage',
    }
  )
);
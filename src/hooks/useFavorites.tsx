'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useToast } from '@/components/Toast';

interface FavoritesContextValue {
  favorites: string[];
  toggleFavorite: (id: string, e?: React.MouseEvent) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);
  const loaded = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem('property_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch {}
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (loaded.current) {
      localStorage.setItem('property_favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const toggleFavorite = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setFavorites(prev => {
      if (prev.includes(id)) {
        toast('error', 'Removed from favorites');
        return prev.filter(fId => fId !== id);
      }
      toast('success', 'Added to favorites');
      return [...prev, id];
    });
  }, [toast]);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return ctx;
}

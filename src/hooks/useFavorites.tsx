'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useToast } from '@/components/Toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import { gtagEvent } from '@/lib/analytics';

interface FavoritesContextValue {
  favorites: string[];
  toggleFavorite: (id: string, e?: React.MouseEvent) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const pendingTriggerRef = useRef<React.MouseEvent | undefined>(undefined);
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

    if (favorites.includes(id)) {
      pendingTriggerRef.current = e;
      setPendingRemoveId(id);
    } else {
      setFavorites(prev => [...prev, id]);
      gtagEvent('favorite_toggle', { action: 'add', property_id: id });
      toast('success', 'Added to favorites');
    }
  }, [toast, favorites]);

  const confirmRemove = useCallback(() => {
    if (!pendingRemoveId) return;
    setFavorites(prev => prev.filter(fId => fId !== pendingRemoveId));
    gtagEvent('favorite_toggle', { action: 'remove', property_id: pendingRemoveId });
    toast('error', 'Removed from favorites');
    setPendingRemoveId(null);
  }, [pendingRemoveId, toast]);

  const cancelRemove = useCallback(() => {
    setPendingRemoveId(null);
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
      <ConfirmDialog
        open={!!pendingRemoveId}
        title="Remove from Favorites?"
        message="This property will be removed from your saved favorites."
        confirmLabel="Remove"
        cancelLabel="Keep"
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
      />
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

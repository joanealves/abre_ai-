import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface FavoriteItem {
  id: number;
  name: string;
  price: number;
  category: "rolee" | "cestas" | "bebidas" | "chocolates" | "petiscos";
  description: string;
}

const FAVORITES_STORAGE_KEY = "abreai_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (item: FavoriteItem) => {
    setFavorites((prev) => {
      const exists = prev.find((fav) => fav.id === item.id);
      if (exists) {
        toast.info(`${item.name} já está nos favoritos!`);
        return prev;
      }
      toast.success(`${item.name} adicionado aos favoritos! ❤️`);
      return [...prev, item];
    });
  };

  const removeFavorite = (id: number) => {
    setFavorites((prev) => {
      const item = prev.find((fav) => fav.id === id);
      if (item) {
        toast.info(`${item.name} removido dos favoritos`);
      }
      return prev.filter((fav) => fav.id !== id);
    });
  };

  const isFavorite = (id: number) => {
    return favorites.some((fav) => fav.id === id);
  };

  const toggleFavorite = (item: FavoriteItem) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    favoritesCount: favorites.length,
  };
};
import { Product } from "./product";

export interface FavoritesState {
  items: Product[];
  totalItems: number;
}

export interface FavoritesContextType {
  favorites: FavoritesState;
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  clearFavorites: () => void;
  isInFavorites: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
}

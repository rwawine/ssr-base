import type { Product } from "./product";
import type { FabricCollection, FabricVariant } from "./fabric";

export interface FavoritesItem {
  product: Product;
}

export interface FabricFavoritesItem {
  fabric: {
    collection: FabricCollection;
    variant: FabricVariant;
    categorySlug: string;
    collectionSlug: string;
  };
}

export interface FavoritesState {
  items: FavoritesItem[];
  fabricItems: FabricFavoritesItem[];
}

export interface FavoritesContextType {
  items: FavoritesItem[];
  fabricItems: FabricFavoritesItem[];
  addToFavorites: (product: Product) => void;
  addFabricToFavorites: (fabric: {
    collection: FabricCollection;
    variant: FabricVariant;
    categorySlug: string;
    collectionSlug: string;
  }) => void;
  removeFromFavorites: (productId: string) => void;
  removeFabricFromFavorites: (fabricId: string) => void;
  clearFavorites: () => void;
  isInFavorites: (productId: string) => boolean;
  isFabricInFavorites: (fabricId: string) => boolean;
  toggleFavorite: (product: Product) => void;
  isHydrated: boolean;
}

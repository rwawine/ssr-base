"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  FavoritesContextType,
  FavoritesState,
  FavoritesItem,
  FabricFavoritesItem,
} from "@/types/favorites";
import { Product } from "@/types/product";
import { FabricCollection, FabricVariant } from "@/types/fabric";
import { useLocalStorage } from "./useLocalStorage";

// Константы
const FAVORITES_STORAGE_KEY = "ssr-favorites";

// Типы действий
type FavoritesAction =
  | { type: "ADD_ITEM"; payload: Product }
  | {
      type: "ADD_FABRIC_ITEM";
      payload: {
        collection: FabricCollection;
        variant: FabricVariant;
        categorySlug: string;
        collectionSlug: string;
      };
    }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "REMOVE_FABRIC_ITEM"; payload: string }
  | { type: "CLEAR_FAVORITES" }
  | { type: "LOAD_FAVORITES"; payload: FavoritesState };

// Начальное состояние
const initialState: FavoritesState = {
  items: [],
  fabricItems: [],
};

// Функция для получения уникального ключа ткани
const getFabricKey = (
  categorySlug: string,
  collectionSlug: string,
  variantId: number,
): string => {
  return `fabric-${categorySlug}-${collectionSlug}-${variantId}`;
};

// Reducer для управления состоянием избранного
function favoritesReducer(
  state: FavoritesState,
  action: FavoritesAction,
): FavoritesState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.id,
      );
      if (existingItem) {
        return state; // Товар уже в избранном
      }
      return {
        ...state,
        items: [...state.items, { product: action.payload }],
      };
    }

    case "ADD_FABRIC_ITEM": {
      const fabricKey = getFabricKey(
        action.payload.categorySlug,
        action.payload.collectionSlug,
        action.payload.variant.id,
      );
      const existingFabric = state.fabricItems?.find(
        (item) =>
          getFabricKey(
            item.fabric.categorySlug,
            item.fabric.collectionSlug,
            item.fabric.variant.id,
          ) === fabricKey,
      );
      if (existingFabric) {
        return state; // Ткань уже в избранном
      }
      return {
        ...state,
        fabricItems: [...(state.fabricItems || []), { fabric: action.payload }],
      };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.payload),
      };
    }

    case "REMOVE_FABRIC_ITEM": {
      return {
        ...state,
        fabricItems: (state.fabricItems || []).filter(
          (item) =>
            getFabricKey(
              item.fabric.categorySlug,
              item.fabric.collectionSlug,
              item.fabric.variant.id,
            ) !== action.payload,
        ),
      };
    }

    case "CLEAR_FAVORITES":
      return initialState;

    case "LOAD_FAVORITES":
      return action.payload;

    default:
      return state;
  }
}

// Создание контекста
const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

// Провайдер контекста
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Загрузка избранного из localStorage
  const [savedFavorites] = useLocalStorage(FAVORITES_STORAGE_KEY, initialState);

  useEffect(() => {
    if (savedFavorites && Object.keys(savedFavorites).length > 0) {
      // Фильтруем невалидные записи тканей при загрузке
      const validFavorites = {
        ...savedFavorites,
        fabricItems: (savedFavorites.fabricItems || []).filter(
          (item) =>
            item.fabric.categorySlug &&
            item.fabric.collectionSlug &&
            item.fabric.categorySlug !== "undefined" &&
            item.fabric.collectionSlug !== "undefined",
        ),
      };
      dispatch({ type: "LOAD_FAVORITES", payload: validFavorites });
    }
    setIsHydrated(true);
  }, [savedFavorites]);

  // Сохранение избранного в localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isHydrated]);

  // Функции для работы с избранным
  const addToFavorites = useCallback((product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  }, []);

  const addFabricToFavorites = useCallback(
    (fabric: {
      collection: FabricCollection;
      variant: FabricVariant;
      categorySlug: string;
      collectionSlug: string;
    }) => {
      dispatch({ type: "ADD_FABRIC_ITEM", payload: fabric });
    },
    [],
  );

  const removeFromFavorites = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  }, []);

  const removeFabricFromFavorites = useCallback((fabricId: string) => {
    dispatch({ type: "REMOVE_FABRIC_ITEM", payload: fabricId });
  }, []);

  const clearFavorites = useCallback(() => {
    dispatch({ type: "CLEAR_FAVORITES" });
  }, []);

  const isInFavorites = useCallback(
    (productId: string): boolean => {
      return state.items.some((item) => item.product.id === productId);
    },
    [state.items],
  );

  const isFabricInFavorites = useCallback(
    (fabricId: string): boolean => {
      return (
        state.fabricItems?.some(
          (item) =>
            getFabricKey(
              item.fabric.categorySlug,
              item.fabric.collectionSlug,
              item.fabric.variant.id,
            ) === fabricId,
        ) || false
      );
    },
    [state.fabricItems],
  );

  const toggleFavorite = useCallback(
    (product: Product) => {
      const isInFav = state.items.some(
        (item) => item.product.id === product.id,
      );
      if (isInFav) {
        dispatch({ type: "REMOVE_ITEM", payload: product.id });
      } else {
        dispatch({ type: "ADD_ITEM", payload: product });
      }
    },
    [state.items],
  );

  const contextValue: FavoritesContextType = {
    items: state.items,
    fabricItems: state.fabricItems,
    addToFavorites,
    addFabricToFavorites,
    removeFromFavorites,
    removeFabricFromFavorites,
    clearFavorites,
    isInFavorites,
    isFabricInFavorites,
    toggleFavorite,
    isHydrated,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Хук для использования контекста избранного
export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error(
      "useFavorites должен использоваться внутри FavoritesProvider",
    );
  }
  return context;
}

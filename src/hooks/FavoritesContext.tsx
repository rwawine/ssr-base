'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { FavoritesContextType, FavoritesState } from '@/types/favorites';
import { Product } from '@/types/product';

// Константы
const FAVORITES_STORAGE_KEY = 'ssr-favorites';

// Типы действий
type FavoritesAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_FAVORITES' }
  | { type: 'LOAD_FAVORITES'; payload: FavoritesState };

// Начальное состояние
const initialState: FavoritesState = {
  items: [],
  totalItems: 0,
};

// Reducer для управления состоянием избранного
function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { payload: product } = action;
      
      // Проверяем, не добавлен ли уже товар
      if (state.items.some(item => item.id === product.id)) {
        return state;
      }

      const newItems = [...state.items, product];
      return {
        items: newItems,
        totalItems: newItems.length,
      };
    }

    case 'REMOVE_ITEM': {
      const { payload: productId } = action;
      const newItems = state.items.filter(item => item.id !== productId);
      
      return {
        items: newItems,
        totalItems: newItems.length,
      };
    }

    case 'CLEAR_FAVORITES':
      return initialState;

    case 'LOAD_FAVORITES':
      return action.payload;

    default:
      return state;
  }
}

// Создание контекста
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Провайдер контекста
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, dispatch] = useReducer(favoritesReducer, initialState);

  // Загрузка избранного из localStorage при инициализации
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        dispatch({ type: 'LOAD_FAVORITES', payload: parsedFavorites });
      }
    } catch (error) {
      console.error('Ошибка при загрузке избранного из localStorage:', error);
      // В случае ошибки очищаем localStorage
      localStorage.removeItem(FAVORITES_STORAGE_KEY);
    }
  }, []);

  // Сохранение избранного в localStorage при изменении
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Ошибка при сохранении избранного в localStorage:', error);
    }
  }, [favorites]);

  // Функции для работы с избранным
  const addToFavorites = useCallback((product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  }, []);

  const removeFromFavorites = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  }, []);

  const clearFavorites = useCallback(() => {
    dispatch({ type: 'CLEAR_FAVORITES' });
  }, []);

  const isInFavorites = useCallback((productId: string): boolean => {
    return favorites.items.some(item => item.id === productId);
  }, [favorites.items]);

  const toggleFavorite = useCallback((product: Product) => {
    if (isInFavorites(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  }, [isInFavorites, removeFromFavorites, addToFavorites]);

  // Мемоизированное значение контекста
  const contextValue = useMemo<FavoritesContextType>(() => ({
    favorites,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    isInFavorites,
    toggleFavorite,
  }), [favorites, addToFavorites, removeFromFavorites, clearFavorites, isInFavorites, toggleFavorite]);

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
    throw new Error('useFavorites должен использоваться внутри FavoritesProvider');
  }
  return context;
}

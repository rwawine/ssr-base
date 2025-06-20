'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { CartContextType, CartState, CartItem } from '@/types/cart';
import { Product, Dimension } from '@/types/product';

// Константы
const CART_STORAGE_KEY = 'ssr-cart';
const MAX_QUANTITY = 99;
const MIN_QUANTITY = 1;

// Типы действий
type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; dimension?: Dimension } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; dimensionId?: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number; dimensionId?: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

// Начальное состояние
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Функция для получения уникального ключа товара
const getItemKey = (productId: string, dimensionId?: string): string => {
  return dimensionId ? `${productId}-${dimensionId}` : productId;
};

// Функция для вычисления цены товара
const calculateItemPrice = (product: Product, dimension?: Dimension): number => {
  if (dimension?.price) return dimension.price;
  if (product.price?.current) return product.price.current;
  return 0;
};

// Reducer для управления состоянием корзины
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, dimension } = action.payload;
      const itemKey = getItemKey(product.id, dimension?.id);
      
      const existingItemIndex = state.items.findIndex(item => 
        getItemKey(item.product.id, item.selectedDimension?.id) === itemKey
      );

      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Обновляем существующий товар
        newItems = [...state.items];
        const newQuantity = Math.min(
          newItems[existingItemIndex].quantity + quantity, 
          MAX_QUANTITY
        );
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newQuantity,
        };
      } else {
        // Добавляем новый товар
        const newItem: CartItem = {
          product,
          quantity: Math.min(quantity, MAX_QUANTITY),
          selectedDimension: dimension,
        };
        newItems = [...state.items, newItem];
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => 
        sum + (calculateItemPrice(item.product, item.selectedDimension) * item.quantity), 0
      );

      return { items: newItems, totalItems, totalPrice };
    }

    case 'REMOVE_ITEM': {
      const { productId, dimensionId } = action.payload;
      const itemKey = getItemKey(productId, dimensionId);
      
      const newItems = state.items.filter(item => 
        getItemKey(item.product.id, item.selectedDimension?.id) !== itemKey
      );

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => 
        sum + (calculateItemPrice(item.product, item.selectedDimension) * item.quantity), 0
      );

      return { items: newItems, totalItems, totalPrice };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity, dimensionId } = action.payload;
      const itemKey = getItemKey(productId, dimensionId);
      
      if (quantity < MIN_QUANTITY) {
        // Если количество меньше минимального, удаляем товар
        return cartReducer(state, { 
          type: 'REMOVE_ITEM', 
          payload: { productId, dimensionId } 
        });
      }

      const newItems = state.items.map(item => {
        if (getItemKey(item.product.id, item.selectedDimension?.id) === itemKey) {
          return { ...item, quantity: Math.min(quantity, MAX_QUANTITY) };
        }
        return item;
      });

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => 
        sum + (calculateItemPrice(item.product, item.selectedDimension) * item.quantity), 0
      );

      return { items: newItems, totalItems, totalPrice };
    }

    case 'CLEAR_CART':
      return initialState;

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
}

// Создание контекста
const CartContext = createContext<CartContextType | undefined>(undefined);

// Провайдер контекста
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Загрузка корзины из localStorage при инициализации
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      }
    } catch (error) {
      console.error('Ошибка при загрузке корзины из localStorage:', error);
      // В случае ошибки очищаем localStorage
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Ошибка при сохранении корзины в localStorage:', error);
    }
  }, [cart]);

  // Функции для работы с корзиной
  const addToCart = useCallback((product: Product, quantity: number = 1, dimension?: Dimension) => {
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: { product, quantity, dimension } 
    });
  }, []);

  const removeFromCart = useCallback((productId: string, dimensionId?: string) => {
    dispatch({ 
      type: 'REMOVE_ITEM', 
      payload: { productId, dimensionId } 
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, dimensionId?: string) => {
    dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { productId, quantity, dimensionId } 
    });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const isInCart = useCallback((productId: string, dimensionId?: string): boolean => {
    const itemKey = getItemKey(productId, dimensionId);
    return cart.items.some(item => 
      getItemKey(item.product.id, item.selectedDimension?.id) === itemKey
    );
  }, [cart.items]);

  const getItemQuantity = useCallback((productId: string, dimensionId?: string): number => {
    const itemKey = getItemKey(productId, dimensionId);
    const item = cart.items.find(item => 
      getItemKey(item.product.id, item.selectedDimension?.id) === itemKey
    );
    return item?.quantity || 0;
  }, [cart.items]);

  // Мемоизированное значение контекста
  const contextValue = useMemo<CartContextType>(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, isInCart, getItemQuantity]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// Хук для использования контекста корзины
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart должен использоваться внутри CartProvider');
  }
  return context;
}

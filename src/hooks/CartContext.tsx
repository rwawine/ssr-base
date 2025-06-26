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
import { CartContextType, CartState, CartItem } from "@/types/cart";
import { Product, Dimension, AdditionalOption } from "@/types/product";
import { useLocalStorage } from "./useLocalStorage";
import { formatPrice } from "@/lib/utils";

// Константы
const CART_STORAGE_KEY = "ssr-cart";
const MAX_QUANTITY = 99;
const MIN_QUANTITY = 1;

// Типы действий
type CartAction =
  | {
      type: "ADD_ITEM";
      payload: {
        product: Product;
        quantity: number;
        dimension?: Dimension;
        additionalOptions?: AdditionalOption[];
      };
    }
  | {
      type: "REMOVE_ITEM";
      payload: {
        productId: string;
        dimensionId?: string;
        additionalOptions?: AdditionalOption[];
      };
    }
  | {
      type: "UPDATE_QUANTITY";
      payload: {
        productId: string;
        quantity: number;
        dimensionId?: string;
        additionalOptions?: AdditionalOption[];
      };
    }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState };

// Начальное состояние
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Функция для получения уникального ключа товара, учитывая опции
const getItemKey = (
  productId: string,
  dimensionId?: string,
  additionalOptions?: AdditionalOption[],
): string => {
  const optionsKey =
    additionalOptions && additionalOptions.length > 0
      ? additionalOptions
          .map((opt) => opt.name)
          .sort()
          .join("_")
      : "no-options";
  return dimensionId
    ? `${productId}-${dimensionId}-${optionsKey}`
    : `${productId}-${optionsKey}`;
};

// Функция для вычисления цены товара с учетом дополнительных опций
const calculateItemPrice = (
  product: Product,
  dimension?: Dimension,
  additionalOptions?: AdditionalOption[],
): number => {
  let basePrice = 0;
  if (dimension?.price) {
    basePrice = dimension.price;
  } else if (product.price?.current) {
    basePrice = product.price.current;
  }

  // Добавляем стоимость дополнительных опций
  const additionalOptionsPrice =
    additionalOptions?.reduce((sum, option) => sum + option.price, 0) || 0;

  return basePrice + additionalOptionsPrice;
};

// Reducer для управления состоянием корзины
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity, dimension, additionalOptions } =
        action.payload;
      const itemKey = getItemKey(product.id, dimension?.id, additionalOptions);

      const existingItemIndex = state.items.findIndex(
        (item) =>
          getItemKey(
            item.product.id,
            item.selectedDimension?.id,
            item.selectedAdditionalOptions,
          ) === itemKey,
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Обновляем существующий товар
        newItems = [...state.items];
        const newQuantity = Math.min(
          newItems[existingItemIndex].quantity + quantity,
          MAX_QUANTITY,
        );
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newQuantity,
          selectedAdditionalOptions: additionalOptions,
        };
      } else {
        // Добавляем новый товар
        const newItem: CartItem = {
          product,
          quantity: Math.min(quantity, MAX_QUANTITY),
          selectedDimension: dimension,
          selectedAdditionalOptions: additionalOptions,
        };
        newItems = [...state.items, newItem];
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce(
        (sum, item) =>
          sum +
          calculateItemPrice(
            item.product,
            item.selectedDimension,
            item.selectedAdditionalOptions,
          ) *
            item.quantity,
        0,
      );

      return { items: newItems, totalItems, totalPrice };
    }

    case "REMOVE_ITEM": {
      const { productId, dimensionId, additionalOptions } = action.payload;
      const itemKey = getItemKey(productId, dimensionId, additionalOptions);

      const newItems = state.items.filter(
        (item) =>
          getItemKey(
            item.product.id,
            item.selectedDimension?.id,
            item.selectedAdditionalOptions,
          ) !== itemKey,
      );

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce(
        (sum, item) =>
          sum +
          calculateItemPrice(
            item.product,
            item.selectedDimension,
            item.selectedAdditionalOptions,
          ) *
            item.quantity,
        0,
      );

      return { items: newItems, totalItems, totalPrice };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity, dimensionId, additionalOptions } =
        action.payload;
      const itemKey = getItemKey(productId, dimensionId, additionalOptions);

      if (quantity < MIN_QUANTITY) {
        // Если количество меньше минимального, удаляем товар
        return cartReducer(state, {
          type: "REMOVE_ITEM",
          payload: { productId, dimensionId, additionalOptions },
        });
      }

      const newItems = state.items.map((item) => {
        if (
          getItemKey(
            item.product.id,
            item.selectedDimension?.id,
            item.selectedAdditionalOptions,
          ) === itemKey
        ) {
          return { ...item, quantity: Math.min(quantity, MAX_QUANTITY) };
        }
        return item;
      });

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce(
        (sum, item) =>
          sum +
          calculateItemPrice(
            item.product,
            item.selectedDimension,
            item.selectedAdditionalOptions,
          ) *
            item.quantity,
        0,
      );

      return { items: newItems, totalItems, totalPrice };
    }

    case "CLEAR_CART":
      return initialState;

    case "LOAD_CART":
      return action.payload;

    default:
      return state;
  }
}

// Создание контекста
const CartContext = createContext<CartContextType | undefined>(undefined);

// Провайдер контекста
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useLocalStorage<CartState>(
    CART_STORAGE_KEY,
    initialState,
  );
  const [promoCode, setPromoCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);

  // Функции для работы с корзиной
  const addToCart = useCallback(
    (
      product: Product,
      quantity: number = 1,
      dimension?: Dimension,
      additionalOptions?: AdditionalOption[],
    ) => {
      setCart((prevCart) => {
        const action: CartAction = {
          type: "ADD_ITEM",
          payload: { product, quantity, dimension, additionalOptions },
        };
        return cartReducer(prevCart, action);
      });
    },
    [setCart],
  );

  const removeFromCart = useCallback(
    (
      productId: string,
      dimensionId?: string,
      additionalOptions?: AdditionalOption[],
    ) => {
      setCart((prevCart) => {
        const action: CartAction = {
          type: "REMOVE_ITEM",
          payload: { productId, dimensionId, additionalOptions },
        };
        return cartReducer(prevCart, action);
      });
    },
    [setCart],
  );

  const updateQuantity = useCallback(
    (
      productId: string,
      quantity: number,
      dimensionId?: string,
      additionalOptions?: AdditionalOption[],
    ) => {
      setCart((prevCart) => {
        const action: CartAction = {
          type: "UPDATE_QUANTITY",
          payload: { productId, quantity, dimensionId, additionalOptions },
        };
        return cartReducer(prevCart, action);
      });
    },
    [setCart],
  );

  const clearCart = useCallback(() => {
    setCart(initialState);
  }, [setCart]);

  // Мемоизированные значения
  const cartValue = useMemo(
    () => ({
      ...cart,
      promoCode,
      discount,
      formattedTotalPrice: formatPrice(cart.totalPrice || 0),
      formattedDiscountedPrice: formatPrice(
        Math.max(0, (cart.totalPrice || 0) - discount),
      ),
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart: (
        productId: string,
        dimensionId?: string,
        additionalOptions?: AdditionalOption[],
      ): boolean => {
        const itemKey = getItemKey(productId, dimensionId, additionalOptions);
        return cart.items.some(
          (item) =>
            getItemKey(
              item.product.id,
              item.selectedDimension?.id,
              item.selectedAdditionalOptions,
            ) === itemKey,
        );
      },
      applyPromo: (code: string) => {
        setPromoCode(code);
        // Здесь будет логика применения промокода
        setDiscount(100); // Пример скидки
      },
      resetPromo: () => {
        setPromoCode("");
        setDiscount(0);
      },
      isCartEmpty: cart.items.length === 0,
      getItemQuantity: (
        productId: string,
        dimensionId?: string,
        additionalOptions?: AdditionalOption[],
      ) => {
        const itemKey = getItemKey(productId, dimensionId, additionalOptions);
        const item = cart.items.find(
          (item) =>
            getItemKey(
              item.product.id,
              item.selectedDimension?.id,
              item.selectedAdditionalOptions,
            ) === itemKey,
        );
        return item?.quantity || 0;
      },
    }),
    [
      cart,
      promoCode,
      discount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    ],
  );

  return (
    <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>
  );
}

// Хук для использования контекста корзины
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

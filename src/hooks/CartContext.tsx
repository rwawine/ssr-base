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
  CartContextType,
  CartState,
  CartItem,
  FabricCartItem,
} from "@/types/cart";
import { Product, Dimension, AdditionalOption } from "@/types/product";
import { FabricCollection, FabricVariant } from "@/types/fabric";
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
      type: "ADD_FABRIC_ITEM";
      payload: {
        fabric: {
          collection: FabricCollection;
          variant: FabricVariant;
          categorySlug: string;
          collectionSlug: string;
        };
        quantity: number;
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
      type: "REMOVE_FABRIC_ITEM";
      payload: {
        fabricId: string;
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
  | {
      type: "UPDATE_FABRIC_QUANTITY";
      payload: {
        fabricId: string;
        quantity: number;
      };
    }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState };

// Начальное состояние
const initialState: CartState = {
  items: [],
  fabricItems: [],
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

// Функция для получения уникального ключа ткани
const getFabricKey = (
  categorySlug: string,
  collectionSlug: string,
  variantId: number,
): string => {
  return `fabric-${categorySlug}-${collectionSlug}-${variantId}`;
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
    additionalOptions?.reduce((sum, option) => sum + (option.price || 0), 0) ||
    0;

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
          selectedDimension: dimension
            ? {
                id: dimension.id,
                width: dimension.width,
                length: dimension.length,
                height: dimension.height || undefined,
                price: dimension.price,
              }
            : undefined,
          selectedAdditionalOptions: additionalOptions,
        };
        newItems = [...state.items, newItem];
      }

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

      return { ...state, items: newItems, totalPrice };
    }

    case "ADD_FABRIC_ITEM": {
      const { fabric, quantity } = action.payload;
      const fabricKey = getFabricKey(
        fabric.categorySlug,
        fabric.collectionSlug,
        fabric.variant.id,
      );

      const existingFabricIndex = (state.fabricItems || []).findIndex(
        (item) =>
          getFabricKey(
            item.fabric.categorySlug,
            item.fabric.collectionSlug,
            item.fabric.variant.id,
          ) === fabricKey,
      );

      let newFabricItems: FabricCartItem[];

      if (existingFabricIndex >= 0) {
        // Обновляем существующую ткань
        newFabricItems = [...(state.fabricItems || [])];
        const newQuantity = Math.min(
          newFabricItems[existingFabricIndex].quantity + quantity,
          MAX_QUANTITY,
        );
        newFabricItems[existingFabricIndex] = {
          ...newFabricItems[existingFabricIndex],
          quantity: newQuantity,
        };
      } else {
        // Добавляем новую ткань
        const newFabricItem: FabricCartItem = {
          fabric,
          quantity: Math.min(quantity, MAX_QUANTITY),
          price: 0, // Ткани бесплатные
        };
        newFabricItems = [...(state.fabricItems || []), newFabricItem];
      }

      // Цена остается той же, так как ткани бесплатные
      return { ...state, fabricItems: newFabricItems };
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

      return { ...state, items: newItems, totalPrice };
    }

    case "REMOVE_FABRIC_ITEM": {
      const { fabricId } = action.payload;
      const newFabricItems = (state.fabricItems || []).filter(
        (item) =>
          getFabricKey(
            item.fabric.categorySlug,
            item.fabric.collectionSlug,
            item.fabric.variant.id,
          ) !== fabricId,
      );
      return { ...state, fabricItems: newFabricItems };
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

      return { ...state, items: newItems, totalPrice };
    }

    case "UPDATE_FABRIC_QUANTITY": {
      const { fabricId, quantity } = action.payload;

      if (quantity < MIN_QUANTITY) {
        // Если количество меньше минимального, удаляем ткань
        return cartReducer(state, {
          type: "REMOVE_FABRIC_ITEM",
          payload: { fabricId },
        });
      }

      const newFabricItems = (state.fabricItems || []).map((item) => {
        if (
          getFabricKey(
            item.fabric.categorySlug,
            item.fabric.collectionSlug,
            item.fabric.variant.id,
          ) === fabricId
        ) {
          return { ...item, quantity: Math.min(quantity, MAX_QUANTITY) };
        }
        return item;
      });

      return { ...state, fabricItems: newFabricItems };
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
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Загрузка корзины из localStorage
  const [savedCart] = useLocalStorage(CART_STORAGE_KEY, initialState);

  useEffect(() => {
    if (savedCart && Object.keys(savedCart).length > 0) {
      dispatch({ type: "LOAD_CART", payload: savedCart });
    }
    setIsHydrated(true);
  }, [savedCart]);

  // Сохранение корзины в localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isHydrated]);

  // Функции для работы с корзиной
  const addToCart = useCallback(
    (
      product: Product,
      quantity: number = 1,
      dimensionId?: string,
      additionalOptions?: AdditionalOption[],
    ) => {
      const dimension = dimensionId
        ? product.dimensions?.find((d) => d.id === dimensionId)
        : undefined;

      dispatch({
        type: "ADD_ITEM",
        payload: {
          product,
          quantity,
          dimension,
          additionalOptions,
        },
      });
    },
    [],
  );

  const addFabricToCart = useCallback(
    (
      fabric: {
        collection: FabricCollection;
        variant: FabricVariant;
        categorySlug: string;
        collectionSlug: string;
      },
      quantity: number = 1,
    ) => {
      dispatch({
        type: "ADD_FABRIC_ITEM",
        payload: {
          fabric,
          quantity,
        },
      });
    },
    [],
  );

  const removeFromCart = useCallback(
    (
      productId: string,
      dimensionId?: string,
      additionalOptions?: AdditionalOption[],
    ) => {
      dispatch({
        type: "REMOVE_ITEM",
        payload: {
          productId,
          dimensionId,
          additionalOptions,
        },
      });
    },
    [],
  );

  const removeFabricFromCart = useCallback((fabricId: string) => {
    dispatch({
      type: "REMOVE_FABRIC_ITEM",
      payload: { fabricId },
    });
  }, []);

  const updateQuantity = useCallback(
    (
      productId: string,
      quantity: number,
      dimensionId?: string,
      additionalOptions?: AdditionalOption[],
    ) => {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: {
          productId,
          quantity,
          dimensionId,
          additionalOptions,
        },
      });
    },
    [],
  );

  const updateFabricQuantity = useCallback(
    (fabricId: string, quantity: number) => {
      dispatch({
        type: "UPDATE_FABRIC_QUANTITY",
        payload: { fabricId, quantity },
      });
    },
    [],
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  // Вычисляемые значения
  const totalItems = useMemo(() => {
    const productItems =
      state.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const fabricItems =
      state.fabricItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    return productItems + fabricItems;
  }, [state.items, state.fabricItems]);

  const getItemQuantity = (
    productId: string,
    dimensionId?: string,
    additionalOptions?: any[],
  ): number => {
    const item = state.items.find(
      (item) =>
        item.product.id === productId &&
        item.selectedDimension?.id === dimensionId &&
        JSON.stringify(item.selectedAdditionalOptions) ===
          JSON.stringify(additionalOptions),
    );
    return item?.quantity || 0;
  };

  const isInCart = (
    productId: string,
    dimensionId?: string,
    additionalOptions?: any[],
  ): boolean => {
    return getItemQuantity(productId, dimensionId, additionalOptions) > 0;
  };

  const contextValue: CartContextType = {
    items: state.items,
    fabricItems: state.fabricItems,
    totalPrice: state.totalPrice,
    addToCart,
    addFabricToCart,
    removeFromCart,
    removeFabricFromCart,
    updateQuantity,
    updateFabricQuantity,
    clearCart,
    totalItems,
    getItemQuantity,
    isInCart,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
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

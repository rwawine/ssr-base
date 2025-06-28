import type { Product, AdditionalOption } from "./product";
import type { FabricCollection, FabricVariant } from "./fabric";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedDimension?: {
    id: string;
    width: number;
    length: number;
    height?: number;
    price: number;
  };
  selectedAdditionalOptions?: AdditionalOption[];
}

export interface FabricCartItem {
  fabric: {
    collection: FabricCollection;
    variant: FabricVariant;
    categorySlug: string;
    collectionSlug: string;
  };
  quantity: number;
  price: 0; // Ткани бесплатные
}

export interface CartState {
  items: CartItem[];
  fabricItems: FabricCartItem[];
  totalPrice: number;
}

export interface CartContextType {
  items: CartItem[];
  fabricItems: FabricCartItem[];
  totalPrice: number;
  addToCart: (
    product: Product,
    quantity?: number,
    dimensionId?: string,
    additionalOptions?: AdditionalOption[],
  ) => void;
  addFabricToCart: (
    fabric: {
      collection: FabricCollection;
      variant: FabricVariant;
      categorySlug: string;
      collectionSlug: string;
    },
    quantity?: number,
  ) => void;
  removeFromCart: (
    productId: string,
    dimensionId?: string,
    additionalOptions?: AdditionalOption[],
  ) => void;
  removeFabricFromCart: (fabricId: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    dimensionId?: string,
    additionalOptions?: AdditionalOption[],
  ) => void;
  updateFabricQuantity: (fabricId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  getItemQuantity: (
    productId: string,
    dimensionId?: string,
    additionalOptions?: AdditionalOption[],
  ) => number;
  isInCart: (
    productId: string,
    dimensionId?: string,
    additionalOptions?: AdditionalOption[],
  ) => boolean;
  isHydrated: boolean;
}

import { Product, Dimension, AdditionalOption } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedDimension?: Dimension;
  selectedAdditionalOptions?: AdditionalOption[];
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CartContextType extends CartState {
  addToCart: (
    product: Product,
    quantity?: number,
    dimension?: Dimension,
    additionalOptions?: AdditionalOption[],
  ) => void;
  removeFromCart: (
    productId: string,
    dimensionId?: string,
    additionalOptions?: AdditionalOption[],
  ) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    dimensionId?: string,
    additionalOptions?: AdditionalOption[],
  ) => void;
  clearCart: () => void;
  isInCart: (
    productId: string,
    dimensionId?: string,
    additionalOptions?: AdditionalOption[],
  ) => boolean;
  getItemQuantity: (
    productId: string,
    dimensionId?: string,
    additionalOptions?: AdditionalOption[],
  ) => number;
  discount: number;
  promoCode: string;
  formattedTotalPrice: string;
  formattedDiscountedPrice: string;
  isCartEmpty: boolean;
  applyPromo: (code: string) => void;
  resetPromo: () => void;
}

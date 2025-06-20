import { Product, Dimension } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedDimension?: Dimension;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CartContextType {
  cart: CartState;
  addToCart: (product: Product, quantity?: number, dimension?: Dimension) => void;
  removeFromCart: (productId: string, dimensionId?: string) => void;
  updateQuantity: (productId: string, quantity: number, dimensionId?: string) => void;
  clearCart: () => void;
  isInCart: (productId: string, dimensionId?: string) => boolean;
  getItemQuantity: (productId: string, dimensionId?: string) => number;
} 
"use client";

import { CartProvider } from "@/hooks/CartContext";
import { FavoritesProvider } from "@/hooks/FavoritesContext";
import { ReactNode } from "react";

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <CartProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </CartProvider>
  );
}

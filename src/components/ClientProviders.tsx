"use client";

import { CartProvider } from "@/hooks/CartContext";
import { FavoritesProvider } from "@/hooks/FavoritesContext";
import { ReactNode, useEffect, useState } from "react";

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Рендерим провайдеры всегда, чтобы избежать ошибки гидратации
  return (
    <CartProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </CartProvider>
  );
}

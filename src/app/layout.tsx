import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { CartProvider } from "@/hooks/CartContext";
import { FavoritesProvider } from "@/hooks/FavoritesContext";
import { defaultMetadata } from "@/lib/metadata";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <script 
          async 
          src="https://script.click-chat.ru/chat.js?wid=2806a4e5-3f63-4afe-b6a3-d09e0d4f08b4"
        />
      </head>
      <body>
        <CartProvider>
          <FavoritesProvider>
            <Header />
            {children}
            <Footer />
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}

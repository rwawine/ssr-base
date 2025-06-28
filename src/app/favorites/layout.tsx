import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

// Убираем дублирующиеся метаданные - они будут в page.tsx
export const metadata: Metadata = generatePageMetadata(
  {
    title: "Избранное - Dilavia",
    description: "Ваши избранные товары в интернет-магазине Dilavia.",
    noindex: true, // Избранное не должно индексироваться
  },
  "/favorites",
);

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

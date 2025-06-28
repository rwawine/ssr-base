import { Metadata } from "next";

// Убираем дублирующиеся метаданные - они будут в page.tsx
export const metadata: Metadata = {};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

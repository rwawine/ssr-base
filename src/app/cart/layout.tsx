import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

// Убираем дублирующиеся метаданные - они будут в page.tsx
export const metadata: Metadata = generatePageMetadata(
  {
    title: "Корзина — интернет-магазин мебели Dilavia",
    description:
      "Ваша корзина в интернет-магазине Dilavia. Оформите заказ на качественную мебель и ткани с доставкой по всей Беларуси. Безопасная оплата, гарантия качества.",
    keywords:
      "корзина, заказ, мебель, ткани, Dilavia, интернет-магазин, доставка, оплата",
    noindex: true, // Корзина не должна индексироваться
  },
  "/cart",
);

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

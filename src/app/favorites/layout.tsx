import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

// Убираем дублирующиеся метаданные - они будут в page.tsx
export const metadata: Metadata = {
  title: "Избранное - Dilavia",
  description:
    "Избранные товары в интернет-магазине Dilavia. Сохраните понравившиеся товары для покупки позже.",
  keywords: "избранное, избранные товары, сохраненные товары, Dilavia",
  openGraph: {
    title: "Избранное - Dilavia",
    description:
      "Избранные товары в интернет-магазине Dilavia. Сохраните понравившиеся товары для покупки позже.",
    url: "https://dilavia.by/favorites",
    siteName: "Dilavia",
    images: [
      { url: "https://dilavia.by/images/logo.svg", width: 1200, height: 630 },
    ],
    locale: "ru_RU",
    type: "website",
  },
  alternates: {
    canonical: "/favorites",
  },
};

export default async function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Генерируем структурированные данные только для избранного
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Избранное",
    description: "Избранные товары в интернет-магазине Dilavia",
    url: "https://dilavia.by/favorites",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Главная",
          item: "https://dilavia.by",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Избранное",
          item: "https://dilavia.by/favorites",
        },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Избранные товары",
      description: "Избранные товары в интернет-магазине Dilavia",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}

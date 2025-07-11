import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

// Убираем дублирующиеся метаданные - они будут в page.tsx
export const metadata: Metadata = {
  title: "Корзина покупок - Dilavia",
  description: "Товары в корзине покупок мебельной фабрики Dilavia.",
  openGraph: {
    title: "Корзина покупок - Dilavia",
    description: "Товары в корзине покупок мебельной фабрики Dilavia.",
    url: "https://dilavia.by/cart",
    siteName: "Dilavia",
    images: [
      { url: "https://dilavia.by/images/logo.svg", width: 1200, height: 630 },
    ],
    locale: "ru_RU",
    type: "website",
  },
};

export default async function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Генерируем структурированные данные только для корзины
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Корзина покупок",
    description: "Товары в корзине покупок",
    url: "https://dilavia.by/cart",
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
          name: "Корзина",
          item: "https://dilavia.by/cart",
        },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Корзина покупок",
      description: "Товары в корзине покупок",
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

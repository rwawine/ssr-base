import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Доставка - Dilavia",
  description:
    "Условия доставки мебели по Беларуси от мебельной фабрики Dilavia.",
  openGraph: {
    title: "Доставка - Dilavia",
    description:
      "Условия доставки мебели по Беларуси от мебельной фабрики Dilavia.",
    url: "https://dilavia.by/delivery",
    siteName: "Dilavia",
    images: [
      { url: "https://dilavia.by/images/logo.svg", width: 1200, height: 630 },
    ],
    locale: "ru_RU",
    type: "website",
  },
};

export default async function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Генерируем структурированные данные только для страницы доставки
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Доставка",
    description:
      "Условия доставки мебели по Беларуси от мебельной фабрики Dilavia.",
    url: "https://dilavia.by/delivery",
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
          name: "Доставка",
          item: "https://dilavia.by/delivery",
        },
      ],
    },
    mainEntity: {
      "@type": "Article",
      name: "Условия доставки",
      description: "Информация о доставке мебели по Беларуси",
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

import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

// Базовые метаданные для layout каталога
export const metadata: Metadata = {
  title: "Каталог мебели - Dilavia",
  description:
    "Широкий ассортимент качественной мебели: кровати, диваны, кресла и многое другое от мебельной фабрики Dilavia.",
  openGraph: {
    title: "Каталог мебели - Dilavia",
    description:
      "Широкий ассортимент качественной мебели: кровати, диваны, кресла и многое другое от мебельной фабрики Dilavia.",
    url: "https://dilavia.by/catalog",
    siteName: "Dilavia",
    images: [
      { url: "https://dilavia.by/images/logo.svg", width: 1200, height: 630 },
    ],
    locale: "ru_RU",
    type: "website",
  },
};

export default async function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Генерируем структурированные данные только для каталога
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Каталог мебели",
    description:
      "Широкий ассортимент качественной мебели: кровати, диваны, кресла и многое другое",
    url: "https://dilavia.by/catalog",
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
          name: "Каталог",
          item: "https://dilavia.by/catalog",
        },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Каталог мебели",
      description:
        "Широкий ассортимент качественной мебели: кровати, диваны, кресла и многое другое",
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

import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Ткани для мебели - Dilavia",
  description:
    "Широкий выбор качественных тканей для мебели: букле, велюр, микрофибра, жаккард от мебельной фабрики Dilavia.",
  openGraph: {
    title: "Ткани для мебели - Dilavia",
    description:
      "Широкий выбор качественных тканей для мебели: букле, велюр, микрофибра, жаккард от мебельной фабрики Dilavia.",
    url: "https://dilavia.by/fabrics",
    siteName: "Dilavia",
    images: [
      { url: "https://dilavia.by/images/logo.svg", width: 1200, height: 630 },
    ],
    locale: "ru_RU",
    type: "website",
  },
};

export default async function FabricsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Генерируем структурированные данные только для тканей
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Каталог тканей для мебели",
    description:
      "Широкий выбор качественных тканей для мебели: букле, велюр, микрофибра, жаккард",
    url: "https://dilavia.by/fabrics",
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
          name: "Ткани",
          item: "https://dilavia.by/fabrics",
        },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Каталог тканей для мебели",
      description:
        "Широкий выбор качественных тканей для мебели: букле, велюр, микрофибра, жаккард",
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

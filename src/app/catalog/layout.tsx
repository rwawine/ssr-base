import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { generateProductStructuredData } from "@/lib/seo-utils";

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

async function getAllProducts() {
  const data = await import("@/data/data.json");
  return data.default[0].products;
}

export default async function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const products = await getAllProducts();
  function toAbsoluteImages(product: any) {
    const abs = (url: string) =>
      url.startsWith("http") ? url : `https://dilavia.by${url}`;
    return {
      ...product,
      images: product.images?.map(abs) || [],
    };
  }
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: generateProductStructuredData(
        toAbsoluteImages(
          product as unknown as import("@/types/product").Product,
        ),
      ),
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: "https://dilavia.by/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Каталог",
        item: "https://dilavia.by/catalog",
      },
    ],
  };
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Каталог мебели",
    description:
      "Широкий ассортимент качественной мебели: кровати, диваны, кресла и многое другое от мебельной фабрики Dilavia.",
    url: "https://dilavia.by/catalog",
    breadcrumb: breadcrumbSchema,
    mainEntity: itemListSchema,
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}

import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Отзывы - Dilavia",
  description: "Читайте отзывы клиентов о мебели от мебельной фабрики Dilavia.",
  openGraph: {
    title: "Отзывы - Dilavia",
    description:
      "Читайте отзывы клиентов о мебели от мебельной фабрики Dilavia.",
    url: "https://dilavia.by/reviews",
    siteName: "Dilavia",
    images: [
      { url: "https://dilavia.by/images/logo.svg", width: 1200, height: 630 },
    ],
    locale: "ru_RU",
    type: "website",
  },
};

export default async function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // BreadcrumbList
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
        name: "Отзывы",
        item: "https://dilavia.by/reviews",
      },
    ],
  };
  // ItemList отзывов (пока без реальных отзывов)
  const reviewsItemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Отзывы клиентов",
    description: "Коллекция отзывов клиентов о мебели от Dilavia",
    numberOfItems: 50,
    itemListElement: [],
  };
  // WebPage schema
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Отзывы",
    description: "Отзывы клиентов о мебели от Dilavia.",
    url: "https://dilavia.by/reviews",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(reviewsItemListSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}

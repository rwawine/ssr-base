import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "О нас - Dilavia",
  description:
    "Узнайте больше о мебельной фабрике Dilavia - производителе качественной мебели в Беларуси.",
  openGraph: {
    title: "О нас - Dilavia",
    description:
      "Узнайте больше о мебельной фабрике Dilavia - производителе качественной мебели в Беларуси.",
    url: "https://dilavia.by/about",
    siteName: "Dilavia",
    images: [
      { url: "https://dilavia.by/images/logo.svg", width: 1200, height: 630 },
    ],
    locale: "ru_RU",
    type: "website",
  },
};

export default async function AboutLayout({
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
        name: "О нас",
        item: "https://dilavia.by/about",
      },
    ],
  };
  // WebPage schema
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "О нас",
    description: "Информация о мебельной фабрике Dilavia.",
    url: "https://dilavia.by/about",
  };
  return (
    <>
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

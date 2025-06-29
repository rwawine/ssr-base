import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Политика конфиденциальности - Dilavia",
  description: "Политика конфиденциальности мебельной фабрики Dilavia.",
  openGraph: {
    title: "Политика конфиденциальности - Dilavia",
    description: "Политика конфиденциальности мебельной фабрики Dilavia.",
    url: "https://dilavia.by/privacy",
    siteName: "Dilavia",
    images: [
      { url: "https://dilavia.by/images/logo.svg", width: 1200, height: 630 },
    ],
    locale: "ru_RU",
    type: "website",
  },
};

export default async function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Генерируем структурированные данные только для страницы политики конфиденциальности
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Политика конфиденциальности",
    description: "Политика конфиденциальности мебельной фабрики Dilavia.",
    url: "https://dilavia.by/privacy",
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
          name: "Политика конфиденциальности",
          item: "https://dilavia.by/privacy",
        },
      ],
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

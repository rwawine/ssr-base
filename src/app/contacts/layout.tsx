import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Контакты - Dilavia",
  description:
    "Свяжитесь с мебельной фабрикой Dilavia для заказа мебели или получения консультации.",
  openGraph: {
    title: "Контакты - Dilavia",
    description:
      "Свяжитесь с мебельной фабрикой Dilavia для заказа мебели или получения консультации.",
    url: "https://dilavia.by/contacts",
    siteName: "Dilavia",
    images: [
      { url: "https://dilavia.by/images/logo.svg", width: 1200, height: 630 },
    ],
    locale: "ru_RU",
    type: "website",
  },
};

export default async function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Генерируем структурированные данные только для страницы контактов
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Контакты",
    description: "Контактная информация мебельной фабрики Dilavia.",
    url: "https://dilavia.by/contacts",
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
          name: "Контакты",
          item: "https://dilavia.by/contacts",
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

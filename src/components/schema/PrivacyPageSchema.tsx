import React from "react";
import { siteConfig } from "@/lib/metadata";

export function PrivacyPageSchema() {
  const privacyPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Политика конфиденциальности",
    description:
      "Политика конфиденциальности интернет-магазина Dilavia. Как мы обрабатываем и защищаем ваши персональные данные.",
    url: `${siteConfig.url}/privacy`,
    isPartOf: {
      "@type": "WebSite",
      name: "Dilavia",
      url: siteConfig.url,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Главная",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Политика конфиденциальности",
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(privacyPageSchema, null, 2),
      }}
    />
  );
}

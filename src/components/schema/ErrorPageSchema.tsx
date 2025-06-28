import React from "react";
import { siteConfig } from "@/lib/metadata";

export function ErrorPageSchema() {
  const errorPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "404 - Страница не найдена",
    description:
      "К сожалению, запрашиваемая страница не существует или была перемещена. Перейдите на главную или воспользуйтесь навигацией сайта.",
    url: `${siteConfig.url}/404`,
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
          name: "404",
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(errorPageSchema, null, 2),
      }}
    />
  );
}

import React from "react";

export function WebSiteSchema() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dilavia - Мебельная фабрика",
    url: "https://dilavia.by",
    description:
      "Мебельная фабрика Dilavia - производитель современной дизайнерской мебели в Беларуси. Диваны, кровати, кресла высокого качества.",
    publisher: {
      "@type": "Organization",
      name: "Dilavia",
      url: "https://dilavia.by",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://dilavia.by/catalog?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "ru",
    isAccessibleForFree: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(websiteSchema, null, 2),
      }}
    />
  );
}

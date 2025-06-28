import React from "react";
import { siteConfig } from "@/lib/metadata";

interface AboutPageSchemaProps {
  title?: string;
  description?: string;
  imageUrl?: string;
}

export function AboutPageSchema({
  title = "О компании Dilavia",
  description = "Производство мебели в Беларуси. Экологически чистые материалы, европейские поставщики, контроль качества на каждом этапе.",
  imageUrl,
}: AboutPageSchemaProps) {
  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: title,
    description: description,
    url: `${siteConfig.url}/about`,
    ...(imageUrl && {
      image: imageUrl,
    }),
    mainEntity: {
      "@type": "Organization",
      name: "Dilavia",
      alternateName: "Дилавия",
      foundingDate: "2023",
      description:
        "Мебельная фабрика Dilavia - производитель современной дизайнерской мебели в Беларуси. Диваны, кровати, кресла высокого качества.",
      url: siteConfig.url,
      logo: `${siteConfig.url}/images/logo.svg`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "ул. Железнодорожная, д. 33А, оф. 402",
        addressLocality: "Минск",
        postalCode: "220089",
        addressCountry: "BY",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+375336641830",
          contactType: "customer service",
          areaServed: "BY",
          availableLanguage: ["Russian", "Belarusian"],
        },
        {
          "@type": "ContactPoint",
          telephone: "+375298019271",
          contactType: "customer service",
          areaServed: "BY",
          availableLanguage: ["Russian", "Belarusian"],
        },
      ],
      areaServed: {
        "@type": "Country",
        name: "Belarus",
      },
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
          name: "О компании",
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(aboutPageSchema, null, 2),
      }}
    />
  );
}

import React from "react";
import { siteConfig } from "@/lib/metadata";

export function GlobalSchema() {
  // Объединенная схема организации (централизованная)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dilavia",
    alternateName: "Дилавия",
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.svg`,
    description:
      "Мебельная фабрика Dilavia - производитель современной дизайнерской мебели в Беларуси. Диваны, кровати, кресла высокого качества.",
    foundingDate: "2023",
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
      {
        "@type": "ContactPoint",
        email: "infomiagkhikomfort@gmail.com",
        contactType: "customer service",
        areaServed: "BY",
      },
    ],
    sameAs: ["https://t.me/dilavia", "https://www.instagram.com/dilavia.by"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Каталог мебели",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Диваны",
            description: "Современные диваны различных размеров и конфигураций",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Кровати",
            description: "Комфортные кровати для спальни",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Кресла",
            description: "Удобные кресла для гостиной",
          },
        },
      ],
    },
    areaServed: {
      "@type": "Country",
      name: "Belarus",
    },
    serviceArea: {
      "@type": "Country",
      name: "Belarus",
    },
  };

  // Схема веб-сайта (централизованная)
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dilavia - Мебельная фабрика",
    url: siteConfig.url,
    description:
      "Мебельная фабрика Dilavia - производитель современной дизайнерской мебели в Беларуси. Диваны, кровати, кресла высокого качества.",
    publisher: {
      "@type": "Organization",
      name: "Dilavia",
      url: siteConfig.url,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/catalog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "ru",
    isAccessibleForFree: true,
  };

  // Схема локального бизнеса
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Dilavia",
    alternateName: "Дилавия",
    description: "Мебельная фабрика - производство и продажа мебели в Минске",
    url: siteConfig.url,
    telephone: "+375336641830",
    email: "infomiagkhikomfort@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Железнодорожная, д. 33А, оф. 402",
      addressLocality: "Минск",
      postalCode: "220089",
      addressCountry: "BY",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 53.902284,
      longitude: 27.561831,
    },
    openingHours: "Mo-Fr 09:00-18:00",
    priceRange: "$$",
    areaServed: {
      "@type": "Country",
      name: "Belarus",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Каталог мебели",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema, null, 2),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema, null, 2),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema, null, 2),
        }}
      />
    </>
  );
}

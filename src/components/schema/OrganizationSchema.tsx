import React from "react";

export function OrganizationSchema() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dilavia",
    alternateName: "Дилавия",
    url: "https://dilavia.by",
    logo: "https://dilavia.by/images/logo.svg",
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
        email: "information@dilavia.by",
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationSchema, null, 2),
      }}
    />
  );
}

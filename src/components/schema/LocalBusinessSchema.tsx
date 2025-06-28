import React from "react";

export function LocalBusinessSchema() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Dilavia - Мебельная фабрика",
    alternateName: "Дилавия",
    description:
      "Мебельная фабрика Dilavia - производитель современной дизайнерской мебели в Беларуси. Диваны, кровати, кресла высокого качества.",
    url: "https://dilavia.by",
    logo: "https://dilavia.by/images/logo.svg",
    image: "https://dilavia.by/images/logo.svg",
    telephone: ["+375336641830", "+375298019271"],
    email: "information@dilavia.by",
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Железнодорожная, д. 33А, оф. 402",
      addressLocality: "Минск",
      postalCode: "220089",
      addressCountry: "BY",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 53.9023,
      longitude: 27.5618,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "16:00",
      },
    ],
    priceRange: "$$",
    currenciesAccepted: "BYN",
    paymentAccepted: ["Cash", "Credit Card", "Bank Transfer"],
    areaServed: {
      "@type": "Country",
      name: "Belarus",
    },
    serviceArea: {
      "@type": "Country",
      name: "Belarus",
    },
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
    sameAs: ["https://t.me/dilavia", "https://www.instagram.com/dilavia.by"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(localBusinessSchema, null, 2),
      }}
    />
  );
}

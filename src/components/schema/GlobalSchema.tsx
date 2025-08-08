import React from "react";
import { siteConfig } from "@/lib/metadata";

export function GlobalSchema() {
  // Объединенная схема организации (централизованная)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}#organization`,
    name: "Dilavia",
    alternateName: "Дилавия",
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.svg`,
    image: `${siteConfig.url}/images/logo.svg`,
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
            image: `${siteConfig.url}/images/Sofa/Straight_sofa/Milton/1.png`,
            offers: {
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              priceCurrency: "BYN",
              price: "0",
              priceValidUntil: "2025-12-31",
              seller: {
                "@type": "Organization",
                name: "Dilavia",
                url: siteConfig.url,
                image: `${siteConfig.url}/images/logo.svg`,
              },
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: "127",
              bestRating: "5",
              worstRating: "1",
            },
            review: [
              {
                "@type": "Review",
                author: {
                  "@type": "Person",
                  name: "Анна Петрова",
                },
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: "5",
                  bestRating: "5",
                },
                reviewBody:
                  "Отличное качество диванов! Очень довольна покупкой.",
                datePublished: "2024-01-15",
              },
              {
                "@type": "Review",
                author: {
                  "@type": "Person",
                  name: "Михаил Иванов",
                },
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: "4",
                  bestRating: "5",
                },
                reviewBody: "Хороший диван, качественная сборка. Рекомендую!",
                datePublished: "2024-01-10",
              },
            ],
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Кровати",
            description: "Комфортные кровати для спальни",
            image: `${siteConfig.url}/images/Sofa/Bed/1/1.jpg`,
            offers: {
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              priceCurrency: "BYN",
              price: "0",
              priceValidUntil: "2025-12-31",
              seller: {
                "@type": "Organization",
                name: "Dilavia",
                url: siteConfig.url,
                image: `${siteConfig.url}/images/logo.svg`,
              },
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "89",
              bestRating: "5",
              worstRating: "1",
            },
            review: [
              {
                "@type": "Review",
                author: {
                  "@type": "Person",
                  name: "Елена Сидорова",
                },
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: "5",
                  bestRating: "5",
                },
                reviewBody: "Прекрасная кровать! Очень удобная и качественная.",
                datePublished: "2024-01-20",
              },
              {
                "@type": "Review",
                author: {
                  "@type": "Person",
                  name: "Дмитрий Козлов",
                },
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: "5",
                  bestRating: "5",
                },
                reviewBody: "Отличное качество, быстрая доставка. Спасибо!",
                datePublished: "2024-01-18",
              },
            ],
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Кресла",
            description: "Удобные кресла для гостиной",
            image: `${siteConfig.url}/images/Sofa/Armchair/Kreslo/1.png`,
            offers: {
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              priceCurrency: "BYN",
              price: "0",
              priceValidUntil: "2025-12-31",
              seller: {
                "@type": "Organization",
                name: "Dilavia",
                url: siteConfig.url,
                image: `${siteConfig.url}/images/logo.svg`,
              },
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.7",
              reviewCount: "64",
              bestRating: "5",
              worstRating: "1",
            },
            review: [
              {
                "@type": "Review",
                author: {
                  "@type": "Person",
                  name: "Ольга Морозова",
                },
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: "5",
                  bestRating: "5",
                },
                reviewBody:
                  "Очень удобное кресло! Идеально подходит для гостиной.",
                datePublished: "2024-01-25",
              },
              {
                "@type": "Review",
                author: {
                  "@type": "Person",
                  name: "Александр Волков",
                },
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: "4",
                  bestRating: "5",
                },
                reviewBody: "Качественное кресло, хороший дизайн. Рекомендую!",
                datePublished: "2024-01-22",
              },
            ],
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
    "@id": `${siteConfig.url}#website`,
    name: "Dilavia - Мебельная фабрика",
    url: siteConfig.url,
    description:
      "Мебельная фабрика Dilavia - производитель современной дизайнерской мебели в Беларуси. Диваны, кровати, кресла высокого качества.",
    publisher: {
      "@id": `${siteConfig.url}#organization`,
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
    "@id": `${siteConfig.url}#localbusiness`,
    name: "Dilavia",
    alternateName: "Дилавия",
    description: "Мебельная фабрика - производство и продажа мебели в Минске",
    url: siteConfig.url,
    image: `${siteConfig.url}/images/logo.svg`,
    telephone: "+375336641830",
    email: "infomiagkhikomfort@gmail.com",
    priceRange: "$$",
    openingHours: "Mo-Fr 09:00-18:00",
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
    areaServed: {
      "@type": "Country",
      name: "Belarus",
    },
    hasMap: "https://maps.google.com/?q=53.902284,27.561831",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Каталог мебели",
    },
  };

  // Схема главной страницы
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}#webpage`,
    name: "Dilavia - Мебельная фабрика в Минске",
    description:
      "Купить мебель в Минске и по всей Беларуси. Большой выбор диванов, кроватей, кресел и аксессуаров от мебельной фабрики Dilavia.",
    url: siteConfig.url,
    isPartOf: {
      "@id": `${siteConfig.url}#website`,
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
      ],
    },
    mainEntity: {
      "@id": `${siteConfig.url}#organization`,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema, null, 2),
        }}
      />
    </>
  );
}

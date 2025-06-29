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
    name: "Dilavia - Мебельная фабрика",
    url: siteConfig.url,
    description:
      "Мебельная фабрика Dilavia - производитель современной дизайнерской мебели в Беларуси. Диваны, кровати, кресла высокого качества.",
    publisher: {
      "@type": "Organization",
      name: "Dilavia",
      url: siteConfig.url,
      image: `${siteConfig.url}/images/logo.svg`,
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
    image: `${siteConfig.url}/images/logo.svg`,
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

  // Схема главной страницы
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Dilavia - Мебельная фабрика в Минске",
    description:
      "Купить мебель в Минске и по всей Беларуси. Большой выбор диванов, кроватей, кресел и аксессуаров от мебельной фабрики Dilavia.",
    url: siteConfig.url,
    isPartOf: {
      "@type": "WebSite",
      name: "Dilavia - Мебельная фабрика",
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
      ],
    },
    mainEntity: {
      "@type": "Organization",
      name: "Dilavia",
      url: siteConfig.url,
      image: `${siteConfig.url}/images/logo.svg`,
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

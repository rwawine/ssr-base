import React from "react";
import { siteConfig } from "@/lib/metadata";

export function ContactPageSchema() {
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Контакты Dilavia",
    description:
      "Свяжитесь с нами для заказа мебели. Телефоны, адрес, email. Консультации и заказы по всей Беларуси.",
    url: `${siteConfig.url}/contacts`,
    mainEntity: {
      "@type": "LocalBusiness",
      name: "Dilavia",
      alternateName: "Дилавия",
      description: "Мебельная фабрика - производство и продажа мебели в Минске",
      url: siteConfig.url,
      telephone: ["+375336641830", "+375298019271"],
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
          name: "Контакты",
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(contactPageSchema, null, 2),
      }}
    />
  );
}

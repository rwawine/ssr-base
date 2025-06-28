import React from "react";
import { siteConfig } from "@/lib/metadata";

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date?: string;
}

interface ReviewPageSchemaProps {
  reviews?: Review[];
}

export function ReviewPageSchema({ reviews = [] }: ReviewPageSchemaProps) {
  const reviewPageSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Отзывы о мебели Dilavia",
    description:
      "Отзывы покупателей о мебели и сервисе интернет-магазина Dilavia. Читайте реальные мнения клиентов и делитесь своим опытом.",
    url: `${siteConfig.url}/reviews`,
    numberOfItems: reviews.length,
    itemListElement: reviews.map((review, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: review.author,
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: review.text,
        datePublished: review.date || new Date().toISOString(),
        itemReviewed: {
          "@type": "Organization",
          name: "Dilavia",
          url: siteConfig.url,
        },
      },
    })),
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
          name: "Отзывы",
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(reviewPageSchema, null, 2),
      }}
    />
  );
}

import React from "react";

interface ProductAggregateRatingSchemaProps {
  productSlug: string;
  productName: string;
  averageRating?: number;
  reviewCount?: number;
  bestRating?: number;
  worstRating?: number;
}

export function ProductAggregateRatingSchema({
  productSlug,
  productName,
  averageRating = 4.5,
  reviewCount = 12,
  bestRating = 5,
  worstRating = 1,
}: ProductAggregateRatingSchemaProps) {
  const aggregateRatingSchema = {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: {
      "@type": "Product",
      name: productName,
      "@id": `https://dilavia.by/catalog/${productSlug}`,
    },
    ratingValue: averageRating,
    reviewCount: reviewCount,
    bestRating: bestRating,
    worstRating: worstRating,
    ratingCount: reviewCount,
    author: {
      "@type": "Organization",
      name: "Dilavia",
      url: "https://dilavia.by",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(aggregateRatingSchema),
      }}
    />
  );
}

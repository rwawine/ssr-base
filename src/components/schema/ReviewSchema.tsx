import React from "react";

interface Review {
  id: string;
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
  productName?: string;
}

interface ReviewSchemaProps {
  reviews: Review[];
  productName?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export function ReviewSchema({
  reviews,
  productName,
  aggregateRating,
}: ReviewSchemaProps) {
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName || "Мебель Dilavia",
    review: reviews.map((review) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      author: {
        "@type": "Person",
        name: review.author,
      },
      reviewBody: review.reviewBody,
      datePublished: review.datePublished,
    })),
    ...(aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: aggregateRating.ratingValue,
        reviewCount: aggregateRating.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(reviewSchema, null, 2),
      }}
    />
  );
}

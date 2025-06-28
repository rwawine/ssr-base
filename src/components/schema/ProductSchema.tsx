import React from "react";
import { Product, Dimension } from "@/types/product";

interface ProductSchemaProps {
  product: Product;
  selectedDimension?: Dimension;
  additionalOptionsPrice?: number;
}

export function ProductSchema({
  product,
  selectedDimension,
  additionalOptionsPrice = 0,
}: ProductSchemaProps) {
  const basePrice = selectedDimension?.price ?? product.price?.current ?? 0;
  const currentPrice = basePrice + additionalOptionsPrice;
  const oldPrice = selectedDimension?.oldPrice ?? product.price?.old;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Dilavia",
    },
    category: product.category?.name || "Мебель",
    image: product.images?.map((img) => `https://dilavia.by${img}`) || [],
    url: `https://dilavia.by/catalog/${product.slug}`,
    offers: {
      "@type": "Offer",
      price: currentPrice,
      priceCurrency: "BYN",
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      availability:
        product.availability === "В наличии"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Dilavia",
        url: "https://dilavia.by",
      },
      deliveryLeadTime: {
        "@type": "QuantitativeValue",
        value: 14,
        unitCode: "DAY",
      },
    },
    aggregateRating: product.popularity
      ? {
          "@type": "AggregateRating",
          ratingValue: product.popularity,
          reviewCount: Math.floor(product.popularity * 10),
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Артикул",
        value: product.id,
      },
      {
        "@type": "PropertyValue",
        name: "Модель",
        value: product.name,
      },
      ...(product.color
        ? [
            {
              "@type": "PropertyValue",
              name: "Цвет",
              value: product.color,
            },
          ]
        : []),
      ...(product.country
        ? [
            {
              "@type": "PropertyValue",
              name: "Страна производства",
              value: product.country,
            },
          ]
        : []),
      ...(product.warranty
        ? [
            {
              "@type": "PropertyValue",
              name: "Гарантия",
              value: product.warranty,
            },
          ]
        : []),
      ...(selectedDimension
        ? [
            {
              "@type": "PropertyValue",
              name: "Размеры",
              value: `${selectedDimension.width}x${selectedDimension.length} см`,
            },
          ]
        : []),
      ...(product.features && product.features.length > 0
        ? product.features.map((feature) => ({
            "@type": "PropertyValue",
            name: "Особенности",
            value: feature,
          }))
        : []),
    ].filter(Boolean),
  };

  // Удаляем undefined значения
  if (!productSchema.aggregateRating) {
    delete productSchema.aggregateRating;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(productSchema, null, 2),
      }}
    />
  );
}

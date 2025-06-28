"use client";

import React from "react";
import { Product } from "@/types/product";

interface CatalogItemListSchemaProps {
  products: Product[];
  categoryName?: string;
  subcategoryName?: string;
  currentPage?: number;
  totalPages?: number;
  baseUrl: string;
}

export default function CatalogItemListSchema({
  products,
  categoryName,
  subcategoryName,
  currentPage = 1,
  totalPages = 1,
  baseUrl,
}: CatalogItemListSchemaProps) {
  const pageTitle = categoryName
    ? subcategoryName
      ? `${subcategoryName} - ${categoryName}`
      : categoryName
    : "Каталог мебели";

  const pageDescription = categoryName
    ? subcategoryName
      ? `Купить ${subcategoryName.toLowerCase()} в категории ${categoryName.toLowerCase()} в интернет-магазине Dilavia. ${products.length} товаров в наличии.`
      : `Купить ${categoryName.toLowerCase()} в интернет-магазине Dilavia. ${products.length} товаров в наличии.`
    : `Широкий ассортимент мебели: кровати, диваны, кресла и многое другое. ${products.length} товаров в наличии.`;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: pageTitle,
    description: pageDescription,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.images?.[0],
        sku: product.id,
        category: product.category?.name,
        ...(product.subcategory && {
          additionalProperty: [
            {
              "@type": "PropertyValue",
              name: "Подкатегория",
              value: product.subcategory.name,
            },
          ],
        }),
        offers: {
          "@type": "Offer",
          price: product.price?.current,
          priceCurrency: "BYN",
          availability: product.price?.current
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          seller: {
            "@type": "Organization",
            name: "Dilavia",
            url: "https://dilavia.by",
          },
          ...(product.price?.old && {
            highPrice: product.price.old,
            lowPrice: product.price.current,
          }),
        },
        ...(product.popularity && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Math.min(5, Math.max(1, product.popularity / 20)), // Нормализуем популярность в рейтинг 1-5
            reviewCount: Math.floor(product.popularity / 10),
          },
        }),
      },
    })),
    ...(totalPages > 1 && {
      pagination: {
        "@type": "ItemList",
        isPartOf: {
          "@type": "CollectionPage",
          url: baseUrl,
        },
        ...(currentPage > 1 && {
          previousItem: {
            "@type": "ListItem",
            url: `${baseUrl}?page=${currentPage - 1}`,
          },
        }),
        ...(currentPage < totalPages && {
          nextItem: {
            "@type": "ListItem",
            url: `${baseUrl}?page=${currentPage + 1}`,
          },
        }),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
    />
  );
}

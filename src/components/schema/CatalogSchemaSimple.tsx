"use client";

import React from "react";
import { Product } from "@/types/product";

interface CatalogSchemaSimpleProps {
  products: Product[];
  categoryName?: string;
  subcategoryName?: string;
  currentPage?: number;
  totalPages?: number;
  baseUrl: string;
  hasFilters?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
}

export default function CatalogSchemaSimple({
  products,
  categoryName,
  subcategoryName,
  currentPage = 1,
  totalPages = 1,
  baseUrl,
  hasFilters = false,
  priceRange,
}: CatalogSchemaSimpleProps) {
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

  // ItemList Schema
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
            ratingValue: Math.min(5, Math.max(1, product.popularity / 20)),
            reviewCount: Math.floor(product.popularity / 10),
          },
        }),
      },
    })),
  };

  // CollectionPage Schema
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description: pageDescription,
    url: baseUrl,
    ...(categoryName && {
      about: {
        "@type": "Thing",
        name: categoryName,
        ...(subcategoryName && {
          additionalProperty: [
            {
              "@type": "PropertyValue",
              name: "Подкатегория",
              value: subcategoryName,
            },
          ],
        }),
      },
    }),
    ...(products.length > 0 && {
      numberOfItems: products.length,
    }),
    ...(priceRange && {
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "BYN",
        lowPrice: priceRange.min,
        highPrice: priceRange.max,
        offerCount: products.length,
        seller: {
          "@type": "Organization",
          name: "Dilavia",
          url: "https://dilavia.by",
        },
      },
    }),
    ...(hasFilters && {
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Фильтры применены",
          value: "true",
        },
      ],
    }),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Главная",
          item: "https://dilavia.by/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Каталог",
          item: "https://dilavia.by/catalog",
        },
        ...(categoryName
          ? [
              {
                "@type": "ListItem",
                position: 3,
                name: categoryName,
                item: `https://dilavia.by/catalog?category=${categoryName}`,
              },
            ]
          : []),
        ...(subcategoryName
          ? [
              {
                "@type": "ListItem",
                position: 4,
                name: subcategoryName,
                item: `https://dilavia.by/catalog?subcategory=${subcategoryName}`,
              },
            ]
          : []),
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema),
        }}
      />
    </>
  );
}

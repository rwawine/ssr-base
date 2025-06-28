"use client";

import React from "react";

interface CatalogCollectionPageSchemaProps {
  categoryName?: string;
  subcategoryName?: string;
  productCount: number;
  currentPage?: number;
  totalPages?: number;
  baseUrl: string;
  hasFilters?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
}

export default function CatalogCollectionPageSchema({
  categoryName,
  subcategoryName,
  productCount,
  currentPage = 1,
  totalPages = 1,
  baseUrl,
  hasFilters = false,
  priceRange,
}: CatalogCollectionPageSchemaProps) {
  const pageTitle = categoryName
    ? subcategoryName
      ? `${subcategoryName} - ${categoryName}`
      : categoryName
    : "Каталог мебели";

  const pageDescription = categoryName
    ? subcategoryName
      ? `Купить ${subcategoryName.toLowerCase()} в категории ${categoryName.toLowerCase()} в интернет-магазине Dilavia. ${productCount} товаров в наличии.`
      : `Купить ${categoryName.toLowerCase()} в интернет-магазине Dilavia. ${productCount} товаров в наличии.`
    : `Широкий ассортимент мебели: кровати, диваны, кресла и многое другое. ${productCount} товаров в наличии.`;

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
    ...(productCount > 0 && {
      numberOfItems: productCount,
    }),
    ...(priceRange && {
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "BYN",
        lowPrice: priceRange.min,
        highPrice: priceRange.max,
        offerCount: productCount,
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
    mainEntity: {
      "@type": "ItemList",
      name: pageTitle,
      numberOfItems: productCount,
      url: baseUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
    />
  );
}

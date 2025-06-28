import React from "react";
import { Product } from "@/types/product";

interface ProductBreadcrumbSchemaProps {
  product: Product;
}

export function ProductBreadcrumbSchema({
  product,
}: ProductBreadcrumbSchemaProps) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
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
      ...(product.category
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: product.category.name,
              item: `https://dilavia.by/catalog?category=${product.category.code}`,
            },
          ]
        : []),
      ...(product.subcategory
        ? [
            {
              "@type": "ListItem",
              position: 4,
              name: product.subcategory.name,
              item: `https://dilavia.by/catalog?category=${product.category?.code}&subcategory=${product.subcategory.code}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position:
          product.category && product.subcategory
            ? 5
            : product.category
              ? 4
              : 3,
        name: product.name,
        item: `https://dilavia.by/catalog/${product.slug}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}

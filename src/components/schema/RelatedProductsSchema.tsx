import React from "react";
import { Product } from "@/types/product";

interface RelatedProductsSchemaProps {
  mainProduct: Product;
  relatedProducts: Product[];
}

export function RelatedProductsSchema({
  mainProduct,
  relatedProducts,
}: RelatedProductsSchemaProps) {
  if (relatedProducts.length === 0) {
    return null;
  }

  const relatedProductsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Связанные товары для ${mainProduct.name}`,
    description: `Похожие товары в категории ${mainProduct.category?.name || "мебель"}`,
    numberOfItems: relatedProducts.length,
    itemListElement: relatedProducts.map((product, index) => ({
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
        url: `https://dilavia.by/catalog/${product.slug}`,
      },
    })),
    isRelatedTo: {
      "@type": "Product",
      name: mainProduct.name,
      "@id": `https://dilavia.by/catalog/${mainProduct.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(relatedProductsSchema),
      }}
    />
  );
}

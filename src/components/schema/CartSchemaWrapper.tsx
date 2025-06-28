"use client";

import React, { useEffect, useState } from "react";
import { CartItem } from "@/types/cart";
import { FabricCartItem } from "@/types/cart";

interface CartSchemaWrapperProps {
  items: CartItem[];
  fabricItems: FabricCartItem[];
  totalPrice: number;
  discount?: number;
  orderId?: string;
  orderSubmitted?: boolean;
}

export function CartSchemaWrapper({
  items,
  fabricItems,
  totalPrice,
  discount = 0,
  orderId,
  orderSubmitted = false,
}: CartSchemaWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const totalItemsCount = (items?.length || 0) + (fabricItems?.length || 0);
  const totalWithDiscount = Math.round((totalPrice || 0) * (1 - discount));

  // Если корзина пустая
  if (totalItemsCount === 0) {
    const emptyCartSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Корзина",
      description: "Ваша корзина в интернет-магазине Dilavia",
      numberOfItems: 0,
      itemListElement: [],
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(emptyCartSchema) }}
      />
    );
  }

  // Если заказ оформлен
  if (orderSubmitted && orderId) {
    const orderSchema = {
      "@context": "https://schema.org",
      "@type": "Order",
      orderNumber: orderId,
      orderStatus: "https://schema.org/OrderProcessing",
      orderDate: "",
      totalPrice: {
        "@type": "PriceSpecification",
        price: totalWithDiscount,
        priceCurrency: "BYN",
      },
      discount:
        discount > 0
          ? {
              "@type": "PriceSpecification",
              price: Math.round((totalPrice || 0) * discount),
              priceCurrency: "BYN",
            }
          : undefined,
      orderedItem: [
        ...(items || []).map((item, idx) => ({
          "@type": "OrderItem",
          position: idx + 1,
          quantity: item.quantity,
          item: {
            "@type": "Product",
            name: item.product.name,
            image: item.product.images?.[0],
            description: item.product.description,
            sku: item.product.id,
            offers: {
              "@type": "Offer",
              price:
                item.selectedDimension?.price || item.product.price?.current,
              priceCurrency: "BYN",
              availability: "https://schema.org/InStock",
              seller: {
                "@type": "Organization",
                name: "Dilavia",
                url: "https://dilavia.by",
              },
            },
            ...(item.selectedDimension && {
              additionalProperty: [
                {
                  "@type": "PropertyValue",
                  name: "Размеры",
                  value: `${item.selectedDimension.width}см × ${item.selectedDimension.length}см${item.selectedDimension.height ? ` × ${item.selectedDimension.height}см` : ""}`,
                },
              ],
            }),
            ...(item.selectedAdditionalOptions &&
              item.selectedAdditionalOptions.length > 0 && {
                additionalProperty: [
                  ...item.selectedAdditionalOptions.map((opt) => ({
                    "@type": "PropertyValue",
                    name: "Дополнительная опция",
                    value: opt.name,
                  })),
                ],
              }),
          },
        })),
        ...(fabricItems || []).map((item, idx) => ({
          "@type": "OrderItem",
          position: (items?.length || 0) + idx + 1,
          quantity: item.quantity,
          item: {
            "@type": "Product",
            name: `${item.fabric.collection.nameLoc} - ${item.fabric.variant.color.name}`,
            image: item.fabric.variant.image,
            description: `Ткань ${item.fabric.collection.nameLoc} цвет ${item.fabric.variant.color.name}`,
            sku: `fabric-${item.fabric.categorySlug}-${item.fabric.collectionSlug}-${item.fabric.variant.id}`,
            category: item.fabric.collection.technicalSpecifications.fabricType,
            additionalProperty: [
              {
                "@type": "PropertyValue",
                name: "Тип ткани",
                value:
                  item.fabric.collection.technicalSpecifications.fabricType,
              },
              {
                "@type": "PropertyValue",
                name: "Состав",
                value:
                  item.fabric.collection.technicalSpecifications.compositionLoc,
              },
              {
                "@type": "PropertyValue",
                name: "Износостойкость",
                value:
                  item.fabric.collection.technicalSpecifications
                    .abrasionResistance,
              },
            ],
            offers: {
              "@type": "Offer",
              price: 0, // Цена ткани не указана в корзине
              priceCurrency: "BYN",
              availability: "https://schema.org/InStock",
              seller: {
                "@type": "Organization",
                name: "Dilavia",
                url: "https://dilavia.by",
              },
            },
          },
        })),
      ],
      seller: {
        "@type": "Organization",
        name: "Dilavia",
        url: "https://dilavia.by",
        address: {
          "@type": "PostalAddress",
          addressCountry: "BY",
          addressLocality: "Минск",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: "+375-29-XXX-XX-XX",
        },
      },
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orderSchema) }}
      />
    );
  }

  // Обычная корзина с товарами
  const cartSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Корзина",
    description: "Ваша корзина в интернет-магазине Dilavia",
    numberOfItems: totalItemsCount,
    itemListElement: [
      ...(items || []).map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "Product",
          name: item.product.name,
          image: item.product.images?.[0],
          description: item.product.description,
          sku: item.product.id,
          offers: {
            "@type": "Offer",
            price: item.selectedDimension?.price || item.product.price?.current,
            priceCurrency: "BYN",
            availability: "https://schema.org/InStock",
            seller: {
              "@type": "Organization",
              name: "Dilavia",
              url: "https://dilavia.by",
            },
          },
          ...(item.selectedDimension && {
            additionalProperty: [
              {
                "@type": "PropertyValue",
                name: "Размеры",
                value: `${item.selectedDimension.width}см × ${item.selectedDimension.length}см${item.selectedDimension.height ? ` × ${item.selectedDimension.height}см` : ""}`,
              },
            ],
          }),
          ...(item.selectedAdditionalOptions &&
            item.selectedAdditionalOptions.length > 0 && {
              additionalProperty: [
                ...item.selectedAdditionalOptions.map((opt) => ({
                  "@type": "PropertyValue",
                  name: "Дополнительная опция",
                  value: opt.name,
                })),
              ],
            }),
        },
      })),
      ...(fabricItems || []).map((item, idx) => ({
        "@type": "ListItem",
        position: (items?.length || 0) + idx + 1,
        item: {
          "@type": "Product",
          name: `${item.fabric.collection.nameLoc} - ${item.fabric.variant.color.name}`,
          image: item.fabric.variant.image,
          description: `Ткань ${item.fabric.collection.nameLoc} цвет ${item.fabric.variant.color.name}`,
          sku: `fabric-${item.fabric.categorySlug}-${item.fabric.collectionSlug}-${item.fabric.variant.id}`,
          category: item.fabric.collection.technicalSpecifications.fabricType,
          additionalProperty: [
            {
              "@type": "PropertyValue",
              name: "Тип ткани",
              value: item.fabric.collection.technicalSpecifications.fabricType,
            },
            {
              "@type": "PropertyValue",
              name: "Состав",
              value:
                item.fabric.collection.technicalSpecifications.compositionLoc,
            },
            {
              "@type": "PropertyValue",
              name: "Износостойкость",
              value:
                item.fabric.collection.technicalSpecifications
                  .abrasionResistance,
            },
          ],
          offers: {
            "@type": "Offer",
            price: 0, // Цена ткани не указана в корзине
            priceCurrency: "BYN",
            availability: "https://schema.org/InStock",
            seller: {
              "@type": "Organization",
              name: "Dilavia",
              url: "https://dilavia.by",
            },
          },
        },
      })),
    ],
    ...(discount > 0 && {
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Скидка",
          value: `${Math.round(discount * 100)}%`,
        },
        {
          "@type": "PropertyValue",
          name: "Итоговая стоимость",
          value: `${totalWithDiscount} BYN`,
        },
      ],
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cartSchema) }}
    />
  );
}

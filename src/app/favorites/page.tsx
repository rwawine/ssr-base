"use client";

import React from "react";
import { useFavorites } from "@/hooks/FavoritesContext";
import Link from "next/link";
import { ProductCard } from "@/components/productCard/ProductCard";
import { FabricCard } from "@/components/fabric-card/FabricCard";
import styles from "./page.module.css";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";

export default function FavoritesPage() {
  const { items, fabricItems, clearFavorites } = useFavorites();

  // Фильтруем невалидные записи тканей
  const validFabricItems = fabricItems.filter(
    (item) =>
      item.fabric.categorySlug &&
      item.fabric.collectionSlug &&
      item.fabric.categorySlug !== "undefined" &&
      item.fabric.collectionSlug !== "undefined",
  );

  const totalItemsCount = items.length + validFabricItems.length;

  if (totalItemsCount === 0) {
    return (
      <div className={styles.container}>
        <Breadcrumbs
          items={[
            { label: "Главная", href: "https://dilavia.by/" },
            { label: "Избранное" },
          ]}
          className={styles.breadcrumbs}
        />
        <div className={styles.emptyFavoritesModern}>
          <h1 className={styles.emptyFavoritesTitle}>
            В избранном пока нет товаров
          </h1>
          <p className={styles.emptyFavoritesSubtitle}>
            Добавьте товары в избранное, чтобы сохранить их для покупки позже
          </p>
          <Link href="/catalog" className={styles.emptyFavoritesButton}>
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "https://dilavia.by/" },
          { label: "Избранное" },
        ]}
        className={styles.breadcrumbs}
      />
      <div className={styles.favoritesHeader}>
        <h1>Избранное</h1>
        <button
          onClick={clearFavorites}
          className={styles.clearFavorites}
          aria-label="Очистить избранное"
        >
          Очистить избранное
        </button>
      </div>

      <div className={styles.favoritesGrid}>
        {/* Товары */}
        {items.map((item) => (
          <ProductCard key={item.product.id} product={item.product} />
        ))}

        {/* Ткани */}
        {validFabricItems.map((item) => (
          <FabricCard
            key={`fabric-${item.fabric.categorySlug}-${item.fabric.collectionSlug}-${item.fabric.variant.id}`}
            collection={item.fabric.collection}
            materialSlug={item.fabric.collectionSlug}
            categorySlug={item.fabric.categorySlug}
            selectedVariantId={String(item.fabric.variant.id)}
          />
        ))}
      </div>
    </div>
  );
}

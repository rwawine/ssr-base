"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/CartContext";
import { useFavorites } from "@/hooks/FavoritesContext";
import HeartIcon from "@/components/header/icons/HeartIcon";
import CartIcon from "@/components/header/icons/CartIcon";
import { OptimizedImage } from "@/components/optimized-image/OptimizedImage";
import type { FabricCollection } from "@/types/fabric";
import styles from "./FabricCard.module.css";

interface FabricCardProps {
  collection: FabricCollection;
  materialSlug: string;
  categorySlug: string;
  selectedVariantId?: string;
}

export function FabricCard({
  collection,
  materialSlug,
  categorySlug,
  selectedVariantId,
}: FabricCardProps) {
  const initialVariant =
    collection.variants.find(
      (v) => String(v.id) === String(selectedVariantId),
    ) || collection.variants[0];
  const [selectedVariant, setSelectedVariant] = useState(initialVariant);
  const { addFabricToCart, fabricItems } = useCart();
  const {
    addFabricToFavorites,
    removeFabricFromFavorites,
    isFabricInFavorites,
  } = useFavorites();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isValidSlugs =
    categorySlug &&
    materialSlug &&
    categorySlug !== "undefined" &&
    materialSlug !== "undefined";

  const fabricKey = `fabric-${categorySlug}-${materialSlug}-${selectedVariant.id}`;
  const isInFavorites = isFabricInFavorites(fabricKey);
  const isInCart =
    fabricItems?.some(
      (item) =>
        `fabric-${item.fabric.categorySlug}-${item.fabric.collectionSlug}-${item.fabric.variant.id}` ===
        fabricKey,
    ) || false;

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInFavorites) {
      removeFabricFromFavorites(fabricKey);
    } else {
      addFabricToFavorites({
        collection: collection,
        variant: selectedVariant,
        categorySlug: categorySlug,
        collectionSlug: materialSlug,
      });
    }
  };

  const handleAddToCart = () => {
    if (!isInCart) {
      addFabricToCart(
        {
          collection: collection,
          variant: selectedVariant,
          categorySlug: categorySlug,
          collectionSlug: materialSlug,
        },
        1,
      );
    }
  };

  const detailsHref = isValidSlugs
    ? `/fabrics/${categorySlug}/${materialSlug}/${selectedVariant.id}`
    : "#";

  return (
    <div className={styles.card}>
      <Link href={detailsHref} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <OptimizedImage
            src={selectedVariant.image}
            alt={`${collection.nameLoc} - ${selectedVariant.color.name}`}
            width={400}
            height={300}
            className={styles.image}
            priority={false}
            quality={80}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <button
            className={
              isInFavorites
                ? `${styles.actionButton} ${styles.favoriteActive}`
                : styles.actionButton
            }
            style={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}
            onClick={handleFavoriteToggle}
            aria-label={isInFavorites ? "Убрать из избранного" : "В избранное"}
            tabIndex={0}
          >
            <HeartIcon />
          </button>
        </div>
      </Link>
      <div className={styles.cardContent}>
        <h3 className={styles.title}>
          <Link href={detailsHref}>{collection.nameLoc}</Link>
        </h3>
        <div className={styles.priceRow}>
          <span className={styles.price}></span>
        </div>
        <div className={styles.detailsRow}>
          <span className={styles.dimensions}>
            {selectedVariant.color.name}
          </span>
        </div>
        <div className={styles.optionGroup}>
          <span className={styles.optionLabel}>Варианты цветов:</span>
          <div className={styles.chicletContainer}>
            {collection.variants.slice(0, 4).map((variant) => (
              <button
                key={variant.id}
                className={
                  selectedVariant.id === variant.id
                    ? `${styles.chiclet} ${styles.chicletSelected}`
                    : styles.chiclet
                }
                onClick={() => setSelectedVariant(variant)}
                aria-label={`Выбрать цвет ${variant.color.name}`}
                type="button"
              >
                <OptimizedImage
                  src={variant.image}
                  alt={variant.color.name}
                  width={32}
                  height={32}
                  className={styles.image}
                />
              </button>
            ))}
            {collection.variants.length > 4 && (
              <span className={styles.moreVariants}>
                +{collection.variants.length - 4}
              </span>
            )}
          </div>
        </div>
        <div className={styles.actions}>
          <button
            className={
              isInCart
                ? `${styles.addToCartButton} ${styles.buttonInCart}`
                : styles.addToCartButton
            }
            onClick={handleAddToCart}
            disabled={isInCart}
            aria-label={isInCart ? "В корзине" : "В корзину"}
            type="button"
          >
            {isInCart ? "В корзине" : "В корзину"}
          </button>
          {isValidSlugs && (
            <Link href={detailsHref} className={styles.detailsLinks}>
              Подробнее о ткани
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

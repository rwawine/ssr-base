"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useCart } from "@/hooks/CartContext";
import { useFavorites } from "@/hooks/FavoritesContext";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import type { FabricCollection, FabricVariant } from "@/types/fabric";
import styles from "./page.module.css";
import { getFabricMaterialBySlug } from "@/lib/fabric-utils";

interface FabricDetailClientProps {
  collection: FabricCollection;
  currentVariant: FabricVariant;
  params: {
    category: string;
    collection: string;
    variantId: string;
  };
}

export function FabricDetailClient({
  collection,
  currentVariant,
  params,
}: FabricDetailClientProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    currentVariant.id.toString(),
  );
  const [quantity, setQuantity] = useState(1);
  const { addFabricToCart, fabricItems } = useCart();
  const {
    addFabricToFavorites,
    removeFabricFromFavorites,
    isFabricInFavorites,
  } = useFavorites();

  // Получаем текущий выбранный вариант
  const selectedVariant = useMemo(() => {
    return (
      collection.variants.find(
        (variant) => variant.id.toString() === selectedVariantId,
      ) || currentVariant
    );
  }, [selectedVariantId, collection.variants, currentVariant]);

  // Получаем название категории
  const material = getFabricMaterialBySlug(params.category);
  const categoryName = material?.nameLoc || params.category;

  // Формируем хлебные крошки
  const breadcrumbItems = useMemo(
    () => [
      { name: "Главная", url: "https://dilavia.by/" },
      { name: "Ткани", url: "https://dilavia.by/fabrics" },
      {
        name: categoryName,
        url: `https://dilavia.by/fabrics/${params.category}`,
      },
      {
        name: collection.nameLoc,
        url: `https://dilavia.by/fabrics/${params.category}/${params.collection}/${currentVariant.color.name}`,
      },
      { name: selectedVariant.color.name, url: "" },
    ],
    [
      categoryName,
      params.category,
      params.collection,
      collection.nameLoc,
      currentVariant.color.name,
      selectedVariant.color.name,
    ],
  );

  const fabricKey = `fabric-${params.category}-${params.collection}-${selectedVariant.id}`;
  const isInFavorites = isFabricInFavorites(fabricKey);
  const isInCart =
    fabricItems?.some(
      (item) =>
        `fabric-${item.fabric.categorySlug}-${item.fabric.collectionSlug}-${item.fabric.variant.id}` ===
        fabricKey,
    ) || false;

  const handleFavoriteToggle = () => {
    if (isInFavorites) {
      removeFabricFromFavorites(fabricKey);
    } else {
      addFabricToFavorites({
        collection: collection,
        variant: selectedVariant,
        categorySlug: params.category,
        collectionSlug: params.collection,
      });
    }
  };

  const handleAddToCart = () => {
    addFabricToCart(
      {
        collection: collection,
        variant: selectedVariant,
        categorySlug: params.category,
        collectionSlug: params.collection,
      },
      quantity,
    );
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className={styles.container}>
      <Breadcrumbs items={breadcrumbItems} />

      <div className={styles.content}>
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <Image
              src={selectedVariant.image}
              alt={`${collection.nameLoc} - ${selectedVariant.color.name}`}
              width={500}
              height={500}
              className={styles.image}
            />
          </div>

          <div className={styles.variants}>
            <h3>Варианты цветов:</h3>
            <div className={styles.variantsGrid}>
              {collection.variants.map((variant) => (
                <button
                  key={variant.id}
                  className={`${styles.variantButton} ${
                    selectedVariantId === variant.id.toString()
                      ? styles.variantActive
                      : ""
                  }`}
                  onClick={() => setSelectedVariantId(variant.id.toString())}
                >
                  <Image
                    src={variant.image}
                    alt={variant.color.name}
                    width={80}
                    height={80}
                    className={styles.variantImage}
                  />
                  <span className={styles.variantName}>
                    {variant.color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.header}>
            <h1 className={styles.title}>{collection.nameLoc}</h1>
            <p className={styles.colorName}>
              Цвет: {selectedVariant.color.name}
            </p>
          </div>

          <div className={styles.specifications}>
            <h2>Технические характеристики</h2>
            <div className={styles.specsGrid}>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Тип ткани:</span>
                <span className={styles.specValue}>
                  {collection.technicalSpecifications.fabricType}
                </span>
              </div>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Износостойкость:</span>
                <span className={styles.specValue}>
                  {collection.technicalSpecifications.abrasionResistance}
                </span>
              </div>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Состав:</span>
                <span className={styles.specValue}>
                  {collection.technicalSpecifications.compositionLoc}
                </span>
              </div>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Происхождение:</span>
                <span className={styles.specValue}>
                  {collection.technicalSpecifications.originLoc}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.application}>
            <h2>Области применения</h2>
            <div className={styles.applicationList}>
              {collection.technicalSpecifications.applicationAreas.map(
                (area) => (
                  <span key={area} className={styles.applicationItem}>
                    {area}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className={styles.care}>
            <h2>Рекомендации по уходу</h2>
            <ul className={styles.careList}>
              {collection.careInstructions.map((instruction, index) => (
                <li key={index} className={styles.careItem}>
                  {instruction}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.actions}>
            <div className={styles.actionButtons}>
              <button
                className={`${styles.actionButton} ${styles.favoriteButton} ${isInFavorites ? styles.favoriteActive : ""}`}
                onClick={handleFavoriteToggle}
              >
                {isInFavorites ? "В избранном" : "В избранное"}
              </button>

              <button
                className={`${styles.actionButton} ${styles.cartButton} ${isInCart ? styles.cartActive : ""}`}
                onClick={handleAddToCart}
              >
                {isInCart ? "В корзине" : "В корзину"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

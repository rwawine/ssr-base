"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, Dimension, AdditionalOption } from "@/types/product";
import { useCart } from "@/hooks/CartContext";
import { formatPrice } from "@/lib/utils";
import { OptimizedImage } from "@/components/optimized-image/OptimizedImage";
import { ProductSchema } from "@/components/schema";
import ProductOptions from "./ProductOptions";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

function ColorSwatch({ color }: { color: string }) {
  return <div className={styles.swatch} style={{ backgroundColor: color }} />;
}

function BestsellerBadge() {
  return (
    <div className={styles.bestsellerBadge}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
      </svg>
      <span className={styles.bestsellerBadgeText}>Лидер продаж</span>
    </div>
  );
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const {
    addToCart,
    isInCart,
    getItemQuantity,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  const dimensions: Dimension[] = Array.isArray(product?.dimensions)
    ? product.dimensions.filter(Boolean)
    : [];
  const [selectedDimension, setSelectedDimension] = useState<
    Dimension | undefined
  >(dimensions[0]);
  const [selectedAdditionalOptions, setSelectedAdditionalOptions] = useState<
    AdditionalOption[]
  >([]);

  // Проверка гидратации для предотвращения несоответствия SSR/CSR
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Надёжная обработка изображений для production
  /**
   * Возвращает корректный путь к главному изображению товара.
   * - Если путь относительный, добавляет '/'
   * - Если путь пустой или невалидный, возвращает заглушку
   * - Для production-готовых проектов можно расширить проверку (например, на https://)
   */
  const getMainImage = (images: string[] | undefined): string => {
    if (
      Array.isArray(images) &&
      images.length > 0 &&
      typeof images[0] === "string" &&
      images[0]
    ) {
      const src = images[0];
      if (src.startsWith("http://") || src.startsWith("https://")) return src;
      if (src.startsWith("/")) return src;
      return "/" + src;
    }
    return "/images/no-image.png";
  };

  const name = product?.name || "Без названия";
  const mainImage = getMainImage(product?.images);
  const slug = product?.slug || "";
  const isBestseller = (product?.popularity || 0) > 4.5;

  // Логирование для диагностики (можно убрать в production)
  useEffect(() => {
    if (!mainImage || mainImage === "/images/no-image.png") {
      // eslint-disable-next-line no-console
      console.warn(
        "[ProductCard] Product image missing or invalid:",
        product.name,
        product.images,
      );
    }
  }, [mainImage, product]);

  const basePrice = selectedDimension?.price ?? product.price?.current ?? 0;
  const additionalOptionsPrice = selectedAdditionalOptions.reduce(
    (sum, option) => sum + option.price,
    0,
  );
  const currentPrice = basePrice + additionalOptionsPrice;

  const hasAdditionalOptions = dimensions.some(
    (dim) => dim.additionalOptions && dim.additionalOptions.length > 0,
  );
  const shouldShowOptions = dimensions.length > 1 || hasAdditionalOptions;

  // Получаем количество товара в корзине только после гидратации
  const cartQuantity = isHydrated
    ? getItemQuantity(
        product.id,
        selectedDimension?.id,
        selectedAdditionalOptions,
      )
    : 0;
  const inCart = isHydrated && cartQuantity > 0;

  const handleDimensionSelect = (dimension: Dimension) => {
    setSelectedDimension(dimension);
    setSelectedAdditionalOptions([]);
  };

  const handleAdditionalOptionToggle = (option: AdditionalOption) => {
    setSelectedAdditionalOptions((prev) =>
      prev.some((o) => o.name === option.name)
        ? prev.filter((o) => o.name !== option.name)
        : [...prev, option],
    );
  };

  const handleAddToCart = () => {
    addToCart(product, 1, selectedDimension?.id, selectedAdditionalOptions);
  };

  const handleIncrease = () => {
    updateQuantity(
      product.id,
      cartQuantity + 1,
      selectedDimension?.id,
      selectedAdditionalOptions,
    );
  };

  const handleDecrease = () => {
    if (cartQuantity > 1) {
      updateQuantity(
        product.id,
        cartQuantity - 1,
        selectedDimension?.id,
        selectedAdditionalOptions,
      );
    } else {
      removeFromCart(
        product.id,
        selectedDimension?.id,
        selectedAdditionalOptions,
      );
    }
  };

  const formattedDimensions = selectedDimension
    ? `${selectedDimension.width}x${selectedDimension.length} см`
    : "";

  return (
    <div className={styles.card}>
      {/* Schema.org микроразметка для продукта */}
      <ProductSchema
        product={product}
        selectedDimension={selectedDimension}
        additionalOptionsPrice={additionalOptionsPrice}
      />

      <Link href={`/catalog/${slug}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <OptimizedImage
            src={mainImage}
            alt={`${name} - фото 1`}
            width={400}
            height={300}
            className={styles.image}
            quality={80}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {isBestseller && <BestsellerBadge />}
        </div>
      </Link>

      <div className={styles.cardContent}>
        <h3 className={styles.title}>
          <Link href={`/catalog/${slug}`}>{name}</Link>
        </h3>

        <div className={styles.priceRow}>
          <span className={styles.price}>от {formatPrice(currentPrice)}</span>
        </div>

        <div className={styles.detailsRow}>
          {formattedDimensions && (
            <span className={styles.dimensions}>{formattedDimensions}</span>
          )}
        </div>

        {shouldShowOptions && (
          <ProductOptions
            dimensions={dimensions}
            onDimensionSelect={handleDimensionSelect}
            selectedDimension={selectedDimension}
            onAdditionalOptionToggle={handleAdditionalOptionToggle}
            selectedAdditionalOptions={selectedAdditionalOptions}
          />
        )}

        <div className={styles.actions} suppressHydrationWarning>
          {!inCart ? (
            <button
              className={styles.addToCartButton}
              onClick={handleAddToCart}
            >
              В корзину
            </button>
          ) : (
            <div className={styles.inCartActions}>
              <button
                className={styles.inCartButton}
                onClick={() => router.push("/cart")}
              >
                В корзине {cartQuantity} шт.
              </button>
              <div className={styles.cartCounter}>
                <button
                  className={styles.counterBtn}
                  onClick={handleDecrease}
                  aria-label="Уменьшить количество"
                >
                  −
                </button>
                <span className={styles.counterValue}>{cartQuantity}</span>
                <button
                  className={styles.counterBtn}
                  onClick={handleIncrease}
                  aria-label="Увеличить количество"
                >
                  +
                </button>
              </div>
            </div>
          )}
          <Link href={`/catalog/${slug}`} className={styles.detailsLink}>
            Подробнее о товаре
          </Link>
        </div>
      </div>
    </div>
  );
}

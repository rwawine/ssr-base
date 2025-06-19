"use client";
import * as React from "react";
import styles from "./Hover.module.css";
import ProductImage from "./ProductImage";
import ImageSlider from "./ImageSlider";
import ProductInfo from "./ProductInfo";
import ProductOptions from "./ProductOptions";
import ProductActions from "./ProductActions";
import { Dimension } from "@/types/product";

interface HoverProps {
    productImage?: string;
    sliderBackground?: string;
    thumbnailImage?: string;
    arrowIcon?: string;
    title?: string;
    price?: string;
    sizes?: string[];
    mechanisms?: string[];
    sizeLabel?: string;
    optionLabel?: string;
    addToCartText?: string;
    moreDetailsText?: string;
    onAddToCart?: () => void;
    onMoreDetails?: () => void;
    categoryCode?: string;
    categoryName?: string;
    dimensions?: Dimension[];
}

function Hover({
    productImage = "https://cdn.builder.io/api/v1/image/assets/TEMP/e3ed17d8faac48acb9bf1ec6c110fe5baff6e3b6?placeholderIfAbsent=true&apiKey=8ecc9b849e4546de828de99f6cc412bf",
    sliderBackground = "https://cdn.builder.io/api/v1/image/assets/TEMP/0e7d4fe72ea644c3e2e2cd039d2c3603e78d6c4a?placeholderIfAbsent=true&apiKey=8ecc9b849e4546de828de99f6cc412bf",
    thumbnailImage = "https://cdn.builder.io/api/v1/image/assets/TEMP/30a3bc3eabbb8595de32805205b44d3800190c96?placeholderIfAbsent=true&apiKey=8ecc9b849e4546de828de99f6cc412bf",
    arrowIcon = "https://cdn.builder.io/api/v1/image/assets/TEMP/7c79ea5203a3e0804da2a6450c0a3ecc63457a06?placeholderIfAbsent=true&apiKey=8ecc9b849e4546de828de99f6cc412bf",
    title = "Кровать Нордик 140 Light",
    price = "19 990 ₽",
    sizes = [],
    mechanisms = [],
    sizeLabel = "Выбрать размер",
    optionLabel = "Выберите опцию",
    addToCartText = "В корзину",
    moreDetailsText = "Подробнее о товаре",
    onAddToCart,
    onMoreDetails,
    categoryCode,
    categoryName,
    dimensions
}: HoverProps) {
    // Определяем, является ли товар кроватью
    const isBed = (categoryCode && categoryCode.toLowerCase() === 'bed') ||
                  (categoryName && categoryName.toLowerCase().includes('кровать'));

    return (
        <article className={styles.productCard}>
            <ProductImage
                imageUrl={productImage}
                alt={title}
            />

            <ImageSlider
                backgroundImage={sliderBackground}
                thumbnailImage={thumbnailImage}
                alt={`${title} thumbnail`}
            />

            <div className={styles.contentSection}>
                <ProductInfo
                    title={title}
                    price={price}
                />

                {isBed && (
                  <ProductOptions
                    dimensions={dimensions}
                    sizeLabel={sizeLabel}
                  />    
                )}

                <ProductActions
                    addToCartText={addToCartText}
                    moreDetailsText={moreDetailsText}
                    onAddToCart={onAddToCart}
                    onMoreDetails={onMoreDetails}
                />
            </div>
        </article>
    );
}

export default Hover;

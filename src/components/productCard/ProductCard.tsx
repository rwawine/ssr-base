'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, Dimension, AdditionalOption } from '@/types/product';
import styles from './ProductCard.module.css';
import { useCart } from '@/hooks/CartContext';
import ProductOptions from './ProductOptions'; 

interface ProductCardProps {
    product: Product;
}

const ColorSwatch = ({ color }: { color: string }) => (
    <div className={styles.swatch} style={{ backgroundColor: color }} />
);

const BestsellerBadge = () => (
    <div className={styles.bestsellerBadge}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
        </svg>
        <span>Лидер продаж</span>
    </div>
);

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart, isInCart, getItemQuantity, updateQuantity, removeFromCart } = useCart();
    const router = useRouter();
    
    const dimensions: Dimension[] = Array.isArray(product?.dimensions) ? product.dimensions.filter(Boolean) : [];
    const [selectedDimension, setSelectedDimension] = useState<Dimension | undefined>(dimensions[0]);
    const [selectedAdditionalOptions, setSelectedAdditionalOptions] = useState<AdditionalOption[]>([]);
    
    const name = product?.name || 'Без названия';
    const images = product?.images?.length ? product.images.slice(0, 1) : ['/images/no-image.png'];
    const slug = product?.slug || '';
    const isBestseller = (product?.popularity || 0) > 4.5;
    
    const basePrice = selectedDimension?.price ?? product.price?.current ?? 0;
    const additionalOptionsPrice = selectedAdditionalOptions.reduce((sum, option) => sum + option.price, 0);
    const currentPrice = basePrice + additionalOptionsPrice;
    
    const hasAdditionalOptions = dimensions.some(dim => dim.additionalOptions && dim.additionalOptions.length > 0);
    const shouldShowOptions = dimensions.length > 1 || hasAdditionalOptions;

    // Получаем количество товара в корзине
    const cartQuantity = getItemQuantity(product.id, selectedDimension?.id, selectedAdditionalOptions);
    const inCart = cartQuantity > 0;

    const handleDimensionSelect = (dimension: Dimension) => {
        setSelectedDimension(dimension);
        setSelectedAdditionalOptions([]);
    };

    const handleAdditionalOptionToggle = (option: AdditionalOption) => {
        setSelectedAdditionalOptions(prev => 
            prev.some(o => o.name === option.name)
                ? prev.filter(o => o.name !== option.name)
                : [...prev, option]
        );
    };

    const handleAddToCart = () => {
        addToCart(product, 1, selectedDimension, selectedAdditionalOptions);
    };

    const handleIncrease = () => {
        updateQuantity(product.id, cartQuantity + 1, selectedDimension?.id, selectedAdditionalOptions);
    };

    const handleDecrease = () => {
        if (cartQuantity > 1) {
            updateQuantity(product.id, cartQuantity - 1, selectedDimension?.id, selectedAdditionalOptions);
        } else {
            removeFromCart(product.id, selectedDimension?.id, selectedAdditionalOptions);
        }
    };

    const formattedDimensions = selectedDimension ? `${selectedDimension.width}x${selectedDimension.length} см` : '';

    return (
        <div className={styles.card}>
            <Link 
                href={`/catalog/${slug}`} 
                className={styles.imageLink}
            >
                <div className={styles.imageWrapper}>
                    <img src={images[0]} alt={`${name} - фото 1`} className={styles.image} />
                    {isBestseller && <BestsellerBadge />}
                </div>
            </Link>

            <div className={styles.cardContent}>
                <h3 className={styles.title}>
                    <Link href={`/catalog/${slug}`}>{name}</Link>
                </h3>

                <div className={styles.priceRow}>
                    <span className={styles.price}>{currentPrice.toLocaleString('ru-RU')} BYN</span>
                </div>
                
                <div className={styles.detailsRow}>
                    {formattedDimensions && <span className={styles.dimensions}>{formattedDimensions}</span>}
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

                <div className={styles.actions}>
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
                                onClick={() => router.push('/cart')}
                            >
                                В корзине {cartQuantity} шт.
                            </button>
                            <div className={styles.cartCounter}>
                                <button className={styles.counterBtn} onClick={handleDecrease} aria-label="Уменьшить количество">−</button>
                                <span className={styles.counterValue}>{cartQuantity}</span>
                                <button className={styles.counterBtn} onClick={handleIncrease} aria-label="Увеличить количество">+</button>
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

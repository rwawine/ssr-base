import React from 'react';
import Link from 'next/link';
import { Product, Dimension } from '@/types/product';
import styles from './ProductCard.module.css';
import ProductOptions from './ProductOptions';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    // Безопасные значения
    const name = typeof product?.name === 'string' ? product.name : 'Без названия';
    const description = typeof product?.description === 'string' ? product.description : '';
    const images = Array.isArray(product?.images) && product.images.length > 0 ? product.images : ['/public/images/no-image.png'];
    const categoryCode = product?.category?.code || '';
    const slug = product?.slug || '';

    const isBed = categoryCode === 'bed' && (!name.toLowerCase().includes('детская') || name.toLowerCase().includes('кровать'));
    const isKidsBed = categoryCode === 'bed' && name.toLowerCase().includes('детская');
    const showBedOptions = isBed || isKidsBed;

    const dimensions: Dimension[] = Array.isArray(product?.dimensions) ? product.dimensions.filter(Boolean) : [];
    const minPrice = dimensions.length > 0 ? Math.min(...dimensions.map(d => d?.price ?? Infinity)) : (product?.price?.current ?? 0);
    const oldPrice = product?.price?.old ?? null;

    return (
        <div className={styles.card}>
            <Link href={`/catalog/${slug}`} tabIndex={-1} className={styles.imageWrapper} aria-label={`Подробнее о товаре ${name}`}>
                <img src={images[0]} alt={name} className={styles.image} />
            </Link>
            <div className={styles.info}>
                <Link href={`/catalog/${slug}`} className={styles.titleLink} aria-label={`Подробнее о товаре ${name}`}>
                    <h3 className={styles.title}>{name}</h3>
                </Link>
                {!showBedOptions && (
                    <div className={styles.priceRow}>
                        <span className={styles.price}>{minPrice} BYN</span>
                        {oldPrice && (
                            <span className={styles.oldPrice}>{oldPrice} BYN</span>
                        )}
                    </div>
                )}
                {showBedOptions && dimensions.length > 0 ? (
                    <ProductOptions dimensions={dimensions} />
                ) : showBedOptions && dimensions.length === 0 ? (
                    <div className={styles.options}>
                        <div className={styles.label}>Нет доступных размеров</div>
                    </div>
                ) : null}
                <button className={styles.button} type="button" tabIndex={-1} aria-disabled>В корзину</button>
                <Link href={`/catalog/${slug}`} className={styles.detailsButton} aria-label={`Подробнее о товаре ${name}`}>
                    Подробнее о товаре
                </Link>
            </div>
        </div>
    );
}

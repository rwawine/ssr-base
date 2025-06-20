'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product, Dimension } from '@/types/product';
import { useCart } from '@/hooks/CartContext';
import { useFavorites } from '@/hooks/FavoritesContext';
import ProductCard from '@/components/productCard/ProductCard';
import ProductOptions from '@/components/productCard/ProductOptions';
import styles from './ProductDetail.module.css';

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { isInFavorites, toggleFavorite } = useFavorites();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedDimension, setSelectedDimension] = useState<Dimension | undefined>(undefined);

  const images = Array.isArray(product?.images) && product.images.length > 0 ? product.images : ['/images/no-image.png'];
  const dimensions: Dimension[] = Array.isArray(product?.dimensions) ? product.dimensions.filter(Boolean) : [];
  const minPrice = dimensions.length > 0 ? Math.min(...dimensions.map(d => d?.price ?? Infinity)) : (product?.price?.current ?? 0);
  const oldPrice = product?.price?.old ?? null;

  const isBed = product?.category?.code === 'bed' && (!product.name.toLowerCase().includes('детская') || product.name.toLowerCase().includes('кровать'));
  const isKidsBed = product?.category?.code === 'bed' && product.name.toLowerCase().includes('детская');
  const showBedOptions = isBed || isKidsBed;

  // Проверяем, находится ли товар в корзине
  const inCart = isInCart(product.id, selectedDimension?.id);
  const cartQuantity = getItemQuantity(product.id, selectedDimension?.id);
  
  // Проверяем, находится ли товар в избранном
  const inFavorites = isInFavorites(product.id);

  // Обработчик добавления в корзину
  const handleAddToCart = () => {
    if (showBedOptions && dimensions.length > 0 && !selectedDimension) {
      alert('Пожалуйста, выберите размер кровати');
      return;
    }
    
    addToCart(product, 1, selectedDimension);
  };

  // Обработчик выбора размера
  const handleDimensionSelect = (dimension: Dimension) => {
    setSelectedDimension(dimension);
  };

  // Обработчик переключения избранного
  const handleToggleFavorite = () => {
    toggleFavorite(product);
  };

  return (
    <div className={styles.container}>
      {/* Хлебные крошки */}
      <nav className={styles.breadcrumbs}>
        <Link href="/">Главная</Link>
        <span> / </span>
        <Link href="/catalog">Каталог</Link>
        {product.category && (
          <>
            <span> / </span>
            <Link href={`/catalog?category=${product.category.code}`}>
              {product.category.name}
            </Link>
          </>
        )}
        <span> / </span>
        <span className={styles.currentPage}>{product.name}</span>
      </nav>

      <div className={styles.productSection}>
        {/* Галерея изображений */}
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <img 
              src={images[selectedImage]} 
              alt={product.name} 
              className={styles.mainImageImg}
            />
            <button
              type="button"
              className={`${styles.favoriteButton} ${inFavorites ? styles.favoriteButtonActive : ''}`}
              onClick={handleToggleFavorite}
              aria-label={inFavorites ? 'Удалить из избранного' : 'Добавить в избранное'}
            >
              ♥
            </button>
          </div>
          {images.length > 1 && (
            <div className={styles.thumbnails}>
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`${styles.thumbnail} ${selectedImage === index ? styles.thumbnailActive : ''}`}
                  onClick={() => setSelectedImage(index)}
                  aria-label={`Показать изображение ${index + 1}`}
                >
                  <img src={image} alt={`${product.name} - изображение ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Информация о товаре */}
        <div className={styles.productInfo}>
          <h1 className={styles.productTitle}>{product.name}</h1>
          
          {product.description && (
            <div className={styles.description}>
              <p>{product.description}</p>
            </div>
          )}

          {/* Цена */}
          {!showBedOptions && (
            <div className={styles.priceSection}>
              <div className={styles.priceRow}>
                <span className={styles.price}>{minPrice} BYN</span>
                {oldPrice && (
                  <span className={styles.oldPrice}>{oldPrice} BYN</span>
                )}
              </div>
            </div>
          )}

          {/* Опции для кроватей */}
          {showBedOptions && dimensions.length > 0 && (
            <div className={styles.optionsSection}>
              <h3>Выберите размер:</h3>
              <ProductOptions 
                dimensions={dimensions} 
                onDimensionSelect={handleDimensionSelect}
                selectedDimension={selectedDimension}
              />
              {selectedDimension && (
                <div className={styles.selectedPrice}>
                  <span className={styles.price}>{selectedDimension.price} BYN</span>
                </div>
              )}
            </div>
          )}

          {/* Кнопка добавления в корзину */}
          <div className={styles.actions}>
            <button 
              className={`${styles.addToCartButton} ${inCart ? styles.addToCartButtonActive : ''}`} 
              type="button" 
              onClick={handleAddToCart}
              disabled={showBedOptions && dimensions.length > 0 && !selectedDimension}
            >
              {inCart ? `В корзине (${cartQuantity})` : 'Добавить в корзину'}
            </button>
          </div>

          {/* Категория и подкатегория */}
          <div className={styles.categoryInfo}>
            {product.category && (
              <div className={styles.categoryItem}>
                <span className={styles.categoryLabel}>Категория:</span>
                <Link href={`/catalog?category=${product.category.code}`} className={styles.categoryLink}>
                  {product.category.name}
                </Link>
              </div>
            )}
            {product.subcategory && (
              <div className={styles.categoryItem}>
                <span className={styles.categoryLabel}>Подкатегория:</span>
                <Link href={`/catalog?subcategory=${product.subcategory.code}`} className={styles.categoryLink}>
                  {product.subcategory.name}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Связанные товары */}
      {relatedProducts.length > 0 && (
        <div className={styles.relatedProducts}>
          <h2>Похожие товары</h2>
          <div className={styles.relatedProductsGrid}>
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
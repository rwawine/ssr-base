import React from 'react';
import ProductCard from '@/components/productCard/ProductCard';
import { Product } from '@/types/product';
import styles from './PopularProduct.module.css';
import PopularProductSliderSSR from './PopularProductSliderSSR';

interface PopularProductProps {
  products: Product[];
  /**
   * Категория или массив категорий для фильтрации товаров. Например: "Диваны", "Кровати", ["Диваны", "Кровати"].
   * Если не указано — показываются все товары.
   */
  category?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  /**
   * Заголовок блока (по умолчанию "Популярные товары" или "Диваны в Минске")
   */
  title?: string;
  /**
   * Описание блока (по умолчанию стандартное)
   */
  description?: string;
}

export default function PopularProduct({ products, category, minPrice, maxPrice, minRating = 4.5, title, description }: PopularProductProps) {
  const filteredProducts = products.filter((product) => {
    let byCategory = true;
    if (category) {
      if (Array.isArray(category)) {
        byCategory = category.includes(product.category?.name || '');
      } else {
        byCategory = product.category?.name === category;
      }
    }
    const byMinPrice = minPrice !== undefined ? product.price.current >= minPrice : true;
    const byMaxPrice = maxPrice !== undefined ? product.price.current <= maxPrice : true;
    const byRating = minRating !== undefined ? product.popularity && product.popularity >= minRating : true;
    return byCategory && byMinPrice && byMaxPrice && byRating;
  });

  if (filteredProducts.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>{title || 'Популярные товары'}</h2>
          <p className={styles.emptyMessage}>Нет популярных товаров</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <PopularProductSliderSSR products={filteredProducts} title={title} description={description} />
      </div>
    </section>
  );
}

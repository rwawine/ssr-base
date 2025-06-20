import React from 'react';
import ProductCard from '@/components/productCard/ProductCard';
import { Product } from '@/types/product';
import styles from './PopularProduct.module.css';
import PopularProductSliderWrapper from './PopularProductSliderWrapper';

interface PopularProductProps {
  products: Product[];
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

export default function PopularProduct({ products, category, minPrice, maxPrice, minRating = 4.5 }: PopularProductProps) {
  const filteredProducts = products.filter((product) => {
    const byCategory = category ? product.category?.name === category : true;
    const byMinPrice = minPrice !== undefined ? product.price.current >= minPrice : true;
    const byMaxPrice = maxPrice !== undefined ? product.price.current <= maxPrice : true;
    const byRating = minRating !== undefined ? product.popularity && product.popularity >= minRating : true;
    return byCategory && byMinPrice && byMaxPrice && byRating;
  });

  if (filteredProducts.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>Популярные товары</h2>
          <p className={styles.emptyMessage}>Нет популярных товаров</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <PopularProductSliderWrapper products={filteredProducts} />
      </div>
    </section>
  );
}

import React from 'react';
import ProductCardHover from '@/components/productCard/ProductCardHover';
import { Product } from '@/types/product';
import styles from './PopularProduct.module.css';

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
    return <div>Нет популярных товаров</div>;
  }

  return (
    <div>
      <h2>Популярные товары</h2>
      <ul className={styles.popularProductList}>
        {filteredProducts.map((product) => (
          <li key={product.id}>
            <ProductCardHover product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}

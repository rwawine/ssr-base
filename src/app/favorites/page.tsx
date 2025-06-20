'use client';

import React from 'react';
import { useFavorites } from '@/hooks/FavoritesContext';
import Link from 'next/link';
import ProductCard from '@/components/productCard/ProductCard';
import styles from './page.module.css';

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();

  if (favorites.items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyFavorites}>
          <h1>Избранное пусто</h1>
          <p>Добавьте товары в избранное, чтобы сохранить их для покупки позже</p>
          <Link href="/catalog" className={styles.continueShopping}>
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.favoritesHeader}>
        <h1>Избранное</h1>
        <button 
          onClick={clearFavorites} 
          className={styles.clearFavorites}
          aria-label="Очистить избранное"
        >
          Очистить избранное
        </button>
      </div>

      <div className={styles.favoritesGrid}>
        {favorites.items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

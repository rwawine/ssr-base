'use client';

import React from 'react';
import { useFavorites } from '@/hooks/FavoritesContext';
import Link from 'next/link';
import ProductCard from '@/components/productCard/ProductCard';
import styles from './page.module.css';
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();

  if (favorites.items.length === 0) {
    return (
      <div className={styles.container}>
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: 'Избранное' }
          ]}
          className={styles.breadcrumbs}
        />
        <div className={styles.emptyFavoritesModern}>
          <h1 className={styles.emptyFavoritesTitle}>В избранном пока нет товаров</h1>
          <p className={styles.emptyFavoritesSubtitle}>
            Добавьте товары в избранное, чтобы сохранить их для покупки позже
          </p>
          <Link href="/catalog" className={styles.emptyFavoritesButton}>
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '/' },
          { label: 'Избранное' }
        ]}
        className={styles.breadcrumbs}
      />
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

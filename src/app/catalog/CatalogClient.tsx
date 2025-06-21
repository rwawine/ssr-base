'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ProductCard from '@/components/productCard/ProductCard';
import CatalogFilters, { FilterState } from '@/components/catalog/CatalogFilters';
import FilterToggle from '@/components/catalog/FilterToggle';
import { Product } from '@/types/product';
import styles from "./page.module.css";

interface CatalogClientProps {
  initialProducts: Product[];
  filteredProducts: Product[];
  currentFilters: FilterState;
}

export default function CatalogClient({ 
  initialProducts, 
  filteredProducts, 
  currentFilters 
}: CatalogClientProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Обновление URL при применении фильтров
  const handleApplyFilters = (newFilters: FilterState) => {
    const params = new URLSearchParams();
    
    // Категории
    if (newFilters.category && newFilters.category.length > 0) {
      newFilters.category.forEach(cat => params.append('category', cat));
    }
    // Подкатегории
    if (newFilters.subcategory && newFilters.subcategory.length > 0) {
      newFilters.subcategory.forEach(sub => params.append('subcategory', sub));
    }
    // Сортировка
    if (newFilters.sortBy && newFilters.sortBy !== 'name') {
      params.set('sort', newFilters.sortBy);
    }
    // Цена
    if (newFilters.priceRange) {
      params.set('minPrice', newFilters.priceRange[0].toString());
      params.set('maxPrice', newFilters.priceRange[1].toString());
    }

    router.push(`${pathname}?${params.toString()}`);
    setFiltersOpen(false);
  };

  // Кнопка «Сбросить фильтр»
  const handleResetFilters = () => {
    router.push(pathname); // Просто перезагружаем страницу без параметров
    setFiltersOpen(false);
  };

  const toggleFilters = () => setFiltersOpen(v => !v);

  // Подсчет активных фильтров (теперь проще)
  const activeFiltersCount = Object.values(currentFilters).filter(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) return true; // для priceRange
    if (typeof value === 'string') return value !== 'name'; // для sortBy
    return false;
  }).length;

  // Структурированные данные для SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Каталог мебели Dilavia",
    "description": "Широкий ассортимент мебели: кровати, диваны, кресла и многое другое",
    "numberOfItems": filteredProducts.length,
    "itemListElement": filteredProducts.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.images?.[0],
        "offers": {
          "@type": "Offer",
          "price": product.price?.current,
          "priceCurrency": "BYN",
          "availability": "https://schema.org/InStock"
        }
      }
    }))
  };

  return (
    <>
      {/* Структурированные данные для SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className={styles.container}>
        {/* Заголовок и кнопка фильтров */}
        <div className={styles.catalogHeader}>
          <div className={styles.catalogTitle}>
            <h1>Каталог товаров</h1>
            <p className={styles.catalogSubtitle}>
              Найдено товаров: {filteredProducts.length}
            </p>
          </div>
          <FilterToggle
            onToggle={toggleFilters}
            isOpen={filtersOpen}
            activeFiltersCount={activeFiltersCount}
          />
        </div>

        <div className={styles.catalogContent}>
          {/* Фильтры */}
          <CatalogFilters
            products={initialProducts}
            initialFilters={currentFilters}
            isOpen={filtersOpen}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
            onClose={() => setFiltersOpen(false)}
          />

          {/* Список товаров */}
          <div className={styles.productsSection}>
            {filteredProducts.length === 0 ? (
              <div className={styles.noResults}>
                <h3>Товары не найдены</h3>
                <p>Попробуйте изменить параметры фильтрации</p>
                <button 
                  onClick={handleResetFilters}
                  className={styles.resetFiltersButton}
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className={styles.productsGrid}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 
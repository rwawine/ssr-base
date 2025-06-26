"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ProductCard } from "@/components/productCard/ProductCard";
import CatalogFilters, {
  FilterState,
} from "@/components/catalog/CatalogFilters";
import FilterToggle from "@/components/catalog/FilterToggle";
import { Product } from "@/types/product";
import styles from "./page.module.css";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";

interface CatalogClientProps {
  initialProducts: Product[];
  filteredProducts: Product[];
  currentFilters: FilterState;
}

export default function CatalogClient({
  initialProducts,
  filteredProducts,
  currentFilters,
}: CatalogClientProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [sort, setSort] = useState<"new" | "cheap" | "expensive">("new");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Закрытие дропдауна по клику вне
  useEffect(() => {
    if (!sortDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [sortDropdownOpen]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 801);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sortOptions = [
    { value: "new", label: "по новизне" },
    { value: "cheap", label: "сначала дешевле" },
    { value: "expensive", label: "сначала дороже" },
  ];

  // Обновление URL при применении фильтров
  const handleApplyFilters = (newFilters: FilterState) => {
    const params = new URLSearchParams();

    // Категории
    if (newFilters.category && newFilters.category.length > 0) {
      newFilters.category.forEach((cat) => params.append("category", cat));
    }
    // Подкатегории
    if (newFilters.subcategory && newFilters.subcategory.length > 0) {
      newFilters.subcategory.forEach((sub) =>
        params.append("subcategory", sub),
      );
    }
    // Сортировка
    if (newFilters.sortBy && newFilters.sortBy !== "name") {
      params.set("sort", newFilters.sortBy);
    }
    // Цена
    if (newFilters.priceRange) {
      params.set("minPrice", newFilters.priceRange[0].toString());
      params.set("maxPrice", newFilters.priceRange[1].toString());
    }

    router.push(`${pathname}?${params.toString()}`);
    setFiltersOpen(false);
  };

  // Кнопка «Сбросить фильтр»
  const handleResetFilters = () => {
    router.push(pathname); // Просто перезагружаем страницу без параметров
    setFiltersOpen(false);
  };

  const toggleFilters = () => setFiltersOpen((v) => !v);

  // Подсчет активных фильтров (теперь проще)
  const activeFiltersCount = Object.values(currentFilters).filter((value) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object" && value !== null) return true; // для priceRange
    if (typeof value === "string") return value !== "name"; // для sortBy
    return false;
  }).length;

  // Сортировка товаров
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "cheap")
      return (a.price?.current || 0) - (b.price?.current || 0);
    if (sort === "expensive")
      return (b.price?.current || 0) - (a.price?.current || 0);
    // По новизне (id по убыванию, если id — число)
    return (Number(b.id) || 0) - (Number(a.id) || 0);
  });

  // Структурированные данные для SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Каталог мебели Dilavia",
    description:
      "Широкий ассортимент мебели: кровати, диваны, кресла и многое другое",
    numberOfItems: filteredProducts.length,
    itemListElement: filteredProducts.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.images?.[0],
        offers: {
          "@type": "Offer",
          price: product.price?.current,
          priceCurrency: "BYN",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };

  return (
    <>
      {/* Структурированные данные для SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className={styles.container}>
        {/* Хлебные крошки */}
        <Breadcrumbs
          items={[
            { label: "Главная", href: "https://dilavia.by/" },
            { label: "Каталог" },
          ]}
        />
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

        {/* Сортировка */}
        <div className={styles.sortRow}>
          <span className={styles.sortLabel + " " + styles.sortDesktop}>
            Отсортировать товары:
          </span>
          {!isMobile && (
            <div className={styles.sortDesktop}>
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  className={sort === opt.value ? styles.sortActive : styles.sortBtn}
                  onClick={() => setSort(opt.value as any)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
          {isMobile && (
            <div className={styles.sortMobile}>
              <select
                className={styles.sortMobileSelect}
                value={sort}
                onChange={e => setSort(e.target.value as any)}
                aria-label="Сортировка товаров"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}
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
            {sortedProducts.length === 0 ? (
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
                {sortedProducts.map((product, idx) => (
                  <ProductCard key={product.id} product={product} priority={idx === 0} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

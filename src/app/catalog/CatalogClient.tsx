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
  initialSort: "new" | "cheap" | "expensive";
  categoryName?: string;
  subcategoryName?: string;
}

export default function CatalogClient({
  initialProducts,
  filteredProducts,
  currentFilters,
  initialSort,
  categoryName,
  subcategoryName,
}: CatalogClientProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [sort, setSort] = useState<"new" | "cheap" | "expensive">(initialSort);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Устанавливаем isHydrated в true после монтирования
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Определение мобильного устройства
  useEffect(() => {
    if (!isHydrated) return;

    const checkMobile = () => setIsMobile(window.innerWidth <= 801);
    checkMobile();
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 801);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isHydrated]);

  // Инициализация сортировки из URL или sessionStorage
  useEffect(() => {
    if (!isHydrated) return;

    const urlParams = new URLSearchParams(window.location.search);
    const urlSort = urlParams.get("sort");

    if (
      urlSort &&
      (urlSort === "new" || urlSort === "cheap" || urlSort === "expensive")
    ) {
      sessionStorage.setItem("catalogSort", urlSort);
      setSort(urlSort as "new" | "cheap" | "expensive");
    } else {
      const savedSort = sessionStorage.getItem("catalogSort");
      if (
        savedSort &&
        (savedSort === "new" ||
          savedSort === "cheap" ||
          savedSort === "expensive")
      ) {
        setSort(savedSort as "new" | "cheap" | "expensive");
      }
    }
  }, [isHydrated]);

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
    // Сортировка (всегда добавляем)
    const sortToUse = sort || sessionStorage.getItem("catalogSort") || "new";
    params.set("sort", sortToUse);
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
    // При сбросе фильтров возвращаем только сортировку
    const params = new URLSearchParams();
    const sortToUse = sort || sessionStorage.getItem("catalogSort") || "new";
    params.set("sort", sortToUse);
    router.push(`${pathname}?${params.toString()}`);
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

  // sortedProducts теперь сортируется на клиенте
  const sortedProducts = React.useMemo(() => {
    if (sort === "cheap") {
      return [...filteredProducts].sort(
        (a, b) => (a.price?.current || 0) - (b.price?.current || 0),
      );
    }
    if (sort === "expensive") {
      return [...filteredProducts].sort(
        (a, b) => (b.price?.current || 0) - (a.price?.current || 0),
      );
    }
    // "new" или дефолт
    return filteredProducts;
  }, [filteredProducts, sort]);

  const handleSortChange = (newSort: string) => {
    if (!isHydrated) return;

    // Проверяем, что newSort является валидным значением
    if (newSort === "new" || newSort === "cheap" || newSort === "expensive") {
      setSort(newSort as "new" | "cheap" | "expensive");
      sessionStorage.setItem("catalogSort", newSort);

      const url = new URL(window.location.href);
      url.searchParams.set("sort", newSort);
      window.history.pushState({}, "", url.toString());
    }
  };

  return (
    <div className={styles.container}>
      {/* Хлебные крошки */}
      <Breadcrumbs
        items={[
          { label: "Главная", href: "https://dilavia.by/" },
          { label: "Каталог", href: "https://dilavia.by/catalog" },
          ...(categoryName
            ? [
                {
                  label: categoryName,
                  href: `https://dilavia.by/catalog?category=${currentFilters.category?.[0] || ""}`,
                },
              ]
            : []),
          ...(subcategoryName
            ? [
                {
                  label: subcategoryName,
                },
              ]
            : []),
        ]}
      />
      {/* Заголовок и кнопка фильтров */}
      <div className={styles.catalogHeader}>
        <div className={styles.catalogTitle}>
          <h1>
            {subcategoryName
              ? `${subcategoryName} - ${categoryName || "Каталог"}`
              : categoryName
                ? categoryName
                : "Каталог товаров"}
          </h1>
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
        <span className={`${styles.sortLabel} ${styles.sortDesktop}`}>
          Отсортировать товары:
        </span>
        {!isMobile && (
          <div className={styles.sortDesktop}>
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                className={
                  sort === opt.value ? styles.sortActive : styles.sortBtn
                }
                onClick={() => handleSortChange(opt.value as any)}
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
              onChange={(e) => handleSortChange(e.target.value as any)}
              aria-label="Сортировка товаров"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
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
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={idx === 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

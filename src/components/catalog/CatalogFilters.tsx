'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import styles from './CatalogFilters.module.css';

interface CatalogFiltersProps {
  products: Product[];
  selectedCategory?: string[];
  selectedSubcategory?: string[];
  initialFilters: FilterState;
  isOpen: boolean;
  onApply: (filters: FilterState) => void;
  onReset: () => void;
  onClose: () => void;
}

export interface FilterState {
  category?: string[];
  subcategory?: string[];
  priceRange?: [number, number];
  sortBy?: 'name' | 'price-asc' | 'price-desc' | 'popularity';
}

interface CategoryData {
  code: string;
  name: string;
  subcategories: { code: string; name: string; count: number }[];
  count: number;
}

export default function CatalogFilters({
  products,
  selectedCategory,
  selectedSubcategory,
  initialFilters,
  isOpen,
  onApply,
  onReset,
  onClose
}: CatalogFiltersProps) {
  // Локальное состояние для фильтров (применяются только по кнопке)
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  // Генерируем уникальные категории и подкатегории из данных
  const categories = React.useMemo(() => {
    const categoryMap = new Map<string, CategoryData>();
    products.forEach(product => {
      if (!product.category) return;
      const categoryCode = product.category.code;
      const subcategoryCode = product.subcategory?.code || 'default';
      const subcategoryName = product.subcategory?.name || 'Без подкатегории';
      if (!categoryMap.has(categoryCode)) {
        categoryMap.set(categoryCode, {
          code: categoryCode,
          name: product.category.name,
          subcategories: [],
          count: 0
        });
      }
      const category = categoryMap.get(categoryCode)!;
      category.count++;
      const existingSubcategory = category.subcategories.find(sub => sub.code === subcategoryCode);
      if (existingSubcategory) {
        existingSubcategory.count++;
      } else {
        category.subcategories.push({
          code: subcategoryCode,
          name: subcategoryName,
          count: 1
        });
      }
    });
    return Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);
  }, [products]);

  // Находим минимальную и максимальную цены
  const priceRangeData = React.useMemo((): [number, number] => {
    const prices = products
      .map(p => p.price?.current || 0)
      .filter(price => price > 0);
    if (prices.length === 0) return [0, 10000];
    return [Math.min(...prices), Math.max(...prices)];
  }, [products]);

  // Синхронизируем локальное состояние с initialFilters при открытии
  useEffect(() => {
    setFilters(initialFilters);
    setPriceRange(initialFilters.priceRange || priceRangeData);
  }, [initialFilters, priceRangeData, isOpen]);

  // --- Handlers ---
  // Множественный выбор категорий
  const handleCategoryChange = (categoryCode: string) => {
    setFilters(f => {
      const arr = f.category || [];
      const exists = arr.includes(categoryCode);
      return {
        ...f,
        category: exists ? arr.filter(c => c !== categoryCode) : [...arr, categoryCode],
        // Если убираем категорию, сбрасываем подкатегории этой категории
        subcategory: f.subcategory?.filter(sub => {
          const cat = categories.find(c => c.code === categoryCode);
          return !cat?.subcategories.some(s => s.code === sub);
        })
      };
    });
  };
  // Множественный выбор подкатегорий
  const handleSubcategoryChange = (subcategoryCode: string) => {
    setFilters(f => {
      const arr = f.subcategory || [];
      const exists = arr.includes(subcategoryCode);
      return {
        ...f,
        subcategory: exists ? arr.filter(s => s !== subcategoryCode) : [...arr, subcategoryCode]
      };
    });
  };
  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    setFilters(f => ({ ...f, sortBy }));
  };
  // Ползунок стоимости с валидацией
  const handlePriceInput = (idx: 0 | 1, value: number) => {
    let [min, max] = priceRange;
    if (idx === 0) {
      min = Math.max(priceRangeData[0], Math.min(value, max));
    } else {
      max = Math.min(priceRangeData[1], Math.max(value, min));
    }
    setPriceRange([min, max]);
    setFilters(f => ({ ...f, priceRange: [min, max] }));
  };
  const handlePriceSlider = (idx: 0 | 1, value: number) => {
    let [min, max] = priceRange;
    if (idx === 0) {
      min = Math.min(value, max - 1);
    } else {
      max = Math.max(value, min + 1);
    }
    setPriceRange([min, max]);
    setFilters(f => ({ ...f, priceRange: [min, max] }));
  };
  const clearFilters = () => {
    setFilters({ sortBy: 'name' });
    setPriceRange(priceRangeData);
    onReset();
  };
  const handleApply = () => {
    onApply({ ...filters, priceRange });
    onClose();
  };

  // Для отображения только подкатегорий выбранных категорий
  const selectedCategoryData = categories.filter(cat => (filters.category || []).includes(cat.code));

  // --- Render ---
  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <h3>Фильтры</h3>
          <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть фильтры">×</button>
        </div>
        <div className={styles.drawerContent}>
          <div className={styles.clearFilters}>
            <button onClick={clearFilters} className={styles.clearButton}>
              Сбросить фильтр
            </button>
          </div>
          <div className={styles.filterSection}>
            <h4>Сортировка</h4>
            <div className={styles.sortOptions}>
              <label className={styles.radioLabel}>
                <input type="radio" name="sort" value="name" checked={filters.sortBy === 'name'} onChange={() => handleSortChange('name')} />
                <span>По названию</span>
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" name="sort" value="price-asc" checked={filters.sortBy === 'price-asc'} onChange={() => handleSortChange('price-asc')} />
                <span>По цене (возрастание)</span>
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" name="sort" value="price-desc" checked={filters.sortBy === 'price-desc'} onChange={() => handleSortChange('price-desc')} />
                <span>По цене (убывание)</span>
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" name="sort" value="popularity" checked={filters.sortBy === 'popularity'} onChange={() => handleSortChange('popularity')} />
                <span>По популярности</span>
              </label>
            </div>
          </div>
          <div className={styles.filterSection}>
            <h4>Категории</h4>
            <div className={styles.categoryList}>
              {categories.map(category => (
                <div key={category.code} className={styles.categoryItem}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" checked={(filters.category || []).includes(category.code)} onChange={() => handleCategoryChange(category.code)} />
                    <span className={styles.checkboxCustom}></span>
                    <span className={styles.categoryName}>{category.name}</span>
                    <span className={styles.categoryCount}>({category.count})</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          {selectedCategoryData.length > 0 && selectedCategoryData.some(cat => cat.subcategories.length > 0) && (
            <div className={styles.filterSection}>
              <h4>Подкатегории</h4>
              <div className={styles.subcategoryList}>
                {selectedCategoryData.flatMap(cat => cat.subcategories).map(subcategory => (
                  <div key={subcategory.code} className={styles.subcategoryItem}>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" checked={(filters.subcategory || []).includes(subcategory.code)} onChange={() => handleSubcategoryChange(subcategory.code)} />
                      <span className={styles.checkboxCustom}></span>
                      <span className={styles.subcategoryName}>{subcategory.name}</span>
                      <span className={styles.subcategoryCount}>({subcategory.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className={styles.filterSection}>
            <h4>Цена</h4>
            <div className={styles.priceRange}>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={e => handlePriceInput(0, Number(e.target.value))}
                  placeholder="От"
                  min={priceRangeData[0]}
                  max={priceRange[1]}
                />
                <span>-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={e => handlePriceInput(1, Number(e.target.value))}
                  placeholder="До"
                  min={priceRange[0]}
                  max={priceRangeData[1]}
                />
              </div>
              <div className={styles.priceSlider}>
                <input
                  type="range"
                  min={priceRangeData[0]}
                  max={priceRangeData[1]}
                  value={priceRange[0]}
                  onChange={e => handlePriceSlider(0, Number(e.target.value))}
                  className={styles.rangeSlider}
                  style={{ zIndex: priceRange[0] === priceRangeData[1] ? 5 : 3 }}
                />
                <input
                  type="range"
                  min={priceRangeData[0]}
                  max={priceRangeData[1]}
                  value={priceRange[1]}
                  onChange={e => handlePriceSlider(1, Number(e.target.value))}
                  className={styles.rangeSlider}
                  style={{ zIndex: 4 }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.drawerFooter}>
          <button className={styles.applyButton} onClick={handleApply}>
            Применить
          </button>
        </div>
      </div>
    </>
  );
} 
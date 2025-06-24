'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import styles from './CatalogFilters.module.css';

interface CatalogFiltersProps {
  products: Product[];
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

// Иконки для секций
const SortIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18H7V16H3V18ZM3 6V8H21V6H3ZM3 13H15V11H3V13Z" fill="currentColor"/>
  </svg>
);

const CategoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4H4C2.89 4 2 4.89 2 6V18C2 19.11 2.89 20 4 20H10V4M12 4V20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4H12Z" fill="currentColor"/>
  </svg>
);

const PriceIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9Z" fill="currentColor"/>
  </svg>
);

const ResetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V1L7 6L12 11V7C15.31 7 18 9.69 18 13C18 16.31 15.31 19 12 19C8.69 19 6 16.31 6 13H4C4 17.42 7.58 21 12 21C16.42 21 20 17.42 20 13C20 8.58 16.42 5 12 5Z" fill="currentColor"/>
  </svg>
);

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg 
    className={`${styles.chevronIcon} ${isOpen ? styles.chevronOpen : ''}`} 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClearIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function CatalogFilters({
  products,
  initialFilters,
  isOpen,
  onApply,
  onReset,
  onClose
}: CatalogFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters.priceRange || [0, 10000]);
  const [openSections, setOpenSections] = useState<string[]>(['price', 'category']);

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

  const priceRangeData = React.useMemo((): [number, number] => {
    const prices = products
      .map(p => p.price?.current || 0)
      .filter(price => price > 0);
    if (prices.length === 0) return [0, 10000];
    return [Math.floor(Math.min(...prices) / 100) * 100, Math.ceil(Math.max(...prices) / 100) * 100];
  }, [products]);

  useEffect(() => {
    setFilters(initialFilters);
    setPriceRange(initialFilters.priceRange || priceRangeData);
  }, [initialFilters, priceRangeData, isOpen]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const handleCategoryChange = (categoryCode: string) => {
    setFilters(f => {
      const currentCategories = f.category || [];
      const isRemoving = currentCategories.includes(categoryCode);
      const newCategories = isRemoving
        ? currentCategories.filter(c => c !== categoryCode)
        : [...currentCategories, categoryCode];

      let newSubcategories = f.subcategory || [];
      if (isRemoving) {
        // Если снимаем галочку с категории, удаляем только её подкатегории
        const subcategoriesToRemove = categories
          .find(c => c.code === categoryCode)
          ?.subcategories.map(s => s.code) || [];
        
        newSubcategories = newSubcategories.filter(sub => !subcategoriesToRemove.includes(sub));
      }

      return {
        ...f,
        category: newCategories,
        subcategory: newSubcategories,
      };
    });
  };

  const handleSubcategoryChange = (subcategoryCode: string) => {
    setFilters(f => {
      const currentSubcategories = f.subcategory || [];
      const isAdding = !currentSubcategories.includes(subcategoryCode);
      
      const newSubcategories = isAdding
        ? [...currentSubcategories, subcategoryCode]
        : currentSubcategories.filter(s => s !== subcategoryCode);

      // При выборе подкатегории, её родительская категория также должна быть выбрана.
      const currentCategories = f.category || [];
      let newCategories = [...currentCategories];

      if (isAdding) {
        const parentCategory = categories.find(cat => 
          cat.subcategories.some(sub => sub.code === subcategoryCode)
        );
        if (parentCategory && !newCategories.includes(parentCategory.code)) {
          newCategories.push(parentCategory.code);
        }
      }

      return {
        ...f,
        category: newCategories,
        subcategory: newSubcategories,
      };
    });
  };
  
  const handlePriceInput = (idx: 0 | 1, value: string) => {
    const numValue = parseInt(value.replace(/\s/g, ''), 10);
    if (isNaN(numValue)) return;

    let [min, max] = priceRange;
    if (idx === 0) {
      min = Math.max(priceRangeData[0], Math.min(numValue, max));
    } else {
      max = Math.min(priceRangeData[1], Math.max(numValue, min));
    }
    setPriceRange([min, max]);
  };

  const handlePriceSlider = (idx: 0 | 1, value: number) => {
    let [min, max] = priceRange;
    if (idx === 0) {
      min = Math.min(value, max - 1);
    } else {
      max = Math.max(value, min + 1);
    }
    setPriceRange([min, max]);
  };
  
  const handleApply = () => {
    onApply({ ...filters, priceRange });
    onClose();
  };

  const handleReset = () => {
    setFilters({ sortBy: 'name' });
    setPriceRange(priceRangeData);
    onReset();
  };

  const getPercent = (value: number) => {
    const [min, max] = priceRangeData;
    if (max === min) return 0;
    return Math.round(((value - min) / (max - min)) * 100);
  };

  const minPercent = getPercent(priceRange[0]);
  const maxPercent = getPercent(priceRange[1]);

  const selectedCategoryData = categories.filter(cat => (filters.category || []).includes(cat.code));
  const showSubcategorySection = selectedCategoryData.some(cat => cat.subcategories.length > 1);

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        
        <div className={styles.drawerContent}>
          {/* Section: Price */}
          <div className={styles.filterSection}>
            <div className={styles.sectionHeader} onClick={() => toggleSection('price')}>
              <span>Цена, BYN</span>
              <ChevronIcon isOpen={openSections.includes('price')} />
            </div>
            {openSections.includes('price') && (
              <div className={styles.sectionContent}>
                <div className={styles.priceInputs}>
                  <label>
                    <span>от</span>
                    <input
                      type="text"
                      value={priceRange[0].toLocaleString('ru-RU')}
                      onChange={e => handlePriceInput(0, e.target.value)}
                    />
                  </label>
                  <label>
                    <span>до</span>
                    <input
                      type="text"
                      value={priceRange[1].toLocaleString('ru-RU')}
                      onChange={e => handlePriceInput(1, e.target.value)}
                    />
                  </label>
                </div>
                <div className={styles.priceSlider}>
                  <div className={styles.sliderTrack} />
                  <div className={styles.sliderRange} style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }} />
                  <input type="range" min={priceRangeData[0]} max={priceRangeData[1]} value={priceRange[0]} onChange={e => handlePriceSlider(0, Number(e.target.value))} className={styles.rangeSlider} />
                  <input type="range" min={priceRangeData[0]} max={priceRangeData[1]} value={priceRange[1]} onChange={e => handlePriceSlider(1, Number(e.target.value))} className={styles.rangeSlider} />
                </div>
              </div>
            )}
          </div>

          {/* Section: Categories */}
          <div className={styles.filterSection}>
            <div className={styles.sectionHeader} onClick={() => toggleSection('category')}>
              <span>Категории</span>
              <ChevronIcon isOpen={openSections.includes('category')} />
            </div>
            {openSections.includes('category') && (
              <div className={styles.sectionContent}>
                <div className={styles.checkboxList}>
                  {categories.map(category => (
                    <label key={category.code} className={styles.checkboxLabel}>
                      <input type="checkbox" checked={(filters.category || []).includes(category.code)} onChange={() => handleCategoryChange(category.code)} />
                      <span className={styles.checkboxCustom}></span>
                      <span>{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Section: Subcategories */}
          {showSubcategorySection && (
            <div className={styles.filterSection}>
              <div className={styles.sectionHeader} onClick={() => toggleSection('subcategory')}>
                <span>Подкатегории</span>
                <ChevronIcon isOpen={openSections.includes('subcategory')} />
              </div>
              {openSections.includes('subcategory') && (
                <div className={styles.sectionContent}>
                  <div className={styles.checkboxList}>
                    {selectedCategoryData
                      .filter(cat => cat.subcategories.length > 1)
                      .flatMap(cat => cat.subcategories)
                      .map(subcategory => (
                        <label key={subcategory.code} className={styles.checkboxLabel}>
                          <input type="checkbox" checked={(filters.subcategory || []).includes(subcategory.code)} onChange={() => handleSubcategoryChange(subcategory.code)} />
                          <span className={styles.checkboxCustom}></span>
                          <span>{subcategory.name}</span>
                        </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.drawerFooter}>
          <button className={styles.applyButton} onClick={handleApply}>
            Применить
          </button>
          <button className={styles.clearButton} onClick={handleReset}>
            <span>Очистить фильтры</span>
            <ClearIcon />
          </button>
        </div>
      </div>
    </>
  );
} 
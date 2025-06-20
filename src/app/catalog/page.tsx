import React from 'react';
import { Suspense } from 'react';
import CatalogClient from './CatalogClient';
import { Product } from '@/types/product';
import { Metadata } from 'next';

// Серверная функция для загрузки данных
function getProductsFromFile(): Product[] {
  const data = require('@/data/data.json');
  return data[0].products;
}

// Серверная функция для фильтрации товаров
function filterProducts(products: Product[], searchParams: { [key: string]: string | string[] | undefined }): Product[] {
  let filtered = [...products];

  // Фильтрация по категории
  const category = searchParams.category;
  if (category) {
    const categories = Array.isArray(category) ? category : [category];
    filtered = filtered.filter(product =>
      product.category?.code && categories.includes(product.category.code)
    );
  }

  // Фильтрация по подкатегории
  const subcategory = searchParams.subcategory;
  if (subcategory) {
    const subcategories = Array.isArray(subcategory) ? subcategory : [subcategory];
    filtered = filtered.filter(product =>
      product.subcategory?.code && subcategories.includes(product.subcategory.code)
    );
  }

  // Сортировка
  const sortBy = searchParams.sort as string;
  switch (sortBy) {
    case 'price-asc':
      filtered.sort((a, b) => (a.price?.current || 0) - (b.price?.current || 0));
      break;
    case 'price-desc':
      filtered.sort((a, b) => (b.price?.current || 0) - (a.price?.current || 0));
      break;
    case 'popularity':
      filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      break;
    case 'name':
    default:
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return filtered;
}

// Генерация метаданных
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const products = getProductsFromFile();
  const filteredProducts = filterProducts(products, resolvedSearchParams);
  
  const category = resolvedSearchParams.category;
  const subcategory = resolvedSearchParams.subcategory;
  
  let title = 'Каталог товаров | Dilavia';
  let description = 'Широкий ассортимент мебели: кровати, диваны, кресла и многое другое. Доставка по всей Беларуси.';
  
  if (category) {
    const categoryName = Array.isArray(category) ? category[0] : category;
    const categoryProduct = products.find(p => p.category?.code === categoryName);
    if (categoryProduct?.category?.name) {
      title = `${categoryProduct.category.name} | Dilavia`;
      description = `Купить ${categoryProduct.category.name.toLowerCase()} в интернет-магазине Dilavia. Доставка по всей Беларуси.`;
    }
  }
  
  if (subcategory) {
    const subcategoryName = Array.isArray(subcategory) ? subcategory[0] : subcategory;
    const subcategoryProduct = products.find(p => p.subcategory?.code === subcategoryName);
    if (subcategoryProduct?.subcategory?.name) {
      title = `${subcategoryProduct.subcategory.name} | Dilavia`;
      description = `Купить ${subcategoryProduct.subcategory.name.toLowerCase()} в интернет-магазине Dilavia. Доставка по всей Беларуси.`;
    }
  }

  return {
    title,
    description,
    keywords: 'мебель, кровати, диваны, кресла, купить мебель, доставка',
    openGraph: {
      title,
      description,
      url: 'https://dilavia.by/catalog',
      type: 'website',
      locale: 'ru_RU',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Компонент загрузки
function CatalogLoading() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '400px',
      fontSize: '18px',
      color: '#666'
    }}>
      Загрузка каталога...
    </div>
  );
}

// Серверный компонент
export default async function CatalogPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  // Загружаем и фильтруем данные на сервере
  const resolvedSearchParams = await searchParams;
  const allProducts = getProductsFromFile();
  const filteredProducts = filterProducts(allProducts, resolvedSearchParams);
  
  // Извлекаем текущие фильтры из URL
  const currentFilters = {
    category: resolvedSearchParams.category ? (Array.isArray(resolvedSearchParams.category) ? resolvedSearchParams.category : [resolvedSearchParams.category]) : undefined,
    subcategory: resolvedSearchParams.subcategory ? (Array.isArray(resolvedSearchParams.subcategory) ? resolvedSearchParams.subcategory : [resolvedSearchParams.subcategory]) : undefined,
    sortBy: (resolvedSearchParams.sort as string) || 'name',
  };

  return (
    <Suspense fallback={<CatalogLoading />}>
      <CatalogClient 
        initialProducts={allProducts}
        filteredProducts={filteredProducts}
        currentFilters={currentFilters}
      />
    </Suspense>
  );
}

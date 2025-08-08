import React from "react";
import CatalogClient from "./CatalogClient";
import { Product } from "@/types/product";
import { Metadata } from "next";
import { FilterState } from "@/components/catalog/CatalogFilters";
import { generatePageMetadata } from "@/lib/metadata";
import filterConfigRaw from "@/data/filterConfig.json";

type FilterConfig = {
  catalog?: {
    defaultTitle?: string;
    defaultDescription?: string;
    categories?: Record<string, { title?: string; description?: string }>;
    subcategories?: Record<string, { title?: string; description?: string }>;
  };
};

const filterConfig = filterConfigRaw as unknown as FilterConfig;

/**
 * Получить все товары из локального файла данных.
 * @returns {Product[]} Массив товаров
 */
function getProductsFromFile(): Product[] {
  const data = require("@/data/data.json");
  return data[0].products;
}

/**
 * Получить название категории из конфигурации
 */
function getCategoryTitle(code: string, fallbackName: string): string {
  return filterConfig?.catalog?.categories?.[code]?.title || fallbackName;
}

/**
 * Получить название подкатегории из конфигурации
 */
function getSubcategoryTitle(code: string, fallbackName: string): string {
  return filterConfig?.catalog?.subcategories?.[code]?.title || fallbackName;
}

/**
 * Отфильтровать товары по параметрам поиска.
 * @param {Product[]} products - Все товары
 * @param {Record<string, string | string[] | undefined>} searchParams - Параметры фильтрации
 * @returns {Product[]} Отфильтрованные товары
 */
function filterProducts(
  products: Product[],
  searchParams: { [key: string]: string | string[] | undefined },
): Product[] {
  const selectedCategories = searchParams.category
    ? Array.isArray(searchParams.category)
      ? searchParams.category
      : [searchParams.category]
    : [];
  const selectedSubcategories = searchParams.subcategory
    ? Array.isArray(searchParams.subcategory)
      ? searchParams.subcategory
      : [searchParams.subcategory]
    : [];
  const minPrice = searchParams.minPrice
    ? Number(searchParams.minPrice)
    : undefined;
  const maxPrice = searchParams.maxPrice
    ? Number(searchParams.maxPrice)
    : undefined;
  const sortBy = searchParams.sort as string;

  let results: Product[] = [];

  // Если фильтров нет, возвращаем все товары (с возможной сортировкой)
  if (selectedCategories.length === 0 && selectedSubcategories.length === 0) {
    results = [...products];
  } else {
    // 1. Собираем товары из выбранных подкатегорий
    const productsFromSubcategories = products.filter(
      (p) =>
        p.subcategory?.code &&
        selectedSubcategories.includes(p.subcategory.code),
    );

    // 2. Определяем, для каких категорий НЕ были выбраны подкатегории
    const subcategoryToCategoryMap = new Map<string, string>();
    products.forEach((p) => {
      if (p.subcategory?.code && p.category?.code) {
        subcategoryToCategoryMap.set(p.subcategory.code, p.category.code);
      }
    }); 
    const parentCategoriesOfSelectedSubcats = new Set(
      selectedSubcategories.map((sub) => subcategoryToCategoryMap.get(sub)),
    );
    const wholeCategoriesSelected = selectedCategories.filter(
      (cat) => !parentCategoriesOfSelectedSubcats.has(cat),
    );

    // 3. Собираем товары из "целых" категорий
    const productsFromWholeCategories = products.filter(
      (p) =>
        p.category?.code && wholeCategoriesSelected.includes(p.category.code),
    );

    // 4. Объединяем результаты и убираем дубликаты
    const combined = [
      ...productsFromSubcategories,
      ...productsFromWholeCategories,
    ];
    const uniqueIds = new Set();
    results = combined.filter((product) => {
      if (!product.id || uniqueIds.has(product.id)) {
        return false;
      }
      uniqueIds.add(product.id);
      return true;
    });
  }

  // Фильтрация по цене применяется к отобранным товарам
  if (minPrice !== undefined || maxPrice !== undefined) {
    results = results.filter((product) => {
      const price = product.price?.current || 0;
      if (minPrice !== undefined && price < minPrice) return false;
      if (maxPrice !== undefined && price > maxPrice) return false;
      return true;
    });
  }

  // Сортировка
  sortProducts(results, sortBy);

  return results;
}

/**
 * Сортировка товаров по различным критериям
 * @param {Product[]} products - Массив товаров для сортировки
 * @param {string} sortBy - Критерий сортировки
 */
function sortProducts(products: Product[], sortBy: string) {
  switch (sortBy) {
    case "price-asc":
      products.sort((a, b) => a.price.current - b.price.current);
      break;
    case "price-desc":
      products.sort((a, b) => b.price.current - a.price.current);
      break;
    case "popularity":
      products.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      break;
    case "name":
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      // По умолчанию сортируем по популярности
      products.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }
}

/**
 * Генерация метаданных для страницы каталога.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const products = getProductsFromFile();
  const filteredProducts = filterProducts(products, resolvedSearchParams);

  const categoryParam = resolvedSearchParams.category;
  const subcategoryParam = resolvedSearchParams.subcategory;

  // Если есть фильтр по категории, генерируем специфичные метаданные
  if (categoryParam) {
    const categoryCode = Array.isArray(categoryParam)
      ? categoryParam[0]
      : categoryParam;
    const categoryProduct = products.find(
      (p) => p.category?.code === categoryCode,
    );
    if (categoryProduct?.category?.name) {
      const categoryTitle = getCategoryTitle(categoryCode, categoryProduct.category.name);
      return generatePageMetadata(
        {
          title: `${categoryTitle} - купить в Минске | Dilavia`,
          description: `Купить ${categoryTitle.toLowerCase()} в интернет-магазине Dilavia. ${filteredProducts.length} товаров в наличии. Доставка по всей Беларуси. Гарантия качества.`,
          keywords: [
            categoryTitle.toLowerCase(),
            `купить ${categoryTitle.toLowerCase()}`,
            `${categoryTitle.toLowerCase()} Минск`,
            "мебель",
            "интернет-магазин мебели",
            "Dilavia",
            "Беларусь",
          ].join(", "),
        },
        `/catalog?category=${categoryCode}`,
      );
    }
  }

  if (subcategoryParam) {
    const subcategoryCode = Array.isArray(subcategoryParam)
      ? subcategoryParam[0]
      : subcategoryParam;
    const subcategoryProduct = products.find(
      (p) => p.subcategory?.code === subcategoryCode,
    );
    if (subcategoryProduct?.subcategory?.name) {
      const subcategoryTitle = getSubcategoryTitle(subcategoryCode, subcategoryProduct.subcategory.name);
      return generatePageMetadata(
        {
          title: `${subcategoryTitle} - купить в Минске | Dilavia`,
          description: `Купить ${subcategoryTitle.toLowerCase()} в интернет-магазине Dilavia. ${filteredProducts.length} товаров в наличии. Доставка по всей Беларуси. Гарантия качества.`,
          keywords: [
            subcategoryTitle.toLowerCase(),
            `купить ${subcategoryTitle.toLowerCase()}`,
            `${subcategoryTitle.toLowerCase()} Минск`,
            "мебель",
            "интернет-магазин мебели",
            "Dilavia",
            "Беларусь",
          ].join(", "),
        },
        `/catalog?subcategory=${subcategoryCode}`,
      );
    }
  }

  // Дефолтные метаданные для каталога
  return generatePageMetadata(
    {
      title: "Каталог мебели - купить в Минске | Dilavia",
      description:
        "Широкий ассортимент качественной мебели: кровати, диваны, кресла и многое другое. Доставка по всей Беларуси. Гарантия качества.",
      keywords:
        "каталог мебели, мебель Минск, купить мебель, диваны, кровати, кресла, доставка по Беларуси, Dilavia",
    },
    "/catalog",
  );
}

/**
 * Главная страница каталога. Загружает и фильтрует товары, передаёт их в клиентский компонент.
 */
export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const products = getProductsFromFile();
  const filteredProducts = filterProducts(products, resolvedSearchParams);

  // Получаем сортировку из searchParams
  const sortParam =
    typeof resolvedSearchParams.sort === "string"
      ? resolvedSearchParams.sort
      : Array.isArray(resolvedSearchParams.sort)
        ? resolvedSearchParams.sort[0]
        : undefined;
  const sort: "new" | "cheap" | "expensive" =
    sortParam === "cheap" || sortParam === "expensive" || sortParam === "new"
      ? sortParam
      : "new";

  // Сортируем filteredProducts на сервере
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "cheap") return a.price.current - b.price.current;
    if (sort === "expensive") return b.price.current - a.price.current;
    return Number(b.id) - Number(a.id); // по новизне
  });

  const currentFilters: FilterState = {
    category: resolvedSearchParams.category
      ? Array.isArray(resolvedSearchParams.category)
        ? resolvedSearchParams.category
        : [resolvedSearchParams.category]
      : undefined,
    subcategory: resolvedSearchParams.subcategory
      ? Array.isArray(resolvedSearchParams.subcategory)
        ? resolvedSearchParams.subcategory
        : [resolvedSearchParams.subcategory]
      : undefined,
    sortBy: (resolvedSearchParams.sort as FilterState["sortBy"]) || "name",
    priceRange:
      resolvedSearchParams.minPrice || resolvedSearchParams.maxPrice
        ? ([
            Number(resolvedSearchParams.minPrice || 0),
            Number(resolvedSearchParams.maxPrice || Infinity),
          ] as [number, number])
        : undefined,
  };

  // Получаем названия категорий для Schema.org
  let categoryName: string | undefined;
  let subcategoryName: string | undefined;

  if (resolvedSearchParams.category) {
    const categoryCode = Array.isArray(resolvedSearchParams.category)
      ? resolvedSearchParams.category[0]
      : resolvedSearchParams.category;
    const categoryProduct = products.find(
      (p) => p.category?.code === categoryCode,
    );
    // Используем название из конфигурации вместо названия из данных
    categoryName = categoryProduct?.category?.name 
      ? getCategoryTitle(categoryCode, categoryProduct.category.name)
      : undefined;
  }

  if (resolvedSearchParams.subcategory) {
    const subcategoryCode = Array.isArray(resolvedSearchParams.subcategory)
      ? resolvedSearchParams.subcategory[0]
      : resolvedSearchParams.subcategory;
    const subcategoryProduct = products.find(
      (p) => p.subcategory?.code === subcategoryCode,
    );
    // Используем название из конфигурации вместо названия из данных
    subcategoryName = subcategoryProduct?.subcategory?.name
      ? getSubcategoryTitle(subcategoryCode, subcategoryProduct.subcategory.name)
      : undefined;
  }

  return (
    <CatalogClient
      initialProducts={products}
      filteredProducts={sortedProducts}
      currentFilters={currentFilters}
      initialSort={sort}
      categoryName={categoryName}
      subcategoryName={subcategoryName}
    />
  );
}

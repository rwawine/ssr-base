import React from 'react'
import { promises as fs } from 'fs';
import path from 'path';
import ProductCardHover from '@/components/productCard/ProductCardHover';
import { notFound } from 'next/navigation';
import { Product } from '@/types/product';
import { Metadata } from 'next';

import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Каталог товаров | Dilavia',
    description: 'Откройте для себя широкий ассортимент мебели в нашем каталоге. Кровати, диваны, кресла и многое другое по выгодным ценам с доставкой по всей Беларуси.',
    openGraph: {
      title: 'Каталог товаров | Dilavia',
      description: 'Откройте для себя широкий ассортимент мебели в нашем каталоге. Кровати, диваны, кресла и многое другое по выгодным ценам с доставкой по всей Беларуси.',
      url: 'https://dilavia.by/catalog',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Каталог товаров | Dilavia',
      description: 'Откройте для себя широкий ассортимент мебели в нашем каталоге. Кровати, диваны, кресла и многое другое по выгодным ценам с доставкой по всей Беларуси.',
    },
  };
}

async function getProductsData() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'data.json');
  const fileContents = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContents);
}

export default async function CatalogPage() {
  // data.json — это массив с одним объектом, у которого есть поле products
  const productsData = await getProductsData();
  const products: Product[] = productsData[0].products;

  if (!products || products.length === 0) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <h1>Каталог товаров</h1>
      <ul className={styles.catalogList}>
        {products.map((product) => (
          <li key={product.slug}>
            <ProductCardHover product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}

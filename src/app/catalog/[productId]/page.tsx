import React from 'react'
import { promises as fs } from 'fs';
import path from 'path';
import { Product } from '@/types/product';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetail from './ProductDetail';

async function getProductsData() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'data.json');
  const fileContents = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContents);
}

type Params = Promise<{ productId: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { productId: slug } = await params;
  const productsData = await getProductsData();
  const products: Product[] = productsData[0].products;
  const product = products.find((p) => p.slug === slug);
  
  if (!product) {
    return { 
      title: 'Товар не найден | Dilavia',
      description: 'Запрашиваемый товар не найден'
    };
  }

  return {
    title: product.seo?.title || `${product.name} | Dilavia`,
    description: product.seo?.metaDescription || product.description || `Купить ${product.name} в интернет-магазине Dilavia. Доставка по всей Беларуси.`,
    keywords: product.seo?.keywords || `${product.name}, мебель, ${product.category?.name || ''}, купить`,
    openGraph: {
      title: product.seo?.title || product.name,
      description: product.seo?.metaDescription || product.description,
      url: `https://dilavia.by/catalog/${product.slug}`,
      type: 'website',
      images: product.images?.map(img => ({ url: img, alt: product.name })) || [],
      locale: 'ru_RU',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.seo?.title || product.name,
      description: product.seo?.metaDescription || product.description,
      images: product.images?.[0] || [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { productId: slug } = await params;
  const productsData = await getProductsData();
  const products: Product[] = productsData[0].products;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Находим связанные товары из той же категории
  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category?.code === product.category?.code)
    .slice(0, 4);

  // Структурированные данные для SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images,
    "category": product.category?.name,
    "brand": {
      "@type": "Brand",
      "name": "Dilavia"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price?.current,
      "priceCurrency": "BYN",
      "availability": "https://schema.org/InStock",
      "url": `https://dilavia.by/catalog/${product.slug}`,
      "seller": {
        "@type": "Organization",
        "name": "Dilavia"
      }
    },
    "additionalProperty": product.dimensions?.map(dim => ({
      "@type": "PropertyValue",
      "name": `Размер ${dim.width}x${dim.length}`,
      "value": `${dim.price} BYN`
    })) || []
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ProductDetail 
        product={product} 
        relatedProducts={relatedProducts}
      />
    </>
  );
}

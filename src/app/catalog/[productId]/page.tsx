import React from 'react'
import { promises as fs } from 'fs';
import path from 'path';
import ProductCard from '@/components/productCard/ProductCard';
import { Product } from '@/types/product';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

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
  if (!product) return { title: 'Товар не найден' };
  return {
    title: product.seo?.title || product.name,
    description: product.seo?.metaDescription || product.description,
    openGraph: {
      title: product.seo?.title || product.name,
      description: product.seo?.metaDescription || product.description,
      url: `https://dilavia.by/catalog/${product.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.seo?.title || product.name,
      description: product.seo?.metaDescription || product.description,
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { productId: slug } = await params;
  const productsData = await getProductsData();
  const products: Product[] = productsData[0].products;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <ProductCard product={product} />
    </div>
  );
}

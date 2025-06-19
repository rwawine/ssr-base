import React from 'react'
import productsData from '@/data/data.json';
import ProductCard from '@/components/productCard/ProductCard';
import { Product } from '@/types/product';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ productId: string }> }): Promise<Metadata> {
  const { productId } = await params;
  const products: Product[] = productsData[0].products;
  const product = products.find((p) => p.id === productId);
  if (!product) return { title: 'Товар не найден' };
  return {
    title: product.seo?.title || product.name,
    description: product.seo?.metaDescription || product.description,
  };
}

export default async function Page({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const products: Product[] = productsData[0].products;
  const product = products.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <ProductCard product={product} />
    </div>
  );
}

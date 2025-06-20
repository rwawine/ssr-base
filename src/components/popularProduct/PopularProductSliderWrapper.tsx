"use client";
import dynamic from 'next/dynamic';
import { Product } from '@/types/product';

const PopularProductSlider = dynamic(() => import('./PopularProductSlider.client'), { ssr: false });

export default function PopularProductSliderWrapper({ products }: { products: Product[] }) {
  return <PopularProductSlider products={products} />;
} 
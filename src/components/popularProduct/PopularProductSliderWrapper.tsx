"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { Product } from '@/types/product';
import type { PopularProductSliderProps } from './PopularProductSlider';

const PopularProductSlider = dynamic<PopularProductSliderProps>(
  () => import('./PopularProductSlider'),
  { ssr: false }
);

interface PopularProductSliderWrapperProps {
  products: Product[];
  title?: string;
  description?: string;
}

export default function PopularProductSliderWrapper({ products, title, description }: PopularProductSliderWrapperProps) {
  return <PopularProductSlider products={products} title={title} description={description} />;
} 
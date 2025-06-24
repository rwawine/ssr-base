import React from 'react';
import { Product } from '@/types/product';
import type { PopularProductSliderProps } from './PopularProductSlider';
import PopularProductSlider from './PopularProductSlider';

interface PopularProductSliderWrapperProps {
  products: Product[];
  title?: string;
  description?: string;
}

export default function PopularProductSliderWrapper({ products, title, description }: PopularProductSliderWrapperProps) {
  return <PopularProductSlider products={products} title={title} description={description} />;
} 
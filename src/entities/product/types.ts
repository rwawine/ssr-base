import { BaseEntity, ImageData } from "@/shared/types";

export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: ImageData[];
  category: string;
  subcategory?: string;
  brand?: string;
  material?: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  weight?: number;
  color?: string;
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  specifications?: Record<string, string>;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  images: ImageData[];
  inStock: boolean;
  attributes: Record<string, string>;
}

export interface ProductFilter {
  category?: string;
  subcategory?: string;
  brand?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  material?: string[];
  color?: string[];
  inStock?: boolean;
}

export interface ProductSort {
  field: "name" | "price" | "rating" | "createdAt";
  order: "asc" | "desc";
}

export interface ProductSearchParams {
  query?: string;
  filters?: ProductFilter;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}

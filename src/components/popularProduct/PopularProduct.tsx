import React from 'react'
import productsData from '@/data/data.json';
import ProductCard from '@/components/productCard/ProductCard';
import { Product } from '@/types/product';

interface PopularProductProps {
  category?: string; // Например, 'Диван' или 'Кровать'
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

export default function PopularProduct({ category, minPrice, maxPrice, minRating = 4.5 }: PopularProductProps) {
  const products: Product[] = productsData[0].products;
  const filteredProducts = products.filter((product: any) => {
    const byCategory = category ? product.category?.name === category : true;
    const byMinPrice = minPrice !== undefined ? product.price.current >= minPrice : true;
    const byMaxPrice = maxPrice !== undefined ? product.price.current <= maxPrice : true;
    const byRating = minRating !== undefined ? product.popularity && product.popularity >= minRating : true;
    return byCategory && byMinPrice && byMaxPrice && byRating;
  });

  if (filteredProducts.length === 0) {
    return <div>Нет товаров по выбранным критериям</div>;
  }

  return (
    <div>
      <h2>Популярные товары</h2>
      <ul>
        {filteredProducts.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}

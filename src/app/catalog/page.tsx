import React from 'react'
import productsData from '@/data/data.json';
import ProductCard from '@/components/productCard/ProductCard';
import { notFound } from 'next/navigation';

export default function CatalogPage() {
  // data.json — это массив с одним объектом, у которого есть поле products
  const products = productsData[0].products;

  if (!products || products.length === 0) {
    notFound();
  }

  return (
    <div>
      <h1>Каталог товаров</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}

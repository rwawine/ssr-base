import React from 'react'
import productsData from '@/data/data.json';
import ProductCard from '@/components/productCard/ProductCard';

export default function CatalogPage() {
  // data.json — это массив с одним объектом, у которого есть поле products
  const products = productsData[0].products;

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

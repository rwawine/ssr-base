import { MetadataRoute } from 'next';
import allProducts from '@/data/data.json';

// Определим тип для продукта, чтобы TypeScript не ругался
interface Product {
  id: string;
  // Добавьте другие поля, если они вам нужны, но для sitemap достаточно id
}

// Убедимся, что allProducts.products - это массив
const products: Product[] = allProducts[0]?.products || [];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ssr-base.vercel.app';

  // Статические страницы
  const staticRoutes = [
    '/',
    '/about',
    '/catalog',
    '/contacts',
    '/delivery',
    '/reviews',
    '/cart',
    '/favorites',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1.0 : 0.8,
  }));

  // Динамические страницы товаров
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/catalog/${product.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
} 
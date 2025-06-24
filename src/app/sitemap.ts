import { NextResponse } from 'next/server';
import allProducts from '@/data/data.json';

// Определим тип для продукта, чтобы TypeScript не ругался
interface Product {
  id: string;
  slug?: string;
  // Добавьте другие поля, если они вам нужны, но для sitemap достаточно slug
}

// Убедимся, что allProducts.products - это массив
const products: Product[] = allProducts[0]?.products || [];

export async function GET() {
  const baseUrl = 'https://ssr-base.vercel.app';
  const now = new Date().toISOString();

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
    lastModified: now,
    changeFrequency: 'monthly',
    priority: route === '/' ? 1.0 : 0.8,
  }));

  // Динамические страницы товаров по slug
  const productRoutes = products
    .filter((product) => !!product.slug)
    .map((product) => ({
      url: `${baseUrl}/catalog/${product.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  const allRoutes = [...staticRoutes, ...productRoutes];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
    .map(
      (route) => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastModified}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://your-domain.com'; // Замените на ваш домен

// Основные статические страницы
const staticPages = [
  '',
  '/catalog',
  '/about',
  '/contacts',
  '/delivery',
  '/cart',
  '/favorites',
  '/reviews'
];

// Получаем товары из data.json
const dataPath = path.join(__dirname, '../src/data/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const products = Array.isArray(data.products) ? data.products : [];

// Генерируем URL для каждого товара по slug
const productUrls = products
  .filter(product => product.slug)
  .map(product => `/catalog/${product.slug}`);

// Собираем все URL
const allUrls = [
  ...staticPages,
  ...productUrls
];

// Генерируем sitemap.xml
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `
  <url>
    <loc>${SITE_URL}${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === '' ? '1.0' : '0.7'}</priority>
  </url>`
  )
  .join('')}
</urlset>
`;

// Сохраняем sitemap.xml в public/
fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap, 'utf8');
console.log('Sitemap generated!'); 
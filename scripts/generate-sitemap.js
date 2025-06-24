const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://ssr-base.vercel.app'; // Замените на ваш домен

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
const products = data.flatMap(item => item.products || []);

// Генерируем URL для каждого товара по slug или id
const productUrls = products
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

// Проверяем и создаём public, если нужно
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
console.log('Sitemap generated!'); 
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://ssr-base.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart/', '/favorites/'], // Не индексировать личные страницы
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
} 
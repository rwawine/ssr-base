import type { Metadata } from "next";
import { siteConfig } from "./metadata";

export interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?:
    | "website"
    | "article"
    | "book"
    | "profile"
    | "music.song"
    | "music.album"
    | "music.playlist"
    | "music.radio_station"
    | "video.movie"
    | "video.episode"
    | "video.tv_show"
    | "video.other";
  structuredData?: Record<string, any>[];
  noindex?: boolean;
  nofollow?: boolean;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
}

export interface PageSeoData extends SeoData {
  path: string;
  dynamic?: boolean;
}

/**
 * Генерирует метаданные для Next.js App Router
 */
export function generatePageMetadata(seoData: SeoData): Metadata {
  const {
    title,
    description,
    keywords,
    canonical,
    ogImage,
    ogType = "website",
    noindex,
    nofollow,
    twitterCard = "summary_large_image",
  } = seoData;

  // Формируем полный canonical URL
  const fullCanonical = canonical?.startsWith("http")
    ? canonical
    : canonical
      ? `${siteConfig.url}${canonical}`
      : siteConfig.url;

  // Формируем полный путь к изображению
  const fullOgImage = ogImage?.startsWith("http")
    ? ogImage
    : ogImage
      ? `${siteConfig.url}${ogImage}`
      : `${siteConfig.url}${siteConfig.ogImage}`;

  const metadata: Metadata = {
    title: title || siteConfig.name,
    description: description || siteConfig.description,
    keywords: keywords || siteConfig.keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    openGraph: {
      type: ogType,
      locale: siteConfig.locale,
      url: fullCanonical,
      title: title || siteConfig.name,
      description: description || siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
    },
    twitter: {
      card: twitterCard,
      title: title || siteConfig.name,
      description: description || siteConfig.description,
      images: [fullOgImage],
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: fullCanonical,
    },
    metadataBase: new URL(siteConfig.url),
  };

  return metadata;
}

/**
 * Генерирует структурированные данные для страницы
 */
export function generateStructuredData(
  seoData: SeoData,
): Record<string, any>[] {
  const structuredData: Record<string, any>[] = [];

  // Добавляем базовые схемы для всех страниц
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: seoData.title || siteConfig.name,
    description: seoData.description || siteConfig.description,
    url: seoData.canonical || siteConfig.url,
    inLanguage: "ru",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  });

  // Добавляем пользовательские структурированные данные
  if (seoData.structuredData) {
    structuredData.push(...seoData.structuredData);
  }

  return structuredData;
}

/**
 * Создает SEO-хук для клиентских компонентов
 */
export function createSeoHook() {
  return function usePageSeo(seoData: SeoData) {
    // В App Router используем generateMetadata в серверных компонентах
    // Этот хук предназначен для клиентских компонентов, которые могут обновлять SEO
    return {
      updateSeo: (newSeoData: Partial<SeoData>) => {
        // Логика обновления SEO на клиенте
        console.log("SEO updated:", { ...seoData, ...newSeoData });
      },
      currentSeo: seoData,
    };
  };
}

/**
 * Валидирует SEO-данные
 */
export function validateSeoData(seoData: SeoData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!seoData.title || seoData.title.length < 10) {
    errors.push("Title должен содержать минимум 10 символов");
  }

  if (!seoData.description || seoData.description.length < 50) {
    errors.push("Description должен содержать минимум 50 символов");
  }

  if (seoData.description && seoData.description.length > 160) {
    errors.push("Description не должен превышать 160 символов");
  }

  if (
    seoData.canonical &&
    !seoData.canonical.startsWith("http") &&
    !seoData.canonical.startsWith("/")
  ) {
    errors.push("Canonical должен быть абсолютным URL или относительным путем");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

import type { Metadata } from "next";

const siteConfig = {
  name: "Dilavia",
  description: "Мебель для вашего дома",
  url: "https://dilavia.by",
  ogImage: "/og-image.jpg",
  keywords:
    "мебель, диваны, кровати, кресла, купить, Минск, Беларусь, интернет-магазин, dilavia.by",
  locale: "ru_RU",
} as const;

export const defaultMetadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.description} | Интернет-магазин dilavia.by`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Купить мебель в Минске и по всей Беларуси. Большой выбор диванов, кроватей, кресел и аксессуаров. Доставка, гарантия, лучшие цены!",
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.description}`,
    description:
      "Купить мебель в Минске и по всей Беларуси. Большой выбор диванов, кроватей, кресел и аксессуаров.",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.description}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.description}`,
    description:
      "Купить мебель в Минске и по всей Беларуси. Большой выбор диванов, кроватей, кресел и аксессуаров.",
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
  metadataBase: new URL(siteConfig.url),
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

/**
 * Генерирует метаданные с переопределениями
 * @param overrides - переопределения для базовых метаданных
 * @returns объект метаданных
 */
export function generateMetadata(overrides: Partial<Metadata> = {}): Metadata {
  return {
    ...defaultMetadata,
    ...overrides,
  };
}

/**
 * Генерирует метаданные для страницы с динамическим canonical
 * @param seoData - SEO данные страницы
 * @param path - путь страницы
 * @returns объект метаданных
 */
export function generatePageMetadata(
  seoData: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    ogType?: "website" | "article";
    noindex?: boolean;
  },
  path: string = "/",
): Metadata {
  const canonical = path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;

  return generateMetadata({
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      url: canonical,
      title: seoData.title,
      description: seoData.description,
      type: seoData.ogType || "website",
      images: seoData.ogImage
        ? [
            {
              url: seoData.ogImage,
              width: 1200,
              height: 630,
              alt: seoData.title || siteConfig.name,
            },
          ]
        : undefined,
    },
    twitter: {
      title: seoData.title,
      description: seoData.description,
      images: seoData.ogImage ? [seoData.ogImage] : undefined,
    },
    robots: {
      index: !seoData.noindex,
      follow: !seoData.noindex,
    },
  });
}

export { siteConfig };

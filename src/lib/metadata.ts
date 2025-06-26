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
};

export function generateMetadata(overrides: Partial<Metadata> = {}): Metadata {
  return {
    ...defaultMetadata,
    ...overrides,
  };
}

export { siteConfig };

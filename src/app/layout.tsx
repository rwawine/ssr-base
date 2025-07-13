import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { ClientProviders } from "@/components/ClientProviders";
import { GlobalSchema } from "@/components/schema/GlobalSchema";
import { generateProductStructuredData } from "@/lib/seo-utils";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Dilavia - Мебельная фабрика в Минске",
    template: "%s",
  },
  description:
    "Купить мебель в Минске и по всей Беларуси. Большой выбор диванов, кроватей, кресел и аксессуаров от мебельной фабрики Dilavia.",
  keywords:
    "мебель, диваны, кровати, кресла, мебельная фабрика, Минск, Беларусь, Dilavia, купить мебель, мебельный магазин, мягкая мебель, корпусная мебель, спальная мебель, гостиная мебель, детская мебель, кухонная мебель, офисная мебель, мебель на заказ, производство мебели, доставка мебели, мебель в кредит, акции на мебель, распродажа мебели, мебель со скидкой, мебель оптом",
  authors: [{ name: "Dilavia" }],
  creator: "Dilavia",
  publisher: "Dilavia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://dilavia.by"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://dilavia.by",
    siteName: "Dilavia",
    title: "Dilavia - Мебельная фабрика в Минске",
    description:
      "Купить мебель в Минске и по всей Беларуси. Большой выбор диванов, кроватей, кресел и аксессуаров.",
    images: [
      {
        url: "https://dilavia.by/images/logo.svg",
        width: 1200,
        height: 630,
        alt: "Dilavia - Мебельная фабрика",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dilavia - Мебельная фабрика в Минске",
    description:
      "Купить мебель в Минске и по всей Беларуси. Большой выбор диванов, кроватей, кресел и аксессуаров.",
    images: ["https://dilavia.by/images/logo.svg"],
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

async function getPopularProducts() {
  const data = await import("@/data/data.json");
  return data.default[0].products.slice(0, 5);
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const popularProducts = await getPopularProducts();
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: "https://dilavia.by/",
      },
    ],
  };
  function toAbsoluteImages(product: any) {
    const abs = (url: string) =>
      url.startsWith("http") ? url : `https://dilavia.by${url}`;
    return {
      ...product,
      images: product.images?.map(abs) || [],
    };
  }
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: popularProducts.map((product, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: generateProductStructuredData(
        toAbsoluteImages(
          product as unknown as import("@/types/product").Product,
        ),
      ),
    })),
  };
  return (
    <html lang="ru">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17322570356"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17322570356');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <GlobalSchema />
        <ClientProviders>
          <Header />
          <main>{children}</main>
          <Footer />
        </ClientProviders>
        <script
          async
          src="https://script.click-chat.ru/chat.js?wid=2806a4e5-3f63-4afe-b6a3-d09e0d4f08b4"
        ></script>
      </body>
    </html>
  );
}

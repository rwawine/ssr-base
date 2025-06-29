import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { ClientProviders } from "@/components/ClientProviders";
import { GlobalSchema } from "@/components/schema/GlobalSchema";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Dilavia - Мебельная фабрика в Минске",
    template: "%s | Dilavia",
  },
  description:
    "Купить мебель в Минске и по всей Беларуси. Большой выбор диванов, кроватей, кресел и аксессуаров от мебельной фабрики Dilavia.",
  keywords:
    "мебель, диваны, кровати, кресла, мебельная фабрика, Минск, Беларусь, Dilavia",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <GlobalSchema />
        <ClientProviders>
          <Header />
          <main>{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dilavia — Мебель для вашего дома | Интернет-магазин dilavia.by",
  description: "Купить мебель в Минске и по всей Беларуси. Большой выбор диванов, кроватей, кресел и аксессуаров. Доставка, гарантия, лучшие цены!",
  keywords: "мебель, диваны, кровати, кресла, купить, Минск, Беларусь, интернет-магазин, dilavia.by",
  openGraph: {
    title: "Dilavia — Мебель для вашего дома",
    description: "Купить мебель в Минске и по всей Беларуси. Большой выбор диванов, кроватей, кресел и аксессуаров.",
    url: "https://dilavia.by/",
    siteName: "Dilavia",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dilavia — Мебель для вашего дома"
      }
    ],
    locale: "ru_RU",
    type: "website"
  },
  icons: {
    icon: "/favicon.ico"
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "https://dilavia.by/"
  },
  metadataBase: new URL('https://dilavia.by/')
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${montserrat.variable}`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

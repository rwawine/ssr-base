import PopularProduct from "@/components/popularProduct/PopularProduct";
import styles from "./page.module.css";
import { promises as fs } from 'fs';
import path from 'path';
import { Product } from '@/types/product';
import SliderHeroBanner from "@/components/sliderHeroBanner/SliderHeroBanner";
import { fetchHeroSlides } from '@/utils/fetchHeroSlides';
import { Metadata } from "next";

async function getProductsData() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'data.json');
  const fileContents = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContents);
}


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

export default async function Home() {
  const slides = await fetchHeroSlides();
  const productsData = await getProductsData();
  const products: Product[] = productsData[0].products;

  return (
    <main className={styles.container}>
      <SliderHeroBanner slides={slides} />
      <PopularProduct products={products} />
    </main>
  );
}

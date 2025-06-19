import PopularProduct from "@/components/popularProduct/PopularProduct";
import styles from "./page.module.css";
import { promises as fs } from 'fs';
import path from 'path';
import { Product } from '@/types/product';
import SliderHeroBanner from "@/components/sliderHeroBanner/SliderHeroBanner";
import { fetchHeroSlides } from '@/utils/fetchHeroSlides';

async function getProductsData() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'data.json');
  const fileContents = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContents);
}

export default async function Home() {
  const productsData = await getProductsData();
  const products: Product[] = productsData[0].products;
  const filteredProducts = products.filter((product) => product.category?.name === "Кровать");
  const slides = await fetchHeroSlides();

  return (
    <main className={styles.container}>
      <SliderHeroBanner slides={slides} />
      <PopularProduct products={filteredProducts} category="Кровать" />
    </main>
  );
}

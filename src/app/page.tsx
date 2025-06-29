import React from "react";
import SliderHeroBanner from "@/components/sliderHeroBanner/SliderHeroBanner";
import PopularProduct from "@/components/popularProduct/PopularProduct";
import BenefitsBlock from "@/components/benefitsBlock/BenefitsBlock";
import ReviewsBlock from "@/components/reviewsBlock/ReviewsBlock";
import MarqueeBlock from "@/components/marqueeBlock/MarqueeBlock";
import CopirateBlock from "@/components/copirateBlock/CopirateBlock";
import { fetchHeroSlides } from "@/utils/fetchHeroSlides";
import productsData from "@/data/data.json";
import { Product } from "@/types/product";
import { Slide } from "@/types";
import styles from "./page.module.css";

export default async function HomePage() {
  let slides: Slide[] = [];

  try {
    slides = await fetchHeroSlides();
    slides = slides.filter(
      (slide) =>
        slide &&
        slide.image &&
        Array.isArray(slide.image) &&
        slide.image.length > 0 &&
        slide.image[0]?.url,
    );
  } catch (error) {
    console.error("Error fetching hero slides:", error);
    slides = [];
  }

  const products: Product[] = productsData[0].products as unknown as Product[];

  return (
    <div className={styles.container}>
      {slides.length > 0 && <SliderHeroBanner slides={slides} />}
      <PopularProduct products={products} category={["Диван"]} />
      <BenefitsBlock />
      <ReviewsBlock />
      <MarqueeBlock />
      <PopularProduct
        products={products}
        category={["Кровать"]}
        minRating={0}
        title="Кровати в Минске"
        description="В интернет-магазине Dilavia.by представлены только тщательно отобранные модели кроватей, мягкой мебели. Каждая модель из нашего интернет каталога – это воплощение отличного дизайна."
      />
      <CopirateBlock />
    </div>
  );
}

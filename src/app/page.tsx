import { Metadata } from "next";
import Script from "next/script";
import SliderHeroBanner from "@/components/sliderHeroBanner/SliderHeroBanner";
import PopularProduct from "@/components/popularProduct/PopularProduct";
import BenefitsBlock from "@/components/benefitsBlock/BenefitsBlock";
import MarqueeBlockFallback from "@/components/marqueeBlock/MarqueeBlockFallback";
import ReviewsBlock from "@/components/reviewsBlock/ReviewsBlock";
import CopirateBlock from "@/components/copirateBlock/CopirateBlock";
import { fetchHeroSlides } from "@/utils/fetchHeroSlides";
import productsData from "@/data/data.json";
import { Product } from "@/types/product";
import { generatePageMetadata } from "@/lib/metadata";
import styles from "./page.module.css";

export const metadata: Metadata = generatePageMetadata(
  {
    title:
      "Купить мебель в Минске недорого - диваны, кровати, кресла от производителя Dilavia",
    description:
      "Купить мебель в Минске и по всей Беларуси. Большой выбор диванов, кроватей, кресел и аксессуаров. Доставка, гарантия, лучшие цены!",
    keywords:
      "мебель Минск, купить мебель, диваны, кровати, кресла, производитель мебели, доставка по Беларуси",
    ogImage:
      "/images/medium_u7661199629_A_luxurious_living_room_interior_with_a_stylish_o_ac81bca1_328c_4d9d_a0fd_4508eaa2de6c_0_fe6545f98e.png",
  },
  "/",
);

export default async function Home() {
  const slides = await fetchHeroSlides();
  const products: Product[] = productsData[0].products as unknown as Product[];

  return (
    <main className={styles.container}>
      <Script
        id="website-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            url: "https://dilavia.by/",
            name: "Dilavia — Мебель для вашего дома",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://dilavia.by/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <Script
        id="organization-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Dilavia",
            url: "https://dilavia.by/",
            logo: "https://dilavia.by/favicon.ico",
          }),
        }}
      />

      {slides.length > 0 && <SliderHeroBanner slides={slides} />}
      <PopularProduct products={products} category={["Диван"]} />
      <BenefitsBlock />
      <MarqueeBlockFallback
        speed={120}
        pauseOnHover={true}
        showLoading={false}
      />
      <PopularProduct
        products={products}
        category={["Кровать"]}
        minRating={0}
        title="Кровати в Минске"
        description="В интернет-магазине Dilavia.by представлены только тщательно отобранные модели кроватей, мягкой и корпусной мебели. Каждая модель из нашего интернет каталога – это воплощение отличного дизайна."
      />
      <ReviewsBlock />
      <CopirateBlock />
    </main>
  );
}

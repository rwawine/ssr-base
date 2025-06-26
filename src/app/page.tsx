import { Metadata } from 'next';
import Script from 'next/script';
import SliderHeroBanner from '@/components/sliderHeroBanner/SliderHeroBanner';
import PopularProduct from '@/components/popularProduct/PopularProduct';
import BenefitsBlock from '@/components/benefitsBlock/BenefitsBlock';
import MarqueeBlockFallback from '@/components/marqueeBlock/MarqueeBlockFallback';
import ReviewsBlock from '@/components/reviewsBlock/ReviewsBlock';
import CopirateBlock from '@/components/copirateBlock/CopirateBlock';
import { fetchHeroSlides } from '@/utils/fetchHeroSlides';
import productsData from '@/data/data.json';
import { Product } from '@/types/product';
import ResourcePreloader from '@/components/ResourcePreloader';
import styles from './page.module.css';

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
  const products: Product[] = productsData[0].products as unknown as Product[];

  // Получаем критические изображения для предзагрузки
  const criticalImages = slides.slice(0, 2).map(slide => {
    const imageUrl = slide.image[0]?.url || '';
    return imageUrl;
  });

  return (
    <main className={styles.container}>
      {/* Предзагрузка критических ресурсов */}
      <ResourcePreloader
        criticalImages={criticalImages}
        fonts={[
          '/fonts/LTSuperior-Regular.woff2',
          '/fonts/LTSuperior-Medium.woff2',
          '/fonts/LTSuperior-Semibold.woff2'
        ]}
      />

      <Script
        id="website-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://dilavia.by/",
            "name": "Dilavia — Мебель для вашего дома",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://dilavia.by/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
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
            "name": "Dilavia",
            "url": "https://dilavia.by/",
            "logo": "https://dilavia.by/favicon.ico"
          })
        }}
      />
      
      <SliderHeroBanner slides={slides} />
      <PopularProduct products={products} category={["Диван"]} />
      <BenefitsBlock />
      <MarqueeBlockFallback
        speed={120}
        pauseOnHover={true}
        showLoading={true}
      />
      <PopularProduct products={products} category={["Кровать"]} minRating={0}/>
      <ReviewsBlock />
      <CopirateBlock />
    </main>
  );
}

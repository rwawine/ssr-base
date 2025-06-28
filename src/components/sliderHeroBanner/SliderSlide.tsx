import Link from "next/link";
import { OptimizedImage } from "@/components/optimized-image/OptimizedImage";
import { createOptimizedImageUrl } from "@/lib/image-utils";
import type { Slide } from "@/types";
import styles from "./SliderHeroBanner.module.css";

interface SliderSlideProps {
  slide: Slide;
  index: number;
  isActive: boolean;
  isLCP?: boolean;
}

export function SliderSlide({
  slide,
  index,
  isActive,
  isLCP = false,
}: SliderSlideProps) {
  return (
    <div
      className={`${styles.slide} ${isActive ? styles.slideActive : styles.slideHidden}`}
      data-slide-index={index}
    >
      {/* Используем OptimizedImage для всех слайдов для консистентности */}
      <OptimizedImage
        src={slide.image[0].url}
        alt={slide.title}
        width={1440}
        height={600}
        className={styles.backgroundImage}
        priority={isLCP}
        quality={isLCP ? 90 : 85}
        sizes="100vw"
      />

      <div className={styles.content}>
        <h2 className={styles.title}>{slide.title}</h2>
        <p className={styles.description}>{slide.description}</p>
        <Link
          href={slide.buttonLink}
          className={styles.button}
          title={slide.buttonText}
        >
          {slide.buttonText}
        </Link>
      </div>
    </div>
  );
}

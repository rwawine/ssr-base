"use client";

import { useEffect } from "react";
import { useSlider } from "@/hooks/useSlider";
import { preloadImages } from "@/lib/image-utils";
import { createOptimizedImageUrl } from "@/lib/image-utils";
import { SliderSlide } from "./SliderSlide";
import { SliderNavigation } from "./SliderNavigation";
import type { SliderHeroBannerProps } from "@/types";
import styles from "./SliderHeroBanner.module.css";

export default function SliderHeroBanner({ slides }: SliderHeroBannerProps) {
  const {
    currentSlide,
    isAutoPlaying,
    isDragging,
    goToSlide,
    goToPrev,
    goToNext,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  } = useSlider({
    slides,
    autoPlayInterval: 5000,
    pauseOnInteraction: true,
    resumeDelay: 3000,
  });

  // Предзагружаем критические изображения (первые 2 слайда)
  useEffect(() => {
    if (slides.length > 0 && typeof window !== "undefined") {
      const criticalImages = slides.slice(0, 2).map((slide) =>
        createOptimizedImageUrl(slide.image[0].url, {
          width: 1440,
          height: 600,
          quality: 90,
        }),
      );
      preloadImages(criticalImages).catch(console.error);
    }
  }, [slides]);

  // Обработчики событий мыши
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  // Обработчики событий тач
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Не отображаем слайдер если нет данных или данные неполные
  if (!slides || slides.length === 0 || !slides[0]?.image?.[0]?.url) {
    return null;
  }

  return (
    <div className={styles.hero}>
      <div
        className={styles.sliderContent}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-label="Главный слайдер"
        aria-live="polite"
      >
        {slides.map((slide, index) => (
          <SliderSlide
            key={slide.id || index}
            slide={slide}
            index={index}
            isActive={index === currentSlide}
            isLCP={index === 0}
          />
        ))}
      </div>

      <SliderNavigation
        slidesCount={slides.length}
        currentSlide={currentSlide}
        controls={{ goToSlide, goToPrev, goToNext }}
      />
    </div>
  );
}

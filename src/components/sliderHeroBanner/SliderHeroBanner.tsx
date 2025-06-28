"use client";

import { useSlider } from "@/hooks/useSlider";
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
  if (!slides || slides.length === 0) {
    return null;
  }

  // Проверяем, что у всех слайдов есть изображения
  const validSlides = slides.filter((slide) => slide?.image?.[0]?.url);

  if (validSlides.length === 0) {
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
        {validSlides.map((slide, index) => (
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
        slidesCount={validSlides.length}
        currentSlide={currentSlide}
        controls={{ goToSlide, goToPrev, goToNext }}
      />
    </div>
  );
}

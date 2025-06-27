"use client";

import Image from "next/image";
import { useState } from "react";
import {
  optimizeImageData,
  createOptimizedImageUrl,
  createLazyLoadingAttributes,
} from "@/lib/image-utils";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import styles from "./OptimizedImage.module.css";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
  sizes,
  quality = 80,
  placeholder = "empty",
  blurDataURL,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
  });

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Если изображение не в области видимости и не приоритетное, не загружаем
  if (!isIntersecting && !priority) {
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={`${styles.placeholder} ${className}`}
        style={{ width, height }}
      >
        <div className={styles.loading} />
      </div>
    );
  }

  // Оптимизируем URL изображения
  const optimizedSrc = createOptimizedImageUrl(src, {
    width,
    height,
    quality,
    format: "auto",
  });

  // Создаем атрибуты для lazy loading
  const lazyAttributes = createLazyLoadingAttributes(optimizedSrc, alt, {
    loading: priority ? "eager" : "lazy",
    sizes,
  });

  // Определяем стили для поддержания пропорций
  const imageStyle = {
    width: width ? `100%` : 'auto',
    height: height ? `${height}px` : 'auto',
    objectFit: 'cover' as const,
  };

  if (hasError) {
    return (
      <div className={`${styles.error} ${className}`} style={{ width, height }}>
        <div className={styles.errorContent}>
          <span>Ошибка загрузки</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={`${styles.container} ${className} ${isLoaded ? styles.loaded : ""}`}
    >
      <Image
        {...lazyAttributes}
        width={width || 400}
        height={height || 300}
        className={styles.image}
        style={imageStyle}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}

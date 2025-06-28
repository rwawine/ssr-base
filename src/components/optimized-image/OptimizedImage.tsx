"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./OptimizedImage.module.css";

const FALLBACK_SRC = "/images/no-image.png";

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
  // Показываем только картинку или fallback, никаких плейсхолдеров
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_SRC);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    setImgSrc(src || FALLBACK_SRC);
  }, [src]);

  const handleError = () => {
    if (imgSrc !== FALLBACK_SRC) {
      setImgSrc(FALLBACK_SRC);
    }
    onError?.();
  };

  // Формируем className статично, без динамических операций
  const containerClassName = className
    ? `${styles.container} ${className}`.trim()
    : styles.container;

  // Стабилизируем sizes для предотвращения гидратации
  const stableSizes =
    sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

  return (
    <div className={containerClassName} suppressHydrationWarning>
      <Image
        src={imgSrc}
        alt={alt}
        width={width || 400}
        height={height || 300}
        className={styles.image}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={stableSizes}
        quality={quality}
        onLoad={onLoad}
        onError={handleError}
        unoptimized={imgSrc.startsWith("http")}
        suppressHydrationWarning
      />
    </div>
  );
}

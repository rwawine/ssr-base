"use client";

import Image from "next/image";
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
  sizes = "100vw",
  quality = 80,
  placeholder = "empty",
  blurDataURL,
  onLoad,
  onError,
}: OptimizedImageProps) {
  // Формируем className статично
  const containerClassName = className
    ? `${styles.container} ${className}`.trim()
    : styles.container;

  const imageSrc = src || FALLBACK_SRC;

  return (
    <div className={containerClassName}>
      <Image
        src={imageSrc}
        alt={alt}
        width={width || 400}
        height={height || 300}
        className={styles.image}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={sizes}
        quality={quality}
        onLoad={onLoad}
        onError={onError}
        unoptimized={imageSrc.startsWith("http")}
      />
    </div>
  );
}

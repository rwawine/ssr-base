"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  optimizeForLCP,
  createSrcSet,
  createSizesAttribute,
  shouldPrioritizeImage,
  preloadCriticalImages,
} from "@/utils/imageOptimization";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
  quality?: number;
  sizes?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  isLCP?: boolean;
  viewport?: "mobile" | "tablet" | "desktop";
  aspectRatio?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  loading = "lazy",
  quality = 80,
  sizes,
  placeholder = "empty",
  blurDataURL,
  isLCP = false,
  viewport = "desktop",
  aspectRatio,
  onLoad,
  onError,
}: OptimizedImageProps) {
  // Оптимизируем изображение для LCP
  const optimizedProps = optimizeForLCP(
    { url: src },
    { isLCP, viewport, aspectRatio },
  );

  // sizes атрибут
  const sizesAttr = sizes || createSizesAttribute();

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width || optimizedProps.width}
        height={height || optimizedProps.height}
        className={className}
        priority={priority || isLCP}
        loading={priority || isLCP ? "eager" : loading}
        quality={quality}
        sizes={sizesAttr}
        placeholder="empty"
        blurDataURL={undefined}
        onLoad={onLoad}
        onError={onError}
        style={{
          objectFit: "cover",
          objectPosition: "center",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}

// Компонент для LCP изображений (герои, баннеры)
export function LCPImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      isLCP={true}
      priority={true}
      loading="eager"
      quality={90}
    />
  );
}

// Компонент для изображений продуктов
export function ProductImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage {...props} viewport="desktop" quality={80} loading="lazy" />
  );
}

// Компонент для миниатюр
export function ThumbnailImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      viewport="mobile"
      quality={70}
      loading="lazy"
      sizes="300px"
    />
  );
}

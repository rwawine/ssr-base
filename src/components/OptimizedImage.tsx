'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  optimizeForLCP, 
  createSrcSet, 
  createSizesAttribute,
  shouldPrioritizeImage,
  preloadCriticalImages 
} from '@/utils/imageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
  quality?: number;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  isLCP?: boolean;
  viewport?: 'mobile' | 'tablet' | 'desktop';
  aspectRatio?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  loading = 'lazy',
  quality = 80,
  sizes,
  placeholder = 'empty',
  blurDataURL,
  isLCP = false,
  viewport = 'desktop',
  aspectRatio,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Определяем приоритет загрузки
  const shouldPrioritize = priority || isLCP;

  // Оптимизируем изображение для LCP
  const optimizedProps = optimizeForLCP(
    { url: src },
    { isLCP, viewport, aspectRatio }
  );

  // Создаем srcset для адаптивности
  const srcSet = createSrcSet({ url: src });

  // Определяем sizes атрибут
  const sizesAttr = sizes || createSizesAttribute();

  // Предзагружаем критические изображения
  useEffect(() => {
    if (shouldPrioritize && typeof window !== 'undefined') {
      preloadCriticalImages([src]);
    }
  }, [src, shouldPrioritize]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Если произошла ошибка, показываем fallback
  if (hasError) {
    return (
      <div 
        className={`${className} bg-gray-200 flex items-center justify-center`}
        style={{ 
          width: width || optimizedProps.width, 
          height: height || optimizedProps.height 
        }}
      >
        <span className="text-gray-500 text-sm">Ошибка загрузки</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width || optimizedProps.width}
        height={height || optimizedProps.height}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        priority={shouldPrioritize}
        loading={shouldPrioritize ? 'eager' : loading}
        quality={quality}
        sizes={sizesAttr}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          width: "100%",
        }}
      />
      
      {/* Плейсхолдер во время загрузки */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ 
            width: width || optimizedProps.width, 
            height: height || optimizedProps.height 
          }}
        />
      )}
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
    <OptimizedImage
      {...props}
      viewport="desktop"
      quality={80}
      loading="lazy"
    />
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
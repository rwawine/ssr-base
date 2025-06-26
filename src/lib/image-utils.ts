import type { ImageData, OptimizedImageData } from "@/types";

/**
 * Генерирует srcSet для изображения
 */
export function generateSrcSet(
  imageUrl: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1920],
): string {
  return widths.map((width) => `${imageUrl}?w=${width} ${width}w`).join(", ");
}

/**
 * Генерирует sizes атрибут для изображения
 */
export function generateSizes(
  breakpoints: { [key: string]: string } = {
    "(max-width: 640px)": "100vw",
    "(max-width: 768px)": "50vw",
    "(max-width: 1024px)": "33vw",
    "(max-width: 1280px)": "25vw",
    "(min-width: 1281px)": "20vw",
  },
): string {
  return Object.entries(breakpoints)
    .map(([query, size]) => `${query} ${size}`)
    .join(", ");
}

/**
 * Оптимизирует данные изображения
 */
export function optimizeImageData(
  imageData: ImageData,
  options: {
    widths?: number[];
    breakpoints?: { [key: string]: string };
    quality?: number;
  } = {},
): OptimizedImageData {
  const { widths = [320, 640, 768, 1024, 1280, 1920], breakpoints } = options;

  return {
    ...imageData,
    srcSet: generateSrcSet(imageData.url, widths),
    sizes: generateSizes(breakpoints),
    placeholder: generatePlaceholder(imageData.url),
  };
}

/**
 * Генерирует placeholder для изображения
 */
export function generatePlaceholder(imageUrl: string): string {
  // Здесь можно использовать сервисы типа blurhash или base64 placeholder
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">
        Загрузка...
      </text>
    </svg>
  `)}`;
}

/**
 * Проверяет, поддерживает ли браузер WebP
 */
export function supportsWebP(): boolean {
  if (typeof window === "undefined") return false;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
}

/**
 * Получает оптимальный формат изображения
 */
export function getOptimalImageFormat(): "webp" | "jpeg" | "png" {
  if (supportsWebP()) {
    return "webp";
  }
  return "jpeg";
}

/**
 * Создает URL изображения с параметрами оптимизации
 */
export function createOptimizedImageUrl(
  originalUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "jpeg" | "png" | "auto";
    fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  } = {},
): string {
  const {
    width,
    height,
    quality = 80,
    format = "auto",
    fit = "cover",
  } = options;

  const params = new URLSearchParams();

  if (width) params.append("w", width.toString());
  if (height) params.append("h", height.toString());
  if (quality !== 80) params.append("q", quality.toString());
  if (format !== "auto") params.append("f", format);
  if (fit !== "cover") params.append("fit", fit);

  const separator = originalUrl.includes("?") ? "&" : "?";
  return `${originalUrl}${params.toString() ? separator + params.toString() : ""}`;
}

/**
 * Предзагружает изображение
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Предзагружает несколько изображений
 */
export function preloadImages(sources: string[]): Promise<void[]> {
  return Promise.all(sources.map(preloadImage));
}

/**
 * Получает размеры изображения
 */
export function getImageDimensions(
  src: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Проверяет, является ли URL изображением
 */
export function isImageUrl(url: string): boolean {
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
    ".bmp",
  ];
  const lowerUrl = url.toLowerCase();

  return (
    imageExtensions.some((ext) => lowerUrl.includes(ext)) ||
    lowerUrl.includes("data:image/") ||
    lowerUrl.includes("blob:")
  );
}

/**
 * Создает lazy loading атрибуты для изображения
 */
export function createLazyLoadingAttributes(
  src: string,
  alt: string,
  options: {
    loading?: "lazy" | "eager";
    decoding?: "async" | "sync" | "auto";
    sizes?: string;
  } = {},
): {
  src: string;
  alt: string;
  loading: "lazy" | "eager";
  decoding: "async" | "sync" | "auto";
  sizes?: string;
} {
  return {
    src,
    alt,
    loading: options.loading || "lazy",
    decoding: options.decoding || "async",
    sizes: options.sizes,
  };
}

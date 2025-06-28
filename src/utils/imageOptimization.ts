export const IMAGE_SIZES = {
  desktop: 1920,
  tablet: 1024,
  mobile: 768,
  thumbnail: 300,
  hero: 1440,
  product: 800,
  marquee: 340,
};

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "auto" | "webp" | "avif" | "jpg";
  loading?: "eager" | "lazy";
  priority?: boolean;
  placeholder?: "blur" | "empty";
  sizes?: string;
}

export const IMAGE_PRESETS = {
  hero: {
    width: IMAGE_SIZES.hero,
    quality: 85,
    format: "auto" as const,
    loading: "eager" as const,
    priority: true,
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1440px",
  },
  product: {
    width: IMAGE_SIZES.product,
    quality: 80,
    format: "auto" as const,
    loading: "lazy" as const,
    priority: false,
    sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
  },
  marquee: {
    width: IMAGE_SIZES.marquee,
    quality: 75,
    format: "auto" as const,
    loading: "lazy" as const,
    priority: false,
    sizes: "340px",
  },
  thumbnail: {
    width: IMAGE_SIZES.thumbnail,
    quality: 70,
    format: "auto" as const,
    loading: "lazy" as const,
    priority: false,
    sizes: "300px",
  },
};

export const optimizeImageUrl = (
  url: string,
  options: ImageOptimizationOptions = {},
) => {
  if (!url) return "";

  const {
    width = IMAGE_SIZES.desktop,
    quality = 80,
    format = "auto",
  } = options;

  if (url.includes("res.cloudinary.com")) {
    const baseUrl = url.replace(
      "/upload/",
      `/upload/w_${width},c_scale,f_${format},q_${quality},dpr_auto,fl_progressive/`,
    );
    return baseUrl;
  }

  return url;
};

export const getOptimizedImageUrl = (
  imageData: any,
  preset: keyof typeof IMAGE_PRESETS = "product",
  customOptions?: Partial<ImageOptimizationOptions>,
) => {
  const presetOptions = IMAGE_PRESETS[preset];
  const options = { ...presetOptions, ...customOptions };

  const imageUrl =
    imageData?.formats?.large?.url ||
    imageData?.formats?.medium?.url ||
    imageData?.url ||
    "";

  return imageUrl ? optimizeImageUrl(imageUrl, options) : "";
};

export const createSrcSet = (
  imageData: any,
  sizes: number[] = [300, 600, 900, 1200],
) => {
  if (!imageData?.url) return "";

  return sizes
    .map((size) => {
      const optimizedUrl = optimizeImageUrl(imageData.url, {
        width: size,
        quality: 80,
      });
      return `${optimizedUrl} ${size}w`;
    })
    .join(", ");
};

export const preloadCriticalImages = (images: string[]) => {
  if (typeof window === "undefined") return;

  const linkExists = (href: string): boolean => {
    return Array.from(
      document.head.querySelectorAll('link[rel="preload"]'),
    ).some((link) => link.getAttribute("href") === href);
  };

  images.forEach((src, index) => {
    if (linkExists(src)) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    link.fetchPriority = index === 0 ? "high" : "auto";
    document.head.appendChild(link);
  });
};

export const createPlaceholderUrl = (imageData: any, width: number = 20) => {
  if (!imageData?.url) return "";

  return optimizeImageUrl(imageData.url, {
    width,
    quality: 10,
    format: "auto",
  });
};

export const shouldPrioritizeImage = (
  index: number,
  totalImages: number,
  isAboveFold: boolean = false,
) => {
  if (isAboveFold && index < 2) return true;

  if (index === 0) return true;

  return false;
};

export const createSizesAttribute = (
  breakpoints: { [key: string]: string } = {},
) => {
  const defaultBreakpoints = {
    "(max-width: 640px)": "100vw",
    "(max-width: 768px)": "100vw",
    "(max-width: 1024px)": "50vw",
    "(max-width: 1280px)": "33vw",
    default: "25vw",
  };

  const finalBreakpoints = { ...defaultBreakpoints, ...breakpoints };

  return Object.entries(finalBreakpoints)
    .map(([query, size]) => (query === "default" ? size : `${query} ${size}`))
    .join(", ");
};

export const optimizeForLCP = (
  imageData: any,
  options: {
    isLCP?: boolean;
    viewport?: "mobile" | "tablet" | "desktop";
    aspectRatio?: number;
  } = {},
) => {
  const { isLCP = false, viewport = "desktop", aspectRatio } = options;

  const viewportSizes = {
    mobile: 768,
    tablet: 1024,
    desktop: 1440,
  };

  const width = viewportSizes[viewport];
  const height = aspectRatio ? Math.round(width / aspectRatio) : undefined;

  return {
    src: getOptimizedImageUrl(imageData, "hero", {
      width,
      height,
      quality: isLCP ? 90 : 85,
      loading: isLCP ? "eager" : "lazy",
      priority: isLCP,
      sizes: isLCP
        ? "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1440px"
        : undefined,
    }),
    width,
    height,
    priority: isLCP,
    loading: isLCP ? "eager" : "lazy",
  };
};

"use client";

import { useEffect } from "react";
import { preloadCriticalImages } from "@/utils/imageOptimization";

interface ResourcePreloaderProps {
  criticalImages?: string[];
  fonts?: string[];
  stylesheets?: string[];
}

// Функция для проверки существования preload ссылки
const linkExists = (href: string, rel: string): boolean => {
  if (typeof window === "undefined") return false;
  return Array.from(document.head.querySelectorAll(`link[rel="${rel}"]`))
    .some(link => link.getAttribute('href') === href);
};

// Функция для безопасного добавления preload ссылки
const addPreloadLink = (href: string, rel: string, attributes: Record<string, string> = {}) => {
  if (typeof window === "undefined" || linkExists(href, rel)) return;

  const link = document.createElement("link");
  link.rel = rel;
  link.href = href;
  
  // Добавляем дополнительные атрибуты
  Object.entries(attributes).forEach(([key, value]) => {
    link.setAttribute(key, value);
  });
  
  document.head.appendChild(link);
};

export default function ResourcePreloader({
  criticalImages = [],
  fonts = [],
  stylesheets = [],
}: ResourcePreloaderProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Предзагружаем только критические изображения (первые 2)
    if (criticalImages.length > 0) {
      const limitedImages = criticalImages.slice(0, 2);
      preloadCriticalImages(limitedImages);
    }

    // Предзагружаем только основные шрифты
    const essentialFonts = fonts.slice(0, 2); // Ограничиваем количество
    essentialFonts.forEach((font) => {
      addPreloadLink(font, "preload", {
        as: "font",
        type: "font/woff2",
        crossorigin: "anonymous"
      });
    });

    // DNS prefetch для внешних доменов
    const externalDomains = ["res.cloudinary.com", "admin.dilavia.by"];

    externalDomains.forEach((domain) => {
      addPreloadLink(`//${domain}`, "dns-prefetch");
    });

    // Preconnect для критических доменов
    const criticalDomains = [
      "https://res.cloudinary.com",
      "https://admin.dilavia.by",
    ];

    criticalDomains.forEach((domain) => {
      addPreloadLink(domain, "preconnect");
    });
  }, [criticalImages, fonts, stylesheets]);

  return null; // Этот компонент не рендерит ничего
}

// Хук для оптимизации загрузки ресурсов
export function useResourcePreloader(resources: ResourcePreloaderProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const { criticalImages = [], fonts = [], stylesheets = [] } = resources;

    // Предзагружаем только критические изображения
    if (criticalImages.length > 0) {
      const limitedImages = criticalImages.slice(0, 2);
      preloadCriticalImages(limitedImages);
    }

    // Предзагружаем только основные шрифты
    const essentialFonts = fonts.slice(0, 2);
    essentialFonts.forEach((font) => {
      addPreloadLink(font, "preload", {
        as: "font",
        type: "font/woff2",
        crossorigin: "anonymous"
      });
    });
  }, [resources]);
}

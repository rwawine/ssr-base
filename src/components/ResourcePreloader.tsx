'use client';

import { useEffect } from 'react';
import { preloadCriticalImages } from '@/utils/imageOptimization';

interface ResourcePreloaderProps {
  criticalImages?: string[];
  fonts?: string[];
  stylesheets?: string[];
}

export default function ResourcePreloader({ 
  criticalImages = [], 
  fonts = [], 
  stylesheets = [] 
}: ResourcePreloaderProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Предзагружаем критические изображения
    if (criticalImages.length > 0) {
      preloadCriticalImages(criticalImages);
    }

    // Предзагружаем шрифты
    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.href = font;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Предзагружаем стили
    stylesheets.forEach(stylesheet => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = stylesheet;
      document.head.appendChild(link);
    });

    // DNS prefetch для внешних доменов
    const externalDomains = [
      'res.cloudinary.com',
      'admin.dilavia.by'
    ];

    externalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });

    // Preconnect для критических доменов
    const criticalDomains = [
      'https://res.cloudinary.com',
      'https://admin.dilavia.by'
    ];

    criticalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });

  }, [criticalImages, fonts, stylesheets]);

  return null; // Этот компонент не рендерит ничего
}

// Хук для оптимизации загрузки ресурсов
export function useResourcePreloader(resources: ResourcePreloaderProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const { criticalImages = [], fonts = [], stylesheets = [] } = resources;

    // Предзагружаем критические изображения
    if (criticalImages.length > 0) {
      preloadCriticalImages(criticalImages);
    }

    // Предзагружаем шрифты
    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.href = font;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Предзагружаем стили
    stylesheets.forEach(stylesheet => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = stylesheet;
      document.head.appendChild(link);
    });

  }, [resources]);
} 
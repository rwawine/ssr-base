# Оптимизация LCP (Largest Contentful Paint) - Руководство

## 🎯 Обзор

Этот проект включает комплексную оптимизацию LCP (Largest Contentful Paint) - одного из ключевых метрик Core Web Vitals. LCP измеряет время, необходимое для отображения самого большого элемента контента на странице.

## 📊 Четыре части LCP для изображений

### 1. TTFB (Time to First Byte)
- **Что это**: Время от начала загрузки страницы до получения первого байта HTML
- **Оптимизация**: Настроены HTTP заголовки, DNS prefetch, preconnect

### 2. Задержка загрузки (Resource Load Delay)
- **Что это**: Время между TTFB и началом загрузки ресурса LCP
- **Оптимизация**: Предзагрузка критических изображений, приоритетная загрузка

### 3. Время загрузки (Resource Load Time)
- **Что это**: Время загрузки самого ресурса LCP
- **Оптимизация**: Оптимизация через Cloudinary, современные форматы (WebP/AVIF)

### 4. Задержка рендеринга (Element Render Delay)
- **Что это**: Время между завершением загрузки и полной визуализацией
- **Оптимизация**: Next.js Image компонент, предустановленные размеры

## 🚀 Быстрый старт

### 1. Использование оптимизированных компонентов

```tsx
import { LCPImage, ProductImage, ThumbnailImage } from '@/components/OptimizedImage';

// Для LCP изображений (герои, баннеры)
<LCPImage
  src="/hero-image.jpg"
  alt="Главное изображение"
  width={1440}
  height={600}
  isLCP={true}
  priority={true}
/>

// Для изображений продуктов
<ProductImage
  src="/product-image.jpg"
  alt="Продукт"
  width={400}
  height={300}
  quality={80}
/>

// Для миниатюр
<ThumbnailImage
  src="/thumbnail.jpg"
  alt="Миниатюра"
  width={300}
  height={200}
/>
```

### 2. Предзагрузка критических ресурсов

```tsx
import ResourcePreloader from '@/components/ResourcePreloader';

<ResourcePreloader
  criticalImages={[
    '/hero-image-1.jpg',
    '/hero-image-2.jpg'
  ]}
  fonts={[
    '/fonts/LTSuperior-Regular.woff2',
    '/fonts/LTSuperior-Medium.woff2'
  ]}
/>
```

### 3. Мониторинг Web Vitals

```tsx
import WebVitalsMonitor from '@/components/WebVitalsMonitor';

<WebVitalsMonitor
  onLCP={(metric) => {
    console.log('LCP:', metric.value, 'ms');
    // Отправка в аналитику
  }}
  debug={true}
/>
```

## 🛠️ Утилиты оптимизации

### imageOptimization.ts

```typescript
import { 
  optimizeForLCP, 
  preloadCriticalImages, 
  createSrcSet,
  getOptimizedImageUrl 
} from '@/utils/imageOptimization';

// Оптимизация для LCP
const lcpImage = optimizeForLCP(imageData, {
  isLCP: true,
  viewport: 'desktop',
  aspectRatio: 16/9
});

// Предзагрузка изображений
preloadCriticalImages(['/image1.jpg', '/image2.jpg']);

// Создание srcset
const srcSet = createSrcSet(imageData, [300, 600, 900, 1200]);

// Получение оптимизированного URL
const optimizedUrl = getOptimizedImageUrl(imageData, 'hero', {
  width: 1440,
  quality: 90
});
```

## 📈 Мониторинг производительности

### Lighthouse
```bash
# Запуск Lighthouse
npx lighthouse https://dilavia.by --only-categories=performance

# Или через Chrome DevTools
# F12 -> Lighthouse -> Performance
```

### Web Vitals в консоли
```typescript
// Добавьте в layout.tsx или _app.tsx
import WebVitalsMonitor from '@/components/WebVitalsMonitor';

<WebVitalsMonitor
  onLCP={(metric) => {
    console.log(`LCP: ${metric.value}ms (${metric.rating})`);
  }}
  debug={process.env.NODE_ENV === 'development'}
/>
```

## 🎯 Целевые значения

| Метрика | Хорошо | Требует улучшения | Плохо |
|---------|--------|-------------------|-------|
| LCP     | < 2.5s | 2.5s - 4.0s      | > 4.0s |
| TTFB    | < 800ms| 800ms - 1.8s     | > 1.8s |
| FCP     | < 1.8s | 1.8s - 3.0s      | > 3.0s |

## 🔧 Конфигурация

### next.config.ts
```typescript
const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 дней
  },
  async headers() {
    return [
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
      },
    ];
  },
};
```

## 📋 Чек-лист оптимизации

### ✅ Реализовано
- [x] Оптимизированные компоненты изображений
- [x] Предзагрузка критических ресурсов
- [x] DNS prefetch и preconnect
- [x] HTTP заголовки для кэширования
- [x] Адаптивные изображения
- [x] Современные форматы (WebP/AVIF)
- [x] Мониторинг Web Vitals
- [x] Оптимизация через Cloudinary

### 🔄 Рекомендуется добавить
- [ ] Service Worker для кэширования
- [ ] Критический CSS inline
- [ ] Gzip/Brotli сжатие
- [ ] HTTP/2 на сервере
- [ ] CDN для статических ресурсов
- [ ] Оптимизация шрифтов (font-display: swap)

## 🐛 Отладка

### Проверка LCP элемента
```javascript
// В консоли браузера
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];
  console.log('LCP Element:', lastEntry.element);
  console.log('LCP URL:', lastEntry.url);
  console.log('LCP Time:', lastEntry.startTime);
}).observe({entryTypes: ['largest-contentful-paint']});
```

### Проверка загрузки изображений
```javascript
// В консоли браузера
performance.getEntriesByType('resource')
  .filter(entry => entry.initiatorType === 'img')
  .forEach(img => {
    console.log(`${img.name}: ${img.duration}ms`);
  });
```

## 📚 Дополнительные ресурсы

- [Web Vitals](https://web.dev/vitals/)
- [LCP Optimization](https://web.dev/lcp/)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

## 🤝 Вклад в проект

1. Запустите тесты производительности
2. Проверьте метрики в Lighthouse
3. Убедитесь, что LCP < 2.5s
4. Добавьте новые оптимизации в документацию

## 📞 Поддержка

При возникновении проблем с производительностью:
1. Проверьте консоль браузера на ошибки
2. Запустите Lighthouse анализ
3. Проверьте Network tab в DevTools
4. Обратитесь к документации выше

---

**Результат**: Оптимизация LCP должна улучшить показатели Core Web Vitals и общий пользовательский опыт сайта. 
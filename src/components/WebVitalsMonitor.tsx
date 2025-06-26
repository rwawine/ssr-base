'use client';

import { useEffect } from 'react';

interface Metric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType?: string;
}

interface WebVitalsMonitorProps {
  onLCP?: (metric: Metric) => void;
  onFID?: (metric: Metric) => void;
  onCLS?: (metric: Metric) => void;
  onFCP?: (metric: Metric) => void;
  onTTFB?: (metric: Metric) => void;
  debug?: boolean;
}

export default function WebVitalsMonitor({
  onLCP,
  onFID,
  onCLS,
  onFCP,
  onTTFB,
  debug = false
}: WebVitalsMonitorProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Простой мониторинг LCP через Performance API
    const measureLCP = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry;
          
          if (lastEntry && lastEntry.entryType === 'largest-contentful-paint') {
            const lcpEntry = lastEntry as any;
            const metric: Metric = {
              id: 'lcp-' + Date.now(),
              name: 'LCP',
              value: lcpEntry.startTime,
              rating: getMetricRating(lcpEntry.startTime, 'LCP'),
              delta: 0,
              navigationType: 'navigation'
            };

            if (debug) {
              console.log('LCP measured:', metric);
            }
            onLCP?.(metric);
          }
        });

        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      }
    };

    // Простой мониторинг TTFB
    const measureTTFB = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const navigationEntry = entries.find(entry => entry.entryType === 'navigation') as any;
          
          if (navigationEntry) {
            const metric: Metric = {
              id: 'ttfb-' + Date.now(),
              name: 'TTFB',
              value: navigationEntry.responseStart - navigationEntry.requestStart,
              rating: getMetricRating(navigationEntry.responseStart - navigationEntry.requestStart, 'TTFB'),
              delta: 0,
              navigationType: 'navigation'
            };

            if (debug) {
              console.log('TTFB measured:', metric);
            }
            onTTFB?.(metric);
          }
        });

        observer.observe({ entryTypes: ['navigation'] });
      }
    };

    // Простой мониторинг FCP
    const measureFCP = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.entryType === 'paint' && (entry as any).name === 'first-contentful-paint') as any;
          
          if (fcpEntry) {
            const metric: Metric = {
              id: 'fcp-' + Date.now(),
              name: 'FCP',
              value: fcpEntry.startTime,
              rating: getMetricRating(fcpEntry.startTime, 'FCP'),
              delta: 0,
              navigationType: 'navigation'
            };

            if (debug) {
              console.log('FCP measured:', metric);
            }
            onFCP?.(metric);
          }
        });

        observer.observe({ entryTypes: ['paint'] });
      }
    };

    // Запускаем измерения
    measureLCP();
    measureTTFB();
    measureFCP();

  }, [onLCP, onFID, onCLS, onFCP, onTTFB, debug]);

  return null; // Этот компонент не рендерит ничего
}

// Хук для использования Web Vitals
export function useWebVitals(callbacks: {
  onLCP?: (metric: Metric) => void;
  onFID?: (metric: Metric) => void;
  onCLS?: (metric: Metric) => void;
  onFCP?: (metric: Metric) => void;
  onTTFB?: (metric: Metric) => void;
  debug?: boolean;
}) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Простая реализация без web-vitals
    if (callbacks.onLCP) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        
        if (lastEntry && lastEntry.entryType === 'largest-contentful-paint') {
          const lcpEntry = lastEntry as any;
          const metric: Metric = {
            id: 'lcp-' + Date.now(),
            name: 'LCP',
            value: lcpEntry.startTime,
            rating: getMetricRating(lcpEntry.startTime, 'LCP'),
            delta: 0,
            navigationType: 'navigation'
          };
          callbacks.onLCP!(metric);
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }

  }, [callbacks]);
}

// Утилита для отправки метрик в аналитику
export const sendWebVitalsToAnalytics = (metric: Metric) => {
  // Пример отправки в Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }

  // Пример отправки в собственную аналитику
  if (typeof window !== 'undefined') {
    fetch('/api/web-vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    }).catch(console.error);
  }
};

// Утилита для получения рейтинга метрики
export const getMetricRating = (value: number, metricName: string): 'good' | 'needs-improvement' | 'poor' => {
  const thresholds = {
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 },
  };

  const metric = thresholds[metricName as keyof typeof thresholds];
  if (!metric) return 'needs-improvement';

  if (value <= metric.good) return 'good';
  if (value <= metric.poor) return 'needs-improvement';
  return 'poor';
}; 
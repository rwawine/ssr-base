'use client';

import React, { useEffect, useState, useRef } from 'react';
import styles from './MarqueeBlock.module.css';
import { MarqueeApiResponse, MarqueeItem } from '@/types/marquee';
import { fetchMarqueeData } from '@/utils/fetchMarqueeData';

interface MarqueeBlockFallbackProps {
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
  showLoading?: boolean;
}

export default function MarqueeBlockFallback({
  className = '',
  speed = 30,
  pauseOnHover = true,
  showLoading = true,
}: MarqueeBlockFallbackProps) {
  const [data, setData] = useState<MarqueeApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const marqueeData = await fetchMarqueeData();
        setData(marqueeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке данных');
        console.error('MarqueeBlock error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  const animationStyle = {
    animationDuration: `${speed}s`,
    animationPlayState: isPaused ? 'paused' : 'running',
  };

  const renderMarqueeItem = (item: MarqueeItem, index: number) => {
    if (item.__component === 'shared.title-item') {
      return (
        <div key={`title-${item.id}-${index}`} className={styles.marqueeTitle}>
          {item.text}
        </div>
      );
    }

    if (item.__component === 'shared.slide-item') {
      return (
        <div key={`slide-${item.id}-${index}`} className={styles.marqueeItem}>
          <img
            src={item.imageUrl.url}
            alt={item.imageUrl.alternativeText || `Изображение ${index + 1}`}
            width={60}
            height={60}
            className={styles.marqueeImage}
            loading={index < 3 ? 'eager' : 'lazy'}
          />
          <div className={styles.marqueeText}>
            {item.imageUrl.caption || `Мебель ${index + 1}`}
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading && showLoading) {
    return (
      <div className={`${styles.marqueeContainer} ${className}`}>
        <div className={styles.marqueeWrapper} style={animationStyle}>
          {[...Array(6)].map((_, index) => (
            <div key={`loading-${index}`} className={styles.marqueeItem}>
              <div className={styles.marqueeImage} style={{ backgroundColor: '#f0f0f0' }} />
              <div className={styles.marqueeText}>Загрузка...</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.marqueeContainer} ${className}`}>
        <div className={styles.marqueeWrapper} style={animationStyle}>
          <div className={styles.marqueeTitle} style={{ color: '#e74c3c' }}>
            Ошибка загрузки данных
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.data.item.length) {
    return (
      <div className={`${styles.marqueeContainer} ${className}`}>
        <div className={styles.marqueeWrapper} style={animationStyle}>
          <div className={styles.marqueeTitle}>
            Нет данных для отображения
          </div>
        </div>
      </div>
    );
  }

  const duplicatedItems = [...data.data.item, ...data.data.item];

  return (
    <div 
      className={`${styles.marqueeContainer} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={wrapperRef}
        className={styles.marqueeWrapper} 
        style={animationStyle}
      >
        {duplicatedItems.map((item, index) => renderMarqueeItem(item, index))}
      </div>
    </div>
  );
} 
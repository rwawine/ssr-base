"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "./MarqueeBlock.module.css";
import { MarqueeApiResponse, MarqueeItem } from "@/types/marquee";
import { fetchMarqueeData } from "@/utils/fetchMarqueeData";

interface MarqueeBlockProps {
  className?: string;
  speed?: number; // Скорость анимации в секундах
  showLoading?: boolean;
}

export default function MarqueeBlock({
  className = "",
  speed = 120,
  showLoading = true,
}: MarqueeBlockProps) {
  const [data, setData] = useState<MarqueeApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const marqueeData = await fetchMarqueeData();
        setData(marqueeData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Произошла ошибка при загрузке данных",
        );
        console.error("MarqueeBlock error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Динамические стили для анимации
  const animationStyle = {
    animationDuration: `${speed}s`,
    animationPlayState: "running",
  };

  // Функция для рендера элемента marquee
  const renderMarqueeItem = (item: MarqueeItem, index: number) => {
    if (item.__component === "shared.title-item") {
      return (
        <div key={`title-${item.id}-${index}`} className={styles.marqueeTitle}>
          {item.text}
        </div>
      );
    }

    if (item.__component === "shared.slide-item") {
      return (
        <div key={`slide-${item.id}-${index}`} className={styles.marqueeItem}>
          <Image
            src={item.imageUrl.url}
            alt={item.imageUrl.alternativeText || `Изображение ${index + 1}`}
            width={340}
            height={420}
            className={styles.marqueeImage}
            priority={index < 3}
            quality={90}
            draggable={false}
            style={{ userSelect: "none" }}
          />
        </div>
      );
    }

    return null;
  };

  // Состояние загрузки
  if (loading && showLoading) {
    return (
      <div className={`${styles.marqueeContainer} ${className}`}>
        <div className={styles.marqueeWrapper} style={animationStyle}>
          {[...Array(6)].map((_, index) => (
            <div key={`loading-${index}`} className={styles.marqueeItem}>
              <div
                className={styles.marqueeImage}
                style={{
                  backgroundColor: "#f0f0f0",
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <div className={`${styles.marqueeContainer} ${className}`}>
        <div className={styles.marqueeWrapper} style={animationStyle}>
          <div className={styles.marqueeTitle} style={{ color: "#e74c3c" }}>
            Ошибка загрузки данных
          </div>
        </div>
      </div>
    );
  }

  // Если данных нет
  if (!data || !data.data.item.length) {
    return (
      <div className={`${styles.marqueeContainer} ${className}`}>
        <div className={styles.marqueeWrapper} style={animationStyle}>
          <div className={styles.marqueeTitle}>Нет данных для отображения</div>
        </div>
      </div>
    );
  }

  // Создаем дублированный массив для бесконечного скролла
  const duplicatedItems = [...data.data.item, ...data.data.item];

  return (
    <div className={`${styles.marqueeContainer} ${className}`}>
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

export { MarqueeBlock };

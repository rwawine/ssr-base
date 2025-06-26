import React from "react";
import Image from "next/image";
import styles from "./MarqueeBlock.module.css";
import { MarqueeApiResponse, MarqueeItem } from "@/types/marquee";

interface MarqueeBlockSSRProps {
  data: MarqueeApiResponse;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
}

export default function MarqueeBlockSSR({
  data,
  className = "",
  speed = 30,
  pauseOnHover = true,
}: MarqueeBlockSSRProps) {
  // Функция для рендера элемента marquee
  const renderMarqueeItem = (item: MarqueeItem, index: number) => {
    if (item.__component === "shared.title-item") {
      return (
        <div key={`title-${item.id}`} className={styles.marqueeTitle}>
          {item.text}
        </div>
      );
    }

    if (item.__component === "shared.slide-item") {
      return (
        <div key={`slide-${item.id}`} className={styles.marqueeItem}>
          <Image
            src={item.imageUrl.url}
            alt={item.imageUrl.alternativeText || `Изображение ${index + 1}`}
            width={60}
            height={60}
            className={styles.marqueeImage}
            priority={index < 3}
            quality={85}
          />
          <div className={styles.marqueeText}>
            {item.imageUrl.caption || `Мебель ${index + 1}`}
          </div>
        </div>
      );
    }

    return null;
  };

  // Если данных нет
  if (!data || !data.data.item.length) {
    return (
      <div className={`${styles.marqueeContainer} ${className}`}>
        <div
          className={styles.marqueeWrapper}
          style={{ animationDuration: `${speed}s` }}
        >
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
        className={styles.marqueeWrapper}
        style={{ animationDuration: `${speed}s` }}
      >
        {duplicatedItems.map((item, index) => renderMarqueeItem(item, index))}
      </div>
    </div>
  );
}

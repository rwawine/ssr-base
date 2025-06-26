"use client";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Product } from "@/types/product";
import styles from "./PopularProduct.module.css";

interface PopularProductClientProps {
  products: Product[];
}

export default function PopularProductClient({
  products,
}: PopularProductClientProps) {
  const swiperRef = useRef<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleSwiper = (swiper: any) => {
    swiperRef.current = swiper;
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
    swiper.on("slideChange", () => {
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    });
  };

  // Находим существующие элементы для обновления
  const prevBtn = useRef<HTMLButtonElement | null>(null);
  const nextBtn = useRef<HTMLButtonElement | null>(null);
  const gridSlider = useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    // Находим элементы
    prevBtn.current = document.querySelector(
      ".popular-swiper-prev",
    ) as HTMLButtonElement;
    nextBtn.current = document.querySelector(
      ".popular-swiper-next",
    ) as HTMLButtonElement;
    gridSlider.current = document.querySelector(
      `.${styles.gridSlider}`,
    ) as HTMLDivElement;

    if (gridSlider.current) {
      // Скрываем статичную сетку
      gridSlider.current.style.display = "none";
    }
  }, []);

  // Обновляем состояние кнопок
  React.useEffect(() => {
    if (prevBtn.current) {
      prevBtn.current.disabled = isBeginning;
      prevBtn.current.setAttribute("aria-disabled", isBeginning.toString());
    }
    if (nextBtn.current) {
      nextBtn.current.disabled = isEnd;
      nextBtn.current.setAttribute("aria-disabled", isEnd.toString());
    }
  }, [isBeginning, isEnd]);

  // Не рендерим Swiper если нет товаров
  if (products.length === 0) {
    return null;
  }

  return (
    <Swiper
      modules={[Navigation]}
      navigation={{
        nextEl: ".popular-swiper-next",
        prevEl: ".popular-swiper-prev",
      }}
      slidesPerView={4}
      spaceBetween={24}
      breakpoints={{
        0: { slidesPerView: 1 },
        600: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1400: { slidesPerView: 4 },
      }}
      className={styles.gridSlider}
      style={{ display: "block" }}
      onSwiper={handleSwiper}
    >
      {products.map((product) => (
        <SwiperSlide key={product.id} className={styles.gridItem}>
          {/* Используем тот же ProductCard что и в SSR */}
          <div className={styles.productCard}>
            <div className={styles.productImage}>
              <img
                src={product.images?.[0] || "/images/no-image.png"}
                alt={product.name}
              />
            </div>
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{product.name}</h3>
              <div className={styles.productPrice}>
                {product.price?.current && (
                  <span className={styles.currentPrice}>
                  {product.price.current.toLocaleString("ru-RU")} BYN
                  </span>
                )}
                {product.price?.old && (
                  <span className={styles.oldPrice}>
                    {product.price.old.toLocaleString("ru-RU")} BYN
                  </span>
                )}
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

"use client";
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from '@/components/productCard/ProductCard';
import { Product } from '@/types/product';
import styles from './PopularProduct.module.css';

interface PopularProductSliderProps {
  products: Product[];
}

export default function PopularProductSlider({ products }: PopularProductSliderProps) {
  const swiperRef = useRef<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleSwiper = (swiper: any) => {
    swiperRef.current = swiper;
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
    swiper.on('slideChange', () => {
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    });
  };

  return (
    <>
      <div className={styles.titleRow}>
        <div>
          <h1 className={styles.title}>Диваны в Минске</h1>
          <div className={styles.description}>В интернет-магазине Dilavia.by представлены только тщательно отобранные модели диванов, мягкой и корпусной мебели. Каждая модель из нашего интернет каталога – это воплощение отличного дизайна, легенда мебельной отрасли.</div>
        </div>
        <div className={styles.arrowGroup}>
          <button
            className={styles.arrowBtn + ' ' + styles.arrowBtnInline + ' ' + styles.left + ' popular-swiper-prev'}
            aria-label="Назад"
            disabled={isBeginning}
            aria-disabled={isBeginning}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform: 'rotate(180deg)'}}>
              <path d="M8.54778 18.5408L15.0885 12L8.54778 5.4593C8.49896 5.41049 8.45625 5.35788 8.41964 5.30243C8.18883 4.95287 8.20053 4.49031 8.45472 4.1522C8.48279 4.11487 8.5138 4.07906 8.54778 4.04509C8.65218 3.94069 8.77392 3.8642 8.90373 3.81562C9.0774 3.75062 9.26552 3.73558 9.44588 3.7705C9.63497 3.80711 9.81554 3.89864 9.96199 4.04509L17.2098 11.2929C17.3974 11.4805 17.5027 11.7348 17.5027 12C17.5027 12.2653 17.3974 12.5196 17.2098 12.7072L9.96199 19.955C9.57146 20.3455 8.9383 20.3455 8.54778 19.955C8.49896 19.9062 8.45625 19.8536 8.41964 19.7981C8.16335 19.41 8.20607 18.8825 8.54778 18.5408Z" fill="black"/>
            </svg>
          </button>
          <button
            className={styles.arrowBtn + ' ' + styles.arrowBtnInline + ' ' + styles.right + ' popular-swiper-next'}
            aria-label="Вперёд"
            disabled={isEnd}
            aria-disabled={isEnd}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.54778 18.5408L15.0885 12L8.54778 5.4593C8.49896 5.41049 8.45625 5.35788 8.41964 5.30243C8.18883 4.95287 8.20053 4.49031 8.45472 4.1522C8.48279 4.11487 8.5138 4.07906 8.54778 4.04509C8.65218 3.94069 8.77392 3.8642 8.90373 3.81562C9.0774 3.75062 9.26552 3.73558 9.44588 3.7705C9.63497 3.80711 9.81554 3.89864 9.96199 4.04509L17.2098 11.2929C17.3974 11.4805 17.5027 11.7348 17.5027 12C17.5027 12.2653 17.3974 12.5196 17.2098 12.7072L9.96199 19.955C9.57146 20.3455 8.9383 20.3455 8.54778 19.955C8.49896 19.9062 8.45625 19.8536 8.41964 19.7981C8.16335 19.41 8.20607 18.8825 8.54778 18.5408Z" fill="black"/>
            </svg>
          </button>
        </div>
      </div>
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: '.popular-swiper-next',
          prevEl: '.popular-swiper-prev',
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
        onSwiper={handleSwiper}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className={styles.gridItem}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
} 
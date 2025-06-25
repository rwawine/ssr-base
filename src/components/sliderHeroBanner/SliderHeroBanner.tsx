'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Slide } from '@/utils/fetchHeroSlides';
import { getOptimizedImageUrl } from '@/utils/imageOptimization';
import styles from './SliderHeroBanner.module.css';

interface SliderHeroBannerProps {
    slides: Slide[];
}

export default function SliderHeroBanner({ slides }: SliderHeroBannerProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);
    const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!autoPlay) return;
        
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length, autoPlay]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const goToPrev = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    // Обработчики для мыши
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        setStartX(e.clientX);
        setCurrentX(e.clientX);
        setDragDirection(null);
        setAutoPlay(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        e.stopPropagation();
        setCurrentX(e.clientX);
        
        const diff = startX - e.clientX;
        if (Math.abs(diff) > 10) {
            setDragDirection(diff > 0 ? 'left' : 'right');
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isDragging) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const diff = startX - currentX;
        const threshold = 50; // Увеличиваем порог для предотвращения случайных срабатываний
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                goToNext();
            } else {
                goToPrev();
            }
        }
        
        setIsDragging(false);
        setDragDirection(null);
        setAutoPlay(true);
    };

    const handleMouseLeave = (e: React.MouseEvent) => {
        if (isDragging) {
            e.preventDefault();
            setIsDragging(false);
            setDragDirection(null);
            setAutoPlay(true);
        }
    };

    // Обработчики для сенсорных устройств
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
        setCurrentX(e.touches[0].clientX);
        setDragDirection(null);
        setAutoPlay(false);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        setCurrentX(e.touches[0].clientX);
        
        const diff = startX - e.touches[0].clientX;
        if (Math.abs(diff) > 10) {
            setDragDirection(diff > 0 ? 'left' : 'right');
        }
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        
        const diff = startX - currentX;
        const threshold = 50; // Минимальное расстояние для свайпа
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                goToNext();
            } else {
                goToPrev();
            }
        }
        
        setIsDragging(false);
        setDragDirection(null);
        setAutoPlay(true);
    };

    if (!slides || slides.length === 0) {
        return (
            <div className={styles.hero}>
                <div className={styles.skeletonHero}>
                    <div className={styles.skeletonSlide} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.hero}>
            <div 
                ref={sliderRef}
                className={styles.sliderContent}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {slides.map((slide, index) => {
                    const optimizedImageUrl = getOptimizedImageUrl(slide.image[0]);
                    
                    return (
                        <div
                            key={slide.id || index}
                            className={`${styles.slide} ${
                                index === currentSlide ? styles.slideActive : styles.slideHidden
                            }`}
                            style={optimizedImageUrl ? { backgroundImage: `url(${optimizedImageUrl})` } : undefined}
                        >
                            <div className={styles.content}>
                                <h2 className={styles.title}>{slide.title}</h2>
                                <p className={styles.description}>{slide.description}</p>
                                <Link href={slide.buttonLink} className={styles.button} title={slide.buttonText}>
                                    {slide.buttonText}
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Навигация */}
            <div className={styles.navigation}>
                <button 
                    className={styles.prevBtn} 
                    onClick={goToPrev}
                    aria-label="Предыдущий слайд"
                >
                    ‹
                </button>
                <button 
                    className={styles.nextBtn} 
                    onClick={goToNext}
                    aria-label="Следующий слайд"
                >
                    ›
                </button>
            </div>

            {/* Буллеты */}
            <div className={styles.bullets}>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.bullet} ${index === currentSlide ? styles.bulletActive : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Перейти к слайду ${index + 1}`}
                    >
                        <div className={styles.bulletBar} />
                    </button>
                ))}
            </div>
        </div>
    );
}
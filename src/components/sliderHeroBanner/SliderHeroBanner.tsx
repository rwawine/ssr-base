'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Slide } from '@/utils/fetchHeroSlides';
import { getOptimizedImageUrl, preloadCriticalImages } from '@/utils/imageOptimization';
import { LCPImage } from '@/components/OptimizedImage';
import styles from './SliderHeroBanner.module.css';

interface SliderHeroBannerProps {
    slides: Slide[];
}

export default function SliderHeroBanner({ slides }: SliderHeroBannerProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const sliderRef = useRef<HTMLDivElement>(null);
    const autoPlayRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const currentX = useRef(0);

    // Предзагружаем критические изображения (первые 2 слайда)
    useEffect(() => {
        if (slides.length > 0 && typeof window !== 'undefined') {
            const criticalImages = slides.slice(0, 2).map(slide => {
                const optimizedUrl = getOptimizedImageUrl(slide.image[0], 'hero', {
                    width: 1440,
                    height: 600,
                    quality: 90
                });
                return optimizedUrl;
            });
            preloadCriticalImages(criticalImages);
        }
    }, [slides]);

    // Автопрокрутка
    useEffect(() => {
        if (!isAutoPlaying || slides.length <= 1) return;

        autoPlayRef.current = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 5000);

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [isAutoPlaying, slides.length]);

    // Обработчики мыши
    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        startX.current = e.clientX;
        setIsAutoPlaying(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        currentX.current = e.clientX;
    };

    const handleMouseUp = () => {
        if (!isDragging.current) return;

        const diff = startX.current - currentX.current;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Свайп влево - следующий слайд
                setCurrentSlide(prev => (prev + 1) % slides.length);
            } else {
                // Свайп вправо - предыдущий слайд
                setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
            }
        }

        isDragging.current = false;
        setIsAutoPlaying(true);
    };

    const handleMouseLeave = () => {
        if (isDragging.current) {
            isDragging.current = false;
            setIsAutoPlaying(true);
        }
    };

    // Обработчики тач
    const handleTouchStart = (e: React.TouchEvent) => {
        isDragging.current = true;
        startX.current = e.touches[0].clientX;
        setIsAutoPlaying(false);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging.current) return;
        currentX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!isDragging.current) return;

        const diff = startX.current - currentX.current;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                setCurrentSlide(prev => (prev + 1) % slides.length);
            } else {
                setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
            }
        }

        isDragging.current = false;
        setIsAutoPlaying(true);
    };

    // Навигация
    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 3000);
    };

    const goToPrev = () => {
        setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 3000);
    };

    const goToNext = () => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 3000);
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
                    const optimizedImageUrl = getOptimizedImageUrl(slide.image[0], 'hero', {
                        width: 1440,
                        height: 600,
                        quality: index === 0 ? 90 : 85 // Первое изображение с максимальным качеством для LCP
                    });

                    return (
                        <div
                            key={slide.id || index}
                            className={`${styles.slide} ${index === currentSlide ? styles.slideActive : styles.slideHidden
                                }`}
                        >
                            {/* Используем LCPImage для первого слайда */}
                            {index === 0 ? (
                                <LCPImage
                                    src={optimizedImageUrl}
                                    alt={slide.title}
                                    width={1440}
                                    height={600}
                                    className={styles.backgroundImage}
                                    isLCP={true}
                                    priority={true}
                                    loading="eager"
                                    quality={90}
                                    sizes="100vw"
                                />
                            ) : (
                                <div
                                    className={styles.backgroundImage}
                                    style={{ backgroundImage: `url(${optimizedImageUrl})` }}
                                />
                            )}

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
            {slides.length > 1 && (
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
            )}

            {/* Буллеты */}
            {slides.length > 1 && (
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
            )}
        </div>
    );
}
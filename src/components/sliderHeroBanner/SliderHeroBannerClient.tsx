"use client";
import { useEffect, useState, useRef } from 'react';
import styles from './SliderHeroBanner.module.css';
import { Slide } from '@/utils/fetchHeroSlides';

const IMAGE_SIZES = {
    desktop: 1920,
    tablet: 1024,
    mobile: 768
};

const getOptimalImageSize = () => {
    if (typeof window === 'undefined') return IMAGE_SIZES.desktop;
    const width = window.innerWidth;
    if (width <= IMAGE_SIZES.mobile) return IMAGE_SIZES.mobile;
    if (width <= IMAGE_SIZES.tablet) return IMAGE_SIZES.tablet;
    return IMAGE_SIZES.desktop;
};

const optimizeImageUrl = (url: string, width: number) => {
    if (!url) return '';
    return url.replace('/upload/', `/upload/w_${width},c_scale,f_auto,q_auto,dpr_auto,fl_progressive/`);
};

interface SliderHeroBannerClientProps {
    slides: Slide[];
}

const AUTOPLAY_DELAY = 10000;

export default function SliderHeroBannerClient({ slides }: SliderHeroBannerClientProps) {
    const [imageSize, setImageSize] = useState(IMAGE_SIZES.desktop);
    const [current, setCurrent] = useState(0);
    const [backgrounds, setBackgrounds] = useState<string[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // --- Swipe logic ---
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const mouseDownX = useRef<number | null>(null);
    const isMouseDown = useRef<boolean>(false);
    const SWIPE_THRESHOLD = 50;

    // Получаем элементы DOM
    const slideElement = useRef<HTMLDivElement>(null);
    const bullets = useRef<NodeListOf<Element> | null>(null);
    const prevBtn = useRef<HTMLButtonElement | null>(null);
    const nextBtn = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const handleResize = () => {
            setImageSize(getOptimalImageSize());
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Progressive background loading
    useEffect(() => {
        // Формируем массив с thumbnail для всех слайдов
        const thumbs = slides.map(slide =>
            slide.image[0]?.formats?.thumbnail?.url ||
            slide.image[0]?.formats?.small?.url ||
            slide.image[0]?.url || ''
        );
        setBackgrounds(thumbs);

        // Для каждого слайда подгружаем large/medium
        slides.forEach((slide, idx) => {
            const large = slide.image[0]?.formats?.large?.url;
            const medium = slide.image[0]?.formats?.medium?.url;
            const small = slide.image[0]?.formats?.small?.url;
            const original = slide.image[0]?.url;
            const best = large || medium || small || original || '';
            if (best && best !== thumbs[idx]) {
                const img = new window.Image();
                img.src = optimizeImageUrl(best, imageSize);
                img.onload = () => {
                    setBackgrounds(prev => {
                        if (prev[idx] !== optimizeImageUrl(best, imageSize)) {
                            const next = [...prev];
                            next[idx] = optimizeImageUrl(best, imageSize);
                            return next;
                        }
                        return prev;
                    });
                };
            }
        });
    }, [slides, imageSize]);

    // Автопрокрутка
    useEffect(() => {
        if (slides.length <= 1) return;
        intervalRef.current && clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            next();
        }, AUTOPLAY_DELAY);
        return () => {
            intervalRef.current && clearInterval(intervalRef.current);
        };
    }, [slides.length, current]);

    const goTo = (idx: number) => setCurrent(idx);
    const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    const next = () => setCurrent((prev) => (prev + 1) % slides.length);

    // Touch events
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = () => {
        if (touchStartX.current !== null && touchEndX.current !== null) {
            const diff = touchStartX.current - touchEndX.current;
            if (diff > SWIPE_THRESHOLD) {
                next();
            } else if (diff < -SWIPE_THRESHOLD) {
                prev();
            }
        }
        touchStartX.current = null;
        touchEndX.current = null;
    };

    // Mouse events
    const handleMouseDown = (e: React.MouseEvent) => {
        isMouseDown.current = true;
        mouseDownX.current = e.clientX;
    };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isMouseDown.current) return;
        touchEndX.current = e.clientX;
    };
    const handleMouseUp = () => {
        if (isMouseDown.current && mouseDownX.current !== null && touchEndX.current !== null) {
            const diff = mouseDownX.current - touchEndX.current;
            if (diff > SWIPE_THRESHOLD) {
                next();
            } else if (diff < -SWIPE_THRESHOLD) {
                prev();
            }
        }
        isMouseDown.current = false;
        mouseDownX.current = null;
        touchEndX.current = null;
    };

    // Обновляем DOM элементы
    useEffect(() => {
        if (slideElement.current) {
            slideElement.current.style.backgroundImage = backgrounds[current] ? `url(${backgrounds[current]})` : '';
        }

        // Обновляем контент
        const titleElement = slideElement.current?.querySelector(`.${styles.title}`);
        const descriptionElement = slideElement.current?.querySelector(`.${styles.description}`);
        const buttonElement = slideElement.current?.querySelector(`.${styles.button}`);

        if (titleElement) titleElement.textContent = slides[current].title;
        if (descriptionElement) descriptionElement.textContent = slides[current].description;
        if (buttonElement) {
            buttonElement.textContent = slides[current].buttonText;
            buttonElement.setAttribute('href', slides[current].buttonLink);
            buttonElement.setAttribute('title', slides[current].buttonText);
        }

        // Обновляем буллеты
        if (bullets.current) {
            bullets.current.forEach((bullet, idx) => {
                const bar = bullet.querySelector(`.${styles.bulletBar}`) as HTMLElement;
                if (bar) {
                    bar.classList.toggle(styles.bulletBarActive, idx === current);
                    if (idx === current) {
                        bar.style.animationDuration = `${AUTOPLAY_DELAY / 1000}s`;
                    } else {
                        bar.style.animationDuration = '';
                    }
                }
            });
        }
    }, [current, backgrounds, slides]);

    // Добавляем обработчики событий к существующим элементам
    useEffect(() => {
        // Находим элементы
        slideElement.current = document.querySelector(`.${styles.slide}`);
        bullets.current = document.querySelectorAll(`.${styles.bullet}`);
        prevBtn.current = document.querySelector(`.${styles.prevBtn}`);
        nextBtn.current = document.querySelector(`.${styles.nextBtn}`);

        // Добавляем обработчики событий
        if (slideElement.current) {
            slideElement.current.addEventListener('touchstart', handleTouchStart as any);
            slideElement.current.addEventListener('touchmove', handleTouchMove as any);
            slideElement.current.addEventListener('touchend', handleTouchEnd as any);
            slideElement.current.addEventListener('mousedown', handleMouseDown as any);
            slideElement.current.addEventListener('mousemove', handleMouseMove as any);
            slideElement.current.addEventListener('mouseup', handleMouseUp as any);
            slideElement.current.addEventListener('mouseleave', handleMouseUp as any);
        }

        if (bullets.current) {
            bullets.current.forEach((bullet, idx) => {
                bullet.addEventListener('click', () => goTo(idx));
            });
        }

        if (prevBtn.current) {
            prevBtn.current.addEventListener('click', prev);
        }

        if (nextBtn.current) {
            nextBtn.current.addEventListener('click', next);
        }

        // Cleanup
        return () => {
            if (slideElement.current) {
                slideElement.current.removeEventListener('touchstart', handleTouchStart as any);
                slideElement.current.removeEventListener('touchmove', handleTouchMove as any);
                slideElement.current.removeEventListener('touchend', handleTouchEnd as any);
                slideElement.current.removeEventListener('mousedown', handleMouseDown as any);
                slideElement.current.removeEventListener('mousemove', handleMouseMove as any);
                slideElement.current.removeEventListener('mouseup', handleMouseUp as any);
                slideElement.current.removeEventListener('mouseleave', handleMouseUp as any);
            }

            if (bullets.current) {
                bullets.current.forEach((bullet, idx) => {
                    bullet.removeEventListener('click', () => goTo(idx));
                });
            }

            if (prevBtn.current) {
                prevBtn.current.removeEventListener('click', prev);
            }

            if (nextBtn.current) {
                nextBtn.current.removeEventListener('click', next);
            }
        };
    }, [slides.length]);

    // Не рендерим ничего, так как работаем с существующими DOM элементами
    return null;
} 
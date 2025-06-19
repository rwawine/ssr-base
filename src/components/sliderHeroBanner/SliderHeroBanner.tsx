"use client";
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { useEffect, useState, useMemo } from 'react'
import 'swiper/css'
import 'swiper/css/pagination'
import styles from './SliderHeroBanner.module.css'
import Link from 'next/link'
import { Slide } from '@/utils/fetchHeroSlides'

// Константы для размеров изображений
const IMAGE_SIZES = {
    desktop: 1920,
    tablet: 1024,
    mobile: 768
}

// Функция для получения оптимального размера изображения
const getOptimalImageSize = () => {
    if (typeof window === 'undefined') return IMAGE_SIZES.desktop;
    const width = window.innerWidth
    if (width <= IMAGE_SIZES.mobile) return IMAGE_SIZES.mobile
    if (width <= IMAGE_SIZES.tablet) return IMAGE_SIZES.tablet
    return IMAGE_SIZES.desktop
}

// Функция для оптимизации URL изображения
const optimizeImageUrl = (url: string, width: number) => {
    if (!url) return ''
    return url.replace('/upload/', `/upload/w_${width},c_scale,f_auto,q_auto,dpr_auto,fl_progressive/`)
}

// Функция для предварительной загрузки изображения
const preloadImage = (url: string) => {
    const img = new Image()
    img.src = url
    return new Promise((resolve) => {
        img.onload = resolve
        img.onerror = resolve
    })
}

interface SliderHeroBannerProps {
    slides: Slide[];
}

export default function SliderHeroBanner({ slides }: SliderHeroBannerProps) {
    const [imageSize, setImageSize] = useState(IMAGE_SIZES.desktop)
    const [firstSlideLoaded, setFirstSlideLoaded] = useState(false)
    const [loading, setLoading] = useState(true)

    // Обработчик изменения размера окна
    useEffect(() => {
        const handleResize = () => {
            setImageSize(getOptimalImageSize())
        }
        handleResize();
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Предзагрузка первого изображения
    useEffect(() => {
        const preload = async () => {
            if (slides[0]) {
                const firstImage = slides[0].image[0]?.formats?.large?.url ||
                    slides[0].image[0]?.formats?.medium?.url ||
                    slides[0].image[0]?.url
                if (firstImage) {
                    await preloadImage(optimizeImageUrl(firstImage, imageSize))
                    setFirstSlideLoaded(true)
                }
            }
            setLoading(false)
        }
        preload()
    }, [slides, imageSize])

    // Мемоизация оптимизированных слайдов
    const optimizedSlides = useMemo(() => {
        return slides.map(slide => {
            const img = slide.image[0]?.formats?.large?.url ||
                slide.image[0]?.formats?.medium?.url ||
                slide.image[0]?.url ||
                ''
            return {
                ...slide,
                optimizedImage: img ? optimizeImageUrl(img, imageSize) : ''
            }
        })
    }, [slides, imageSize])

    if (loading || !firstSlideLoaded) {
        return (
            <div className={styles.hero}>
                <div className={styles.skeletonHero}>
                    <div className={styles.skeletonSlide} />
                </div>
            </div>
        )
    }

    return (
        <div className={styles.hero}>
            <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                centeredSlides={true}
                autoplay={{
                    delay: 10000,
                    disableOnInteraction: false
                }}
                pagination={{
                    clickable: true,
                    el: '.swiper-pagination'
                }}
                className={styles.swiper}
            >
                {optimizedSlides.map((slide) => (
                    <SwiperSlide key={slide.id} className={styles.swiperSlide}>
                        <div
                            className={styles.slide}
                            style={slide.optimizedImage ? { backgroundImage: `url(${slide.optimizedImage})` } : undefined}
                        >
                            <div className={styles.content}>
                                <h2 className={styles.title}>{slide.title}</h2>
                                <p className={styles.description}>{slide.description}</p>
                                <Link href={slide.buttonLink} className={styles.button} title={slide.buttonText}>
                                    {slide.buttonText}
                                </Link>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
                <div className="swiper-pagination"></div>
            </Swiper>
        </div>
    )
}
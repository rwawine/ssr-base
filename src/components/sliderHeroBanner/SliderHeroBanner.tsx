import styles from './SliderHeroBanner.module.css';
import Link from 'next/link';
import { Slide } from '@/utils/fetchHeroSlides';
import SliderHeroBannerClient from './SliderHeroBannerClient';

const IMAGE_SIZES = {
    desktop: 1920,
    tablet: 1024,
    mobile: 768
};

const optimizeImageUrl = (url: string, width: number) => {
    if (!url) return '';
    return url.replace('/upload/', `/upload/w_${width},c_scale,f_auto,q_auto,dpr_auto,fl_progressive/`);
};

interface SliderHeroBannerProps {
    slides: Slide[];
}

export default function SliderHeroBanner({ slides }: SliderHeroBannerProps) {
    if (!slides || slides.length === 0) {
        return (
            <div className={styles.hero}>
                <div className={styles.skeletonHero}>
                    <div className={styles.skeletonSlide} />
                </div>
            </div>
        );
    }

    // Получаем thumbnail для первого слайда для SSR
    const firstSlide = slides[0];
    const firstThumbnail = firstSlide.image[0]?.formats?.thumbnail?.url ||
        firstSlide.image[0]?.formats?.small?.url ||
        firstSlide.image[0]?.url || '';

    // Оптимизируем URL для SSR
    const optimizedThumbnail = firstThumbnail ? optimizeImageUrl(firstThumbnail, IMAGE_SIZES.desktop) : '';

    return (
        <div className={styles.hero}>
            <div className={styles.swiper}>
                <div className={styles.swiperSlide}>
                    <div
                        className={styles.slide}
                        style={optimizedThumbnail ? { backgroundImage: `url(${optimizedThumbnail})` } : undefined}
                    >
                        <div className={styles.content}>
                            <h2 className={styles.title}>{firstSlide.title}</h2>
                            <p className={styles.description}>{firstSlide.description}</p>
                            <Link href={firstSlide.buttonLink} className={styles.button} title={firstSlide.buttonText}>
                                {firstSlide.buttonText}
                            </Link>
                        </div>
                    </div>
                    
                    {/* Кастомные буллеты */}
                    {slides.length > 1 && (
                        <div className={styles.bullets}>
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    className={styles.bullet}
                                    aria-label={`Перейти к слайду ${idx + 1}`}
                                    type="button"
                                >
                                    <div
                                        className={[
                                            styles.bulletBar,
                                            idx === 0 ? styles.bulletBarActive : ''
                                        ].join(' ')}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                    
                    {/* Навигация */}
                    {slides.length > 1 && (
                        <div className={styles.swiperNavigation}>
                            <button aria-label="Prev" className={styles.prevBtn} type="button">
                                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.4637 5.4593L8.923 12L15.4637 18.5408C15.5126 18.5896 15.5553 18.6422 15.5919 18.6976C15.8482 19.0858 15.8054 19.6133 15.4637 19.955C15.0732 20.3455 14.4401 20.3455 14.0495 19.955L6.80168 12.7071C6.61415 12.5196 6.50879 12.2653 6.50879 12C6.50879 11.7348 6.61415 11.4805 6.80168 11.2929L14.0495 4.04509C14.4401 3.65457 15.0732 3.65457 15.4637 4.04509C15.8543 4.43561 15.8543 5.06878 15.4637 5.4593Z" fill="white" />
                                </svg>
                            </button>
                            <button aria-label="Next" className={styles.nextBtn} type="button">
                                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.54778 18.5408L15.0885 12L8.54778 5.4593C8.49896 5.41049 8.45625 5.35788 8.41964 5.30243C8.18883 4.95287 8.20053 4.49031 8.45472 4.1522C8.48279 4.11487 8.5138 4.07906 8.54778 4.04509C8.65218 3.94069 8.77392 3.8642 8.90373 3.81562C9.0774 3.75062 9.26552 3.73558 9.44588 3.7705C9.63497 3.80711 9.81554 3.89864 9.96199 4.04509L17.2098 11.2929C17.3974 11.4805 17.5027 11.7348 17.5027 12C17.5027 12.2653 17.3974 12.5196 17.2098 12.7072L9.96199 19.955C9.57146 20.3455 8.9383 20.3455 8.54778 19.955C8.49896 19.9062 8.45625 19.8536 8.41964 19.7981C8.16335 19.41 8.20607 18.8825 8.54778 18.5408Z" fill="white" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Клиентский компонент для интерактивности */}
            <SliderHeroBannerClient slides={slides} />
        </div>
    );
}
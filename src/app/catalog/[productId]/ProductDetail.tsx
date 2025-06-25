'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';

import { Product, Dimension, AdditionalOption } from '@/types/product';
import { useCart } from '@/hooks/CartContext';
import { useFavorites } from '@/hooks/FavoritesContext';
import ProductCard from '@/components/productCard/ProductCard';
import ProductOptions from '@/components/productCard/ProductOptions';
import styles from './ProductDetail.module.css';
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';
import productCardStyles from '@/components/productCard/ProductCard.module.css';

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

const FavoriteIcon = ({ isActive }: { isActive: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={isActive ? 'currentColor' : 'none'} xmlns="http://www.w3.org/2000/svg">
    <path d="M12.0001 5.58422C10.0401 2.22172 4.41412 2.03922 2.37662 5.04522C0.339119 8.05122 1.94012 13.0652 5.61962 16.1152C8.67862 18.6632 12.0001 21.0002 12.0001 21.0002C12.0001 21.0002 15.3216 18.6632 18.3806 16.1152C22.0601 13.0652 23.6611 8.05122 21.6236 5.04522C19.5861 2.03922 13.9601 2.22172 12.0001 5.58422Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const { addToCart, isInCart, getItemQuantity, updateQuantity, removeFromCart } = useCart();
  const { isInFavorites, toggleFavorite } = useFavorites();
  const router = useRouter();

  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('characteristics');
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const dimensions: Dimension[] = Array.isArray(product?.dimensions) ? product.dimensions.filter(Boolean) : [];
  const [selectedDimension, setSelectedDimension] = useState<Dimension | undefined>(dimensions[0]);

  const [selectedAdditionalOptions, setSelectedAdditionalOptions] = useState<AdditionalOption[]>([]);

  const mainSwiperRef = useRef<any>(null);

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDimensionSelect = (dimension: Dimension) => {
    setSelectedDimension(dimension);
    setSelectedAdditionalOptions([]); // Reset options when dimension changes
  };

  const handleAdditionalOptionToggle = (option: AdditionalOption) => {
    setSelectedAdditionalOptions(prev =>
      prev.some(o => o.name === option.name)
        ? prev.filter(o => o.name !== option.name)
        : [...prev, option]
    );
  };

  const images = product?.images?.length ? product.images : ['/images/no-image.png'];

  const basePrice = selectedDimension?.price ?? product.price?.current ?? 0;
  const additionalOptionsPrice = selectedAdditionalOptions.reduce((sum, option) => sum + (option?.price || 0), 0);
  const currentPrice = basePrice + additionalOptionsPrice;
  const oldPrice = selectedDimension?.oldPrice ?? product.price?.old;

  const cartQuantity = getItemQuantity(product.id, selectedDimension?.id, selectedAdditionalOptions);
  const inCart = cartQuantity > 0;
  const inFavorites = isInFavorites(product.id);

  const handleCartButtonClick = () => {
    if (inCart) {
      router.push('/cart');
    } else {
      addToCart(product, 1, selectedDimension, selectedAdditionalOptions);
    }
  };

  const handleIncrease = () => {
    updateQuantity(product.id, cartQuantity + 1, selectedDimension?.id, selectedAdditionalOptions);
  };

  const handleDecrease = () => {
    if (cartQuantity > 1) {
      updateQuantity(product.id, cartQuantity - 1, selectedDimension?.id, selectedAdditionalOptions);
    } else {
      removeFromCart(product.id, selectedDimension?.id, selectedAdditionalOptions);
    }
  };

  const characteristics: { label: string, value: string | number }[] = [];

  // Static to dynamic mapping of product properties to labels
  const CHARACTERISTIC_LABELS: { [key: string]: string } = {
    configuration: 'Конфигурация',
    filler: 'Наполнитель',
    legs: 'Ножки',
    frame: 'Каркас',
    mechanism: 'Механизм трансформации',
    style: 'Стиль',
    color: 'Цвет',
    country: 'Страна производитель',
    warranty: 'Гарантия',
    manufacturing: 'Срок изготовления',
    materials: 'Материалы',
    features: 'Особенности',
    sleepingPlace: 'Спальное место',
    maxLoad: 'Максимальная нагрузка',
    commercialOffer: 'Коммерческое предложение'
  };

  // Always add dimensions first, as it's dependent on selection
  if (selectedDimension) {
    characteristics.push({
      label: 'Габариты',
      value: `${selectedDimension.length}x${selectedDimension.width}${selectedDimension.height ? `x${selectedDimension.height}` : ''} см`
    });
  }

  // Iterate over all possible characteristics and add them if they exist on the product
  for (const key in CHARACTERISTIC_LABELS) {
    if (Object.prototype.hasOwnProperty.call(product, key)) {
      const value = (product as any)[key];
      if (value !== undefined && value !== null && value !== '') {
        const label = CHARACTERISTIC_LABELS[key];
        let displayValue: string | number;

        if (typeof value === 'boolean') {
          displayValue = value ? 'Да' : 'Нет';
        } else if (Array.isArray(value)) {
          if (key === 'materials') {
            displayValue = value.map(m => m.name).join(', ');
          } else {
            displayValue = value.join(', ');
          }
        } else if (typeof value === 'object' && value !== null) {
          if (key === 'sleepingPlace' && 'width' in value && 'length' in value && value.width && value.length) {
            displayValue = `${value.width}x${value.length} см`;
          } else {
            displayValue = ''; // Don't display empty objects
          }
        } else {
          displayValue = String(value);
        }

        if (displayValue) {
          characteristics.push({ label, value: displayValue });
        }
      }
    }
  }

  const featureItems = [
    { icon: '⭐', text: '5.0 Отзывы покупателей' },
    { icon: '🛡️', text: 'Наличие сертификатов качества' },
    { icon: '📅', text: '1 год Гарантия на товар' },
    { icon: '💰', text: `Выгода до ${(product.price.old && product.price.current) ? (product.price.old - product.price.current).toLocaleString('ru-RU') : 'N/A'} BYN` },
  ];

  // Функции для кастомной навигации
  const handlePrev = () => {
    if (mainSwiperRef.current && mainSwiperRef.current.swiper) {
      mainSwiperRef.current.swiper.slidePrev();
    }
  };
  const handleNext = () => {
    if (mainSwiperRef.current && mainSwiperRef.current.swiper) {
      mainSwiperRef.current.swiper.slideNext();
    }
  };

  return (
    <div className={styles.container}>
      <Breadcrumbs
        items={[
          { label: 'Главная', href: 'https://dilavia.by/' },
          { label: 'Каталог', href: 'https://dilavia.by/catalog' },
          ...(product.category ? [{ label: product.category.name, href: `/catalog?category=${product.category.code}` }] : []),
          { label: product.name }
        ]}
        className={styles.breadcrumbs}
      />

      <div className={styles.productPage}>
        <div className={styles.leftColumn}>
          <div className={styles.gallery}>
            <div className={styles.customSwiperWrapper}>
              <Swiper
                ref={mainSwiperRef}
                modules={[Navigation, Thumbs, Pagination]}
                spaceBetween={10}
                navigation={false} // отключаем стандартные стрелки
                pagination={isMobile ? { clickable: true } : false}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                className={styles.mainSwiper}
                loop={true}
                grabCursor={true}
                onSlideChange={swiper => setActiveIndex(swiper.realIndex)}
                onAfterInit={swiper => setActiveIndex(swiper.realIndex)}
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img 
                      src={image} 
                      className={styles.mainSwiperSlide}
                      alt={`${product.name} - фото ${index + 1}`}
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Кастомные буллеты */}
              {!isMobile && images.length > 1 && (
                <div className={styles.bullets}>
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      className={styles.bullet}
                      onClick={() => mainSwiperRef.current?.swiper?.slideToLoop(idx)}
                      aria-label={`Перейти к слайду ${idx + 1}`}
                      type="button"
                    >
                      <div
                        className={[
                          styles.bulletBar,
                          idx === activeIndex ? styles.bulletBarActive : ''
                        ].join(' ')}
                      />
                    </button>
                  ))}
                </div>
              )}
              {/* Стрелки всегда видимы */}
              <div className={styles.swiperNavigation}>
                <button aria-label="Prev" onClick={handlePrev} className={styles.prevBtn} type="button">
                  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.4637 5.4593L8.923 12L15.4637 18.5408C15.5126 18.5896 15.5553 18.6422 15.5919 18.6976C15.8482 19.0858 15.8054 19.6133 15.4637 19.955C15.0732 20.3455 14.4401 20.3455 14.0495 19.955L6.80168 12.7071C6.61415 12.5196 6.50879 12.2653 6.50879 12C6.50879 11.7348 6.61415 11.4805 6.80168 11.2929L14.0495 4.04509C14.4401 3.65457 15.0732 3.65457 15.4637 4.04509C15.8543 4.43561 15.8543 5.06878 15.4637 5.4593Z" fill="white" />
                  </svg>
                </button>
                <button aria-label="Next" onClick={handleNext} className={styles.nextBtn} type="button">
                  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.54778 18.5408L15.0885 12L8.54778 5.4593C8.49896 5.41049 8.45625 5.35788 8.41964 5.30243C8.18883 4.95287 8.20053 4.49031 8.45472 4.1522C8.48279 4.11487 8.5138 4.07906 8.54778 4.04509C8.65218 3.94069 8.77392 3.8642 8.90373 3.81562C9.0774 3.75062 9.26552 3.73558 9.44588 3.7705C9.63497 3.80711 9.81554 3.89864 9.96199 4.04509L17.2098 11.2929C17.3974 11.4805 17.5027 11.7348 17.5027 12C17.5027 12.2653 17.3974 12.5196 17.2098 12.7072L9.96199 19.955C9.57146 20.3455 8.9383 20.3455 8.54778 19.955C8.49896 19.9062 8.45625 19.8536 8.41964 19.7981C8.16335 19.41 8.20607 18.8825 8.54778 18.5408Z" fill="white" />
                  </svg>
                </button>
              </div>
            </div>
            
            {!isMobile && (
              <Swiper
                onSwiper={setThumbsSwiper}
                modules={[Thumbs]}
                spaceBetween={10}
                slidesPerView={4}
                watchSlidesProgress={true}
                className={styles.thumbsSwiper}
                breakpoints={{
                  480: {
                    slidesPerView: 4,
                  },
                  768: {
                    slidesPerView: 5,
                  },
                  1024: {
                    slidesPerView: 6,
                  }
                }}
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index} className={[
                    styles.thumbSlide,
                    activeIndex === index ? styles.thumbSlideActive : ''
                  ].join(' ')}>
                    <img 
                      src={image} 
                      alt={`${product.name} - миниатюра ${index + 1}`}
                      loading="lazy"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          <div className={styles.infoSection}>
            <div className={styles.tabNav} role="tablist">
              <button
                className={`${styles.tabButton} ${activeTab === 'characteristics' ? styles.active : ''}`}
                onClick={() => setActiveTab('characteristics')}
                role="tab"
                aria-selected={activeTab === 'characteristics'}
                aria-controls="characteristics-panel"
              >
                Характеристики
              </button>
              {product.description && (
                <button
                  className={`${styles.tabButton} ${activeTab === 'description' ? styles.active : ''}`}
                  onClick={() => setActiveTab('description')}
                  role="tab"
                  aria-selected={activeTab === 'description'}
                  aria-controls="description-panel"
                >
                  Описание
                </button>
              )}
            </div>

            {activeTab === 'characteristics' && (
              <div className={styles.tabContent} id="characteristics-panel" role="tabpanel">
                <h2 className={styles.sectionTitle}>Характеристики</h2>
                <ul className={styles.specList}>
                  {characteristics.map(spec => (
                    <li key={spec.label} className={styles.specItem}>
                      <span className={styles.specLabel}>{spec.label}</span>
                      <span className={styles.specValue}>{spec.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'description' && product.description && (
              <div className={styles.tabContent} id="description-panel" role="tabpanel">
                <h2 className={styles.sectionTitle}>Описание</h2>
                <p>{product.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.infoPanel}>
            <h1 className={styles.title}>{product.name}</h1>

            <div className={styles.priceRow}>
              <span className={styles.price}>{currentPrice.toLocaleString('ru-RU')} BYN</span>
              {oldPrice && <span className={styles.oldPrice}>{oldPrice.toLocaleString('ru-RU')} BYN</span>}
            </div>

            <div className={styles.optionsSection}>
              <ProductOptions
                dimensions={dimensions}
                onDimensionSelect={handleDimensionSelect}
                selectedDimension={selectedDimension}
                onAdditionalOptionToggle={handleAdditionalOptionToggle}
                selectedAdditionalOptions={selectedAdditionalOptions}
              />
            </div>

            <div className={styles.actions}>
              {!inCart ? (
                <div className={styles.mainActions}>
                  <button
                    className={styles.addToCartButton}
                    onClick={handleCartButtonClick}
                    aria-label={inCart ? 'Перейти в корзину' : 'Добавить в корзину'}
                  >
                    {inCart ? 'Перейти в корзину' : 'В корзину'}
                  </button>
                </div>
              ) : (
                <div className={productCardStyles.inCartActions}>
                  <button
                    className={productCardStyles.inCartButton}
                    onClick={() => router.push('/cart')}
                  >
                    В корзине {cartQuantity} шт.
                  </button>
                  <div className={productCardStyles.cartCounter}>
                    <button className={productCardStyles.counterBtn} onClick={handleDecrease} aria-label="Уменьшить количество">−</button>
                    <span className={productCardStyles.counterValue}>{cartQuantity}</span>
                    <button className={productCardStyles.counterBtn} onClick={handleIncrease} aria-label="Увеличить количество">+</button>
                  </div>
                </div>
              )}
              <button
                type="button"
                className={styles.favoriteButton}
                onClick={() => toggleFavorite(product)}
                aria-label={inFavorites ? 'Удалить из избранного' : 'Добавить в избранное'}
                aria-pressed={inFavorites}
              >
                <FavoriteIcon isActive={inFavorites} />
              </button>
            </div>

            <div className={styles.infoBlocks}>
              <div className={styles.infoBlock}>
                <span role="img" aria-label="Время изготовления">⏱️</span>
                Срок изготовления: 35-50 рабочих дней
              </div>
              <div className={styles.infoBlock}>
                <span role="img" aria-label="Доставка">🚚</span>
                Экспресс-доставка по всей Беларуси от 3 дней
              </div>
              <div className={styles.infoBlock}>
                <span role="img" aria-label="Безопасность">🔒</span>
                Безопасные виды оплаты и легкий возврат
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className={styles.relatedProducts}>
          <h2 className={styles.sectionTitle}>Похожие товары</h2>
          <div className={styles.relatedProductsGrid}>
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
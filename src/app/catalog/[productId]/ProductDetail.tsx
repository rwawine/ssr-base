'use client';

import React, { useState, useEffect } from 'react';
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
  const { addToCart, isInCart } = useCart();
  const { isInFavorites, toggleFavorite } = useFavorites();
  const router = useRouter();

  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('characteristics');
  const [isMobile, setIsMobile] = useState(false);

  const dimensions: Dimension[] = Array.isArray(product?.dimensions) ? product.dimensions.filter(Boolean) : [];
  const [selectedDimension, setSelectedDimension] = useState<Dimension | undefined>(dimensions[0]);

  const [selectedAdditionalOptions, setSelectedAdditionalOptions] = useState<AdditionalOption[]>([]);

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

  const inCart = isInCart(product.id, selectedDimension?.id, selectedAdditionalOptions);
  const inFavorites = isInFavorites(product.id);

  const handleCartButtonClick = () => {
    if (inCart) {
      router.push('/cart');
    } else {
      addToCart(product, 1, selectedDimension, selectedAdditionalOptions);
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
    { icon: '💰', text: `Выгода до ${(product.price.old && product.price.current) ? (product.price.old - product.price.current).toLocaleString('ru-RU') : 'N/A'} ₽` },
  ];

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link> <span>/</span>
        <Link href="/catalog">Каталог</Link>
        {product.category && (
          <> <span>/</span> <Link href={`/catalog?category=${product.category.code}`}>{product.category.name}</Link> </>
        )}
        <span>/</span> <span className={styles.currentPage}>{product.name}</span>
      </nav>

      <div className={styles.productPage}>
        <div className={styles.leftColumn}>
          <div className={styles.gallery}>
            <Swiper
              modules={[Navigation, Thumbs, Pagination]}
              spaceBetween={10}
              navigation={!isMobile}
              pagination={isMobile ? { clickable: true } : false}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              className={styles.mainSwiper}
              loop={true}
              grabCursor={true}
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img 
                    src={image} 
                    alt={`${product.name} - фото ${index + 1}`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            
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
                  <SwiperSlide key={index} className={styles.thumbSlide}>
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
              <span className={styles.price}>{currentPrice.toLocaleString('ru-RU')} ₽</span>
              {oldPrice && <span className={styles.oldPrice}>{oldPrice.toLocaleString('ru-RU')} ₽</span>}
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
              <div className={styles.mainActions}>
                <button
                  className={`${styles.addToCartButton} ${inCart ? styles.inCart : ''}`}
                  onClick={handleCartButtonClick}
                  aria-label={inCart ? 'Перейти в корзину' : 'Добавить в корзину'}
                >
                  {inCart ? 'Перейти в корзину' : 'В корзину'}
                </button>
              </div>
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
                Экспресс-доставка по всей России от 3 дней
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
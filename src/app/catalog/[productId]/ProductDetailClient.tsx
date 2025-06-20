'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import Link from 'next/link';
import { Product, Dimension } from '@/types/product';
import { useCart } from '@/hooks/CartContext';
import { useFavorites } from '@/hooks/FavoritesContext';
import ProductCard from '@/components/productCard/ProductCard';
import styles from './ProductDetail.module.css';

interface ProductDetailClientProps {
    product: Product;
    relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
    const { addToCart, isInCart, getItemQuantity } = useCart();
    const { isInFavorites, toggleFavorite } = useFavorites();
    const [selectedDimension, setSelectedDimension] = useState<Dimension | undefined>(product.dimensions?.[0]);
    const [selectedOption, setSelectedOption] = useState<any>(null);
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // Проверяем, что компонент загружен на клиенте
    useEffect(() => {
        setIsClient(true);
    }, []);

    const images = Array.isArray(product?.images) && product.images.length > 0 ? product.images : ['/images/no-image.png'];
    const dimensions: Dimension[] = Array.isArray(product?.dimensions) ? product.dimensions.filter(Boolean) : [];
    const minPrice = selectedDimension ? selectedDimension.price + (selectedOption?.price || 0) : (product?.price?.current ?? 0);
    const oldPrice = product?.price?.old ?? null;

    // Проверяем, находится ли товар в корзине
    const inCart = isInCart(product.id, selectedDimension?.id);
    const cartQuantity = getItemQuantity(product.id, selectedDimension?.id);
    // Проверяем, находится ли товар в избранном
    const inFavorites = isInFavorites(product.id);

    // Хлебные крошки
    const breadcrumbs = [
        { name: 'Главная', path: '/' },
        { name: 'Каталог', path: '/catalog' },
        product.category ? { name: product.category.name, path: `/catalog?category=${product.category.code}` } : null,
        product.subcategory ? { name: product.subcategory.name, path: `/catalog?subcategory=${product.subcategory.code}` } : null,
        { name: product.name, path: `/catalog/${product.slug}` }
    ].filter((b): b is { name: string; path: string } => Boolean(b));

    // Краткие характеристики
    const shortSpecs: { label: string, value: string | number }[] = [
        { label: 'Артикул', value: product.id },
        { label: 'Модель', value: product.name },
        { label: 'Гарантия', value: product.warranty || '' },
        { label: 'Цвет', value: product.color || '' },
        { label: 'Страна', value: product.country || '' },
        { label: 'Категория', value: product.category?.name || '' },
        { label: 'Подкатегория', value: product.subcategory?.name || '' },
        { label: 'Размер', value: selectedDimension ? `${selectedDimension.width}x${selectedDimension.length}` : '' },
        { label: 'Особенности', value: product.features && product.features.length > 0 ? product.features.join(', ') : '' },
    ].filter(spec => spec.value !== '');

    // Обработчики
    const handleAddToCart = () => {
        if (dimensions.length > 0 && !selectedDimension) {
            alert('Пожалуйста, выберите размер');
            return;
        }
        addToCart(product, 1, selectedDimension);
    };
    const handleDimensionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [width, length] = e.target.value.split('x').map(Number);
        const dimension = dimensions.find(d => d.width === width && d.length === length);
        setSelectedDimension(dimension);
        setSelectedOption(null);
    };
    const handleOptionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const option = selectedDimension?.additionalOptions?.find(opt => opt.name === e.target.value);
        setSelectedOption(option || null);
    };
    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);

    // Если компонент еще не загружен на клиенте, показываем заглушку
    if (!isClient) {
        return (
            <div className={styles.pageBg}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '400px',
                    fontSize: '18px',
                    color: '#666'
                }}>
                    Загрузка товара...
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageBg}>
            {/* Хлебные крошки */}
            <nav className={styles.breadcrumbs}>
                {breadcrumbs.map((item, idx) => (
                    <span key={item.path}>
                        {idx > 0 && <span className={styles.breadcrumbSep}>/</span>}
                        <Link href={item.path}>{item.name}</Link>
                    </span>
                ))}
            </nav>
            <div className={styles.productGrid}>
                {/* Галерея */}
                <section className={styles.gallerySection}>
                    <div className={styles.galleryCard}>
                        <Swiper
                            spaceBetween={10}
                            navigation={true}
                            thumbs={{ swiper: thumbsSwiper }}
                            modules={[Navigation, Thumbs]}
                            className={styles.mainSwiper}
                            loop={true}
                            onSwiper={(swiper) => {
                                // Безопасная инициализация
                                if (swiper && swiper.el) {
                                    swiper.update();
                                }
                            }}
                        >
                            {images.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <img
                                        src={image}
                                        alt={`${product.name} - фото ${index + 1}`}
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                        onError={(e) => {
                                            // Fallback для битых изображений
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/images/no-image.png';
                                        }}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div className={styles.thumbsWrap}>
                            <Swiper
                                onSwiper={(swiper) => {
                                    setThumbsSwiper(swiper);
                                    // Безопасная инициализация
                                    if (swiper && swiper.el) {
                                        swiper.update();
                                    }
                                }}
                                spaceBetween={8}
                                slidesPerView="auto"
                                watchSlidesProgress={true}
                                modules={[Thumbs]}
                                className={styles.thumbsSwiper}
                            >
                                {images.map((image, index) => (
                                    <SwiperSlide key={index} className={styles.thumbSlide}>
                                        <img
                                            src={image}
                                            alt={`${product.name} - миниатюра ${index + 1}`}
                                            loading="lazy"
                                            onError={(e) => {
                                                // Fallback для битых изображений
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/images/no-image.png';
                                            }}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </section>

                {/* Инфоблок */}
                <section className={styles.infoSection}>
                    <div className={styles.infoCard}>
                        <h1 className={styles.title}>{product.name}</h1>
                        <div className={styles.metaRow}>
                            <span className={styles.metaLabel}>Доступность:</span>
                            <span className={styles.metaValue}>{product.availability}</span>
                            <span className={styles.metaLabel}>Срок изготовления:</span>
                            <span className={styles.metaValue}>{product.manufacturing}</span>
                        </div>
                        <div className={styles.metaRow}>
                            <span className={styles.metaLabel}>Категория:</span>
                            <Link className={styles.categoryLink} href={`/catalog?category=${product.category?.code}`}>{product.category?.name}</Link>
                            {product.subcategory && (
                                <>
                                    <span> / </span>
                                    <Link className={styles.categoryLink} href={`/catalog?subcategory=${product.subcategory.code}`}>{product.subcategory.name}</Link>
                                </>
                            )}
                        </div>
                        <div className={styles.priceRow}>
                            <span className={styles.price}>от {minPrice} BYN</span>
                            {oldPrice && <span className={styles.oldPrice}>{oldPrice} BYN</span>}
                            <button
                                className={`${styles.favoriteButton} ${inFavorites ? styles.active : ''}`}
                                onClick={() => toggleFavorite(product)}
                                aria-label={inFavorites ? 'Удалить из избранного' : 'Добавить в избранное'}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                        fill={inFavorites ? '#FF0000' : 'none'}
                                        stroke={inFavorites ? '#FF0000' : '#000'}
                                        strokeWidth="2"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className={styles.optionsBlock}>
                            {dimensions.length > 1 && (
                                <div className={styles.dimensions}>
                                    <label className={styles.optionsLabel}>Размер:</label>
                                    <select
                                        value={selectedDimension ? `${selectedDimension.width}x${selectedDimension.length}` : ''}
                                        onChange={handleDimensionSelect}
                                        className={styles.dimensionSelect}
                                    >
                                        {dimensions.map((dim) => (
                                            <option key={`${dim.width}x${dim.length}`} value={`${dim.width}x${dim.length}`}>
                                                {dim.width}x{dim.length} см
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {selectedDimension?.additionalOptions && selectedDimension.additionalOptions.length > 0 && (
                                <div className={styles.additionalOptions}>
                                    <label className={styles.optionsLabel}>Дополнительные опции:</label>
                                    <select
                                        value={selectedOption?.name || ''}
                                        onChange={handleOptionSelect}
                                        className={styles.optionSelect}
                                    >
                                        <option value="">Выберите опцию</option>
                                        {selectedDimension.additionalOptions.map((opt) => (
                                            <option key={opt.name} value={opt.name}>{opt.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                        <button
                            className={`${styles.addToCartButton} ${inCart ? styles.inCart : ''}`}
                            onClick={handleAddToCart}
                        >
                            {inCart ? `В корзине (${cartQuantity})` : 'В корзину'}
                        </button>
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Описание</h2>
                            <div className={styles.description}>
                                {product.description && product.description.split(/\n+/).map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                        </div>
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Краткие характеристики</h2>
                            <div className={styles.shortSpecsBlock}>
                                {shortSpecs.map((spec, i) => (
                                    <div key={i} className={styles.shortSpecRow}>
                                        <span className={styles.shortSpecLabel}>{spec.label}</span>
                                        <span className={styles.shortSpecValue}>{spec.value}</span>
                                    </div>
                                ))}
                                <button className={styles.openDrawerBtn} onClick={openDrawer}>
                                    Все характеристики
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Drawer справа */}
            {isDrawerOpen && (
                <div className={styles.drawerOverlay} onClick={closeDrawer}>
                    <div className={styles.drawer} onClick={e => e.stopPropagation()}>
                        <div className={styles.drawerHeader}>
                            <span className={styles.drawerTitle}>Характеристики и описание</span>
                            <button className={styles.drawerClose} onClick={closeDrawer}>×</button>
                        </div>
                        <div className={styles.drawerContent}>
                            {/* Общие характеристики */}
                            <div className={styles.drawerSection}>
                                <h3>Общие характеристики</h3>
                                <div className={styles.drawerRow}><span>Артикул</span><span>{product.id}</span></div>
                                <div className={styles.drawerRow}><span>Модель</span><span>{product.name}</span></div>
                                {product.warranty && <div className={styles.drawerRow}><span>Гарантия</span><span>{product.warranty}</span></div>}
                                {product.category?.name && <div className={styles.drawerRow}><span>Категория</span><span>{product.category.name}</span></div>}
                                {product.subcategory?.name && <div className={styles.drawerRow}><span>Подкатегория</span><span>{product.subcategory.name}</span></div>}
                                {product.color && <div className={styles.drawerRow}><span>Цвет</span><span>{product.color}</span></div>}
                                {product.country && <div className={styles.drawerRow}><span>Страна</span><span>{product.country}</span></div>}
                            </div>
                            {/* Размеры */}
                            {product.dimensions && product.dimensions.length > 0 && (
                                <div className={styles.drawerSection}>
                                    <h3>Размеры</h3>
                                    {product.dimensions.map((dim, idx) => (
                                        <div key={idx} className={styles.drawerRow}>
                                            <span>{dim.width}x{dim.length}{dim.height ? `x${dim.height}` : ''}{dim.depth ? `x${dim.depth}` : ''} мм</span>
                                            <span>{dim.price} BYN</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* Материалы */}
                            {product.materials && product.materials.length > 0 && (
                                <div className={styles.drawerSection}>
                                    <h3>Материалы</h3>
                                    {product.materials.map((mat, idx) => (
                                        <div key={idx} className={styles.drawerRow}>
                                            <span>{mat.name}</span>
                                            <span>{mat.type}{mat.color ? `, ${mat.color}` : ''}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* Доставка */}
                            {product.delivery && (
                                <div className={styles.drawerSection}>
                                    <h3>Доставка</h3>
                                    <div className={styles.drawerRow}><span>Доступность</span><span>{product.delivery.available ? 'Доступна' : 'Недоступна'}</span></div>
                                    <div className={styles.drawerRow}><span>Стоимость</span><span>{product.delivery.cost}</span></div>
                                    <div className={styles.drawerRow}><span>Сроки</span><span>{product.delivery.time}</span></div>
                                </div>
                            )}
                            {/* Рассрочка и кредит */}
                            {product.installmentPlans && product.installmentPlans.length > 0 && (
                                <div className={styles.drawerSection}>
                                    <h3>Рассрочка и кредит</h3>
                                    {product.installmentPlans.map((plan, idx) => (
                                        <div key={idx} className={styles.drawerRow}>
                                            <span>{plan.bank}</span>
                                            <span>Рассрочка: {plan.installment.durationMonths} мес, {plan.installment.interest}, {plan.installment.additionalFees} | Кредит: {plan.credit.durationMonths} мес, {plan.credit.interest}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Похожие товары */}
            {relatedProducts.length > 0 && (
                <div className={styles.relatedProducts}>
                    <h2>Похожие товары</h2>
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
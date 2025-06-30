"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/pagination";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

import { Product, Dimension, AdditionalOption } from "@/types/product";
import { useCart } from "@/hooks/CartContext";
import { useFavorites } from "@/hooks/FavoritesContext";
import { ProductCard } from "@/components/productCard/ProductCard";
import styles from "./ProductDetail.module.css";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import productCardStyles from "@/components/productCard/ProductCard.module.css";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

const FavoriteIcon = ({ isActive }: { isActive: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={isActive ? "currentColor" : "none"}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.0001 5.58422C10.0401 2.22172 4.41412 2.03922 2.37662 5.04522C0.339119 8.05122 1.94012 13.0652 5.61962 16.1152C8.67862 18.6632 12.0001 21.0002 12.0001 21.0002C12.0001 21.0002 15.3216 18.6632 18.3806 16.1152C22.0601 13.0652 23.6611 8.05122 21.6236 5.04522C19.5861 2.03922 13.9601 2.22172 12.0001 5.58422Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ProductDetail({
  product,
  relatedProducts,
}: ProductDetailProps) {
  const {
    addToCart,
    isInCart,
    getItemQuantity,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const { isInFavorites, toggleFavorite } = useFavorites();
  const router = useRouter();

  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const dimensions: Dimension[] = Array.isArray(product?.dimensions)
    ? product.dimensions.filter(Boolean)
    : [];
  const [selectedDimension, setSelectedDimension] = useState<
    Dimension | undefined
  >(dimensions[0]);

  const [selectedAdditionalOptions, setSelectedAdditionalOptions] = useState<
    AdditionalOption[]
  >([]);

  const mainSwiperRef = useRef<any>(null);

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleDimensionSelect = (dimension: Dimension) => {
    setSelectedDimension(dimension);
    setSelectedAdditionalOptions([]); // Reset options when dimension changes
  };

  const handleAdditionalOptionToggle = (option: AdditionalOption) => {
    setSelectedAdditionalOptions((prev) =>
      prev.some((o) => o.name === option.name)
        ? prev.filter((o) => o.name !== option.name)
        : [...prev, option],
    );
  };

  const images = product?.images?.length
    ? product.images
    : ["/images/no-image.png"];

  const basePrice = selectedDimension?.price ?? product.price?.current ?? 0;
  const additionalOptionsPrice = selectedAdditionalOptions.reduce(
    (sum, option) => sum + (option?.price || 0),
    0,
  );
  const currentPrice = basePrice + additionalOptionsPrice;
  const oldPrice = selectedDimension?.oldPrice ?? product.price?.old;

  const cartQuantity = getItemQuantity(
    product.id,
    selectedDimension?.id,
    selectedAdditionalOptions,
  );
  const inCart = cartQuantity > 0;
  const inFavorites = isInFavorites(product.id);

  const handleCartButtonClick = () => {
    if (inCart) {
      router.push("/cart");
    } else {
      addToCart(product, 1, selectedDimension?.id, selectedAdditionalOptions);
    }
  };

  const handleIncrease = () => {
    updateQuantity(
      product.id,
      cartQuantity + 1,
      selectedDimension?.id,
      selectedAdditionalOptions,
    );
  };

  const handleDecrease = () => {
    if (cartQuantity > 1) {
      updateQuantity(
        product.id,
        cartQuantity - 1,
        selectedDimension?.id,
        selectedAdditionalOptions,
      );
    } else {
      removeFromCart(
        product.id,
        selectedDimension?.id,
        selectedAdditionalOptions,
      );
    }
  };

  // Компактные характеристики только по реальным полям
  const shortSpecs: { label: string; value: string | number }[] = [
    { label: "Артикул", value: product.id },
    { label: "Модель", value: product.name },
    { label: "Гарантия", value: product.warranty || "" },
    { label: "Цвет", value: product.color || "" },
    { label: "Страна", value: product.country || "" },
    { label: "Категория", value: product.category?.name || "" },
    { label: "Подкатегория", value: product.subcategory?.name || "" },
    {
      label: "Размер",
      value: selectedDimension
        ? `${selectedDimension.width}x${selectedDimension.length}`
        : "",
    },
    {
      label: "Особенности",
      value:
        product.features && product.features.length > 0
          ? product.features.join(", ")
          : "",
    },
  ].filter((spec) => spec.value !== "");

  const breadcrumbs = [
    { name: "Главная", url: "/" },
    { name: "Каталог", url: "/catalog" },
    ...(product.category
      ? [
          {
            name: product.category.name,
            url: `/catalog?category=${product.category.code}`,
          },
        ]
      : []),
    ...(product.subcategory
      ? [
          {
            name: product.subcategory.name,
            url: `/catalog?category=${product.category?.code}&subcategory=${product.subcategory.code}`,
          },
        ]
      : []),
    { name: product.name, url: `/catalog/${product.slug}` },
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

  // Обработчик клика по миниатюре
  const handleThumbClick = (index: number) => {
    if (isTransitioning || activeIndex === index) return;

    if (mainSwiperRef.current && mainSwiperRef.current.swiper) {
      const swiper = mainSwiperRef.current.swiper;
      setIsTransitioning(true);
      // Используем slideToLoop для корректной работы с loop режимом
      swiper.slideToLoop(index);
      // Принудительно обновляем активный индекс
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    // Кастомный класс для белого фона Fancybox
    const whiteBgClass = "fancybox-white-bg";
    NativeFancybox.bind("[data-fancybox=gallery]", {
      theme: "light",
      mainClass: whiteBgClass,
      Carousel: {
        Thumbs: false,
        Toolbar: {
          display: {
            left: [],
            middle: [],
            right: ["close"],
          },
        },
        Zoomable: {
          Panzoom: {
            maxScale: 4,
            panMode: "mousemove",
            mouseMoveFactor: 2,
          },
        },
      },
      on: {
      },
    });
    return () => {
      NativeFancybox.unbind("[data-fancybox=gallery]");
      document.body.classList.remove(whiteBgClass);
    };
  }, [images]);

  return (
    <div className={styles.container}>
      <Breadcrumbs items={breadcrumbs} />

      <div className={styles.productPage}>
        <div className={styles.gallery}>
          <div className={styles.customSwiperWrapper}>
            <Swiper
              ref={mainSwiperRef}
              modules={[Navigation, Thumbs, Pagination]}
              spaceBetween={10}
              navigation={false} // отключаем стандартные стрелки
              pagination={
                isMobile && images.length > 1 ? { clickable: true } : false
              }
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              className={styles.mainSwiper}
              loop={images.length > 1}
              grabCursor={images.length > 1}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              onAfterInit={(swiper) => setActiveIndex(swiper.realIndex)}
              onSlideChangeTransitionStart={(swiper) => {
                setActiveIndex(swiper.realIndex);
                setIsTransitioning(true);
              }}
              onSlideChangeTransitionEnd={(swiper) => {
                setActiveIndex(swiper.realIndex);
                setIsTransitioning(false);
              }}
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <a
                    data-fancybox="gallery"
                    href={image}
                    data-caption={`${product.name} - фото ${index + 1}`}
                    tabIndex={0}
                  >
                    <img
                      src={image}
                      className={styles.mainSwiperSlide}
                      alt={`${product.name} - фото ${index + 1}`}
                      loading={index === 0 ? "eager" : "lazy"}
                      suppressHydrationWarning
                      style={{ cursor: "zoom-in", background: "#fff" }}
                    />
                  </a>
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
                    onClick={() =>
                      mainSwiperRef.current?.swiper?.slideToLoop(idx)
                    }
                    aria-label={`Перейти к слайду ${idx + 1}`}
                    type="button"
                  >
                    <div
                      className={[
                        styles.bulletBar,
                        idx === activeIndex ? styles.bulletBarActive : "",
                      ].join(" ")}
                    />
                  </button>
                ))}
              </div>
            )}
            {/* Стрелки всегда видимы */}
            {images.length > 1 && (
              <div className={styles.swiperNavigation}>
                <button
                  aria-label="Prev"
                  onClick={handlePrev}
                  className={styles.prevBtn}
                  type="button"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.4637 5.4593L8.923 12L15.4637 18.5408C15.5126 18.5896 15.5553 18.6422 15.5919 18.6976C15.8482 19.0858 15.8054 19.6133 15.4637 19.955C15.0732 20.3455 14.4401 20.3455 14.0495 19.955L6.80168 12.7071C6.61415 12.5196 6.50879 12.2653 6.50879 12C6.50879 11.7348 6.61415 11.4805 6.80168 11.2929L14.0495 4.04509C14.4401 3.65457 15.0732 3.65457 15.4637 4.04509C15.8543 4.43561 15.8543 5.06878 15.4637 5.4593Z"
                      fill="white"
                    />
                  </svg>
                </button>
                <button
                  aria-label="Next"
                  onClick={handleNext}
                  className={styles.nextBtn}
                  type="button"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.54778 18.5408L15.0885 12L8.54778 5.4593C8.49896 5.41049 8.45625 5.35788 8.41964 5.30243C8.18883 4.95287 8.20053 4.49031 8.45472 4.1522C8.48279 4.11487 8.5138 4.07906 8.54778 4.04509C8.65218 3.94069 8.77392 3.8642 8.90373 3.81562C9.0774 3.75062 9.26552 3.73558 9.44588 3.7705C9.63497 3.80711 9.81554 3.89864 9.96199 4.04509L17.2098 11.2929C17.3974 11.4805 17.5027 11.7348 17.5027 12C17.5027 12.2653 17.3974 12.5196 17.2098 12.7072L9.96199 19.955C9.57146 20.3455 8.9383 20.3455 8.54778 19.955C8.49896 19.9062 8.45625 19.8536 8.41964 19.7981C8.16335 19.41 8.20607 18.8825 8.54778 18.5408Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
            )}
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
                },
              }}
            >
              {images.map((image, index) => (
                <SwiperSlide
                  key={index}
                  className={[
                    styles.thumbSlide,
                    activeIndex === index ? styles.thumbSlideActive : "",
                  ].join(" ")}
                  onClick={() => handleThumbClick(index)}
                >
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

        <div className={styles.info}>
          <h1 className={styles.title}>{product.name}</h1>

          <div className={styles.availabilityInfo}>
            <div className={styles.availabilityItem}>
              <span className={styles.label}>Доступность:</span>
              <span className={styles.value}>
                {product.availability || "В наличии"}
              </span>
            </div>
            <div className={styles.categoryLinks}>
              <span>Категории: </span>
              {product.category && product.subcategory && (
                <Link
                  href={`/catalog?category=${product.category.code}&subcategory=${product.subcategory.code}`}
                  className={styles.categoryLink}
                >
                  {product.subcategory.name}
                </Link>
              )}
            </div>
            <div className={styles.availabilityItem}>
              <span className={styles.label}>Срок изготовления:</span>
              <span className={styles.value}>
                {product.manufacturing || "35-50 рабочих дней"}
              </span>
            </div>
          </div>

          <div className={styles.priceContainer}>
            <div className={styles.price}>
              от {currentPrice.toLocaleString("ru-RU")} BYN
              {oldPrice && (
                <span className={styles.oldPrice}>
                  {oldPrice.toLocaleString("ru-RU")} BYN
                </span>
              )}
            </div>
            <button
              className={`${styles.favoriteButton} ${inFavorites ? styles.active : ""}`}
              onClick={() => toggleFavorite(product)}
              aria-label={
                inFavorites ? "Удалить из избранного" : "Добавить в избранное"
              }
              suppressHydrationWarning
            >
              <FavoriteIcon isActive={inFavorites} />
            </button>
          </div>

          <div className={styles.description}>{product.description}</div>

          {dimensions.length > 1 && (
            <div className={styles.dimensions}>
              <label>Размеры:</label>
              <select
                value={`${selectedDimension?.width}x${selectedDimension?.length}`}
                onChange={(e) => {
                  const [width, length] = e.target.value.split("x").map(Number);
                  const dimension = dimensions.find(
                    (d) => d.width === width && d.length === length,
                  );
                  if (dimension) {
                    setSelectedDimension(dimension);
                    setSelectedAdditionalOptions([]);
                  }
                }}
                className={styles.dimensionSelect}
              >
                {dimensions.map((dim) => (
                  <option
                    key={`${dim.width}x${dim.length}`}
                    value={`${dim.width}x${dim.length}`}
                  >
                    {dim.width}x{dim.length} см
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedDimension?.additionalOptions &&
            selectedDimension.additionalOptions.length > 0 && (
              <div className={styles.additionalOptions}>
                <label>Дополнительные опции:</label>
                <select
                  value={
                    selectedAdditionalOptions.length > 0
                      ? selectedAdditionalOptions[0]?.name || ""
                      : ""
                  }
                  onChange={(e) => {
                    const option = selectedDimension.additionalOptions?.find(
                      (opt) => opt.name === e.target.value,
                    );
                    if (option) {
                      setSelectedAdditionalOptions([option]);
                    } else {
                      setSelectedAdditionalOptions([]);
                    }
                  }}
                  className={styles.optionSelect}
                >
                  <option value="">Выберите опцию</option>
                  {selectedDimension.additionalOptions.map((opt) => (
                    <option key={opt.name} value={opt.name}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

          {/* Компактные характеристики */}
          <div className={styles.shortSpecsBlock}>
            {shortSpecs.map((spec, i) => (
              <div key={i} className={styles.shortSpecRow}>
                <span className={styles.shortSpecLabel}>{spec.label}</span>
                <span className={styles.shortSpecValue}>{spec.value}</span>
              </div>
            ))}
          </div>
          <button
            className={styles.openDrawerBtn}
            onClick={() => setIsDrawerOpen(true)}
          >
            Характеристики и описание
          </button>
          <div suppressHydrationWarning>
            {!inCart ? (
              <button
                className={styles.addToCartButton}
                onClick={handleCartButtonClick}
              >
                В корзину
              </button>
            ) : (
              <div className={productCardStyles.inCartActions}>
                <button
                  className={productCardStyles.inCartButton}
                  onClick={() => router.push("/cart")}
                >
                  В корзине {cartQuantity} шт.
                </button>
                <div className={productCardStyles.cartCounter}>
                  <button
                    className={productCardStyles.counterBtn}
                    onClick={handleDecrease}
                    aria-label="Уменьшить количество"
                  >
                    −
                  </button>
                  <span className={productCardStyles.counterValue}>
                    {cartQuantity}
                  </span>
                  <button
                    className={productCardStyles.counterBtn}
                    onClick={handleIncrease}
                    aria-label="Увеличить количество"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer справа */}
      {isDrawerOpen && (
        <div
          className={styles.drawerOverlay}
          onClick={() => setIsDrawerOpen(false)}
        >
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>
                Характеристики и описание
              </span>
              <button
                className={styles.drawerClose}
                onClick={() => setIsDrawerOpen(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.drawerContent}>
              {/* Общие характеристики */}
              <div className={styles.drawerSection}>
                <h3>Общие характеристики</h3>
                <div className={styles.drawerRow}>
                  <span>Артикул</span>
                  <span>{product.id}</span>
                </div>
                <div className={styles.drawerRow}>
                  <span>Модель</span>
                  <span>{product.name}</span>
                </div>
                {product.warranty && (
                  <div className={styles.drawerRow}>
                    <span>Гарантия</span>
                    <span>{product.warranty}</span>
                  </div>
                )}
                {product.category?.name && (
                  <div className={styles.drawerRow}>
                    <span>Категория</span>
                    <span>{product.category.name}</span>
                  </div>
                )}
                {product.subcategory?.name && (
                  <div className={styles.drawerRow}>
                    <span>Подкатегория</span>
                    <span>{product.subcategory.name}</span>
                  </div>
                )}
                {product.color && (
                  <div className={styles.drawerRow}>
                    <span>Цвет</span>
                    <span>{product.color}</span>
                  </div>
                )}
                {product.country && (
                  <div className={styles.drawerRow}>
                    <span>Страна</span>
                    <span>{product.country}</span>
                  </div>
                )}
                {product.style && (
                  <div className={styles.drawerRow}>
                    <span>Стиль</span>
                    <span>{product.style}</span>
                  </div>
                )}
                {product.configuration && (
                  <div className={styles.drawerRow}>
                    <span>Конфигурация</span>
                    <span>{product.configuration}</span>
                  </div>
                )}
                {product.filler && (
                  <div className={styles.drawerRow}>
                    <span>Наполнитель</span>
                    <span>{product.filler}</span>
                  </div>
                )}
                {product.legs && (
                  <div className={styles.drawerRow}>
                    <span>Ножки</span>
                    <span>{product.legs}</span>
                  </div>
                )}
                {product.frame && (
                  <div className={styles.drawerRow}>
                    <span>Каркас</span>
                    <span>{product.frame}</span>
                  </div>
                )}
                {product.mechanism !== undefined && (
                  <div className={styles.drawerRow}>
                    <span>Механизм трансформации</span>
                    <span>{product.mechanism ? "Да" : "Нет"}</span>
                  </div>
                )}
              </div>

              {/* Размеры */}
              {dimensions && dimensions.length > 0 && (
                <div className={styles.drawerSection}>
                  <h3>Размеры</h3>
                  {dimensions.map((dim, idx) => (
                    <div key={idx} className={styles.drawerRow}>
                      <span>
                        {dim.width}x{dim.length}
                        {dim.height ? `x${dim.height}` : ""}
                        {dim.depth ? `x${dim.depth}` : ""} мм
                      </span>
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
                      <span>
                        {mat.type}
                        {mat.color ? `, ${mat.color}` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Особенности */}
              {product.features && product.features.length > 0 && (
                <div className={styles.drawerSection}>
                  <h3>Особенности</h3>
                  {product.features.map((feature, idx) => (
                    <div key={idx} className={styles.drawerRow}>
                      <span>Особенность {idx + 1}</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Доставка */}
              {product.delivery && (
                <div className={styles.drawerSection}>
                  <h3>Доставка</h3>
                  <div className={styles.drawerRow}>
                    <span>Доступность</span>
                    <span>
                      {product.delivery.available ? "Доступна" : "Недоступна"}
                    </span>
                  </div>
                  <div className={styles.drawerRow}>
                    <span>Стоимость</span>
                    <span>{product.delivery.cost}</span>
                  </div>
                  <div className={styles.drawerRow}>
                    <span>Сроки</span>
                    <span>{product.delivery.time}</span>
                  </div>
                </div>
              )}

              {/* Рассрочка и кредит */}
              {product.installmentPlans &&
                product.installmentPlans.length > 0 && (
                  <div className={styles.drawerSection}>
                    <h3>Рассрочка и кредит</h3>
                    {product.installmentPlans.map((plan, idx) => (
                      <div key={idx} className={styles.drawerRow}>
                        <span>{plan.bank}</span>
                        <span>
                          Рассрочка: {plan.installment.durationMonths} мес,{" "}
                          {plan.installment.interest},{" "}
                          {plan.installment.additionalFees} | Кредит:{" "}
                          {plan.credit.durationMonths} мес,{" "}
                          {plan.credit.interest}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

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

"use client";
import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import { useCart } from "@/hooks/CartContext";
import { useFavorites } from "@/hooks/FavoritesContext";

// Импорт SVG иконок
import HeartIcon from "./icons/HeartIcon";
import CartIcon from "./icons/CartIcon";
import PhoneIcon from "./icons/PhoneIcon";
import ArrowDownIcon from "./icons/ArrowDownIcon";

// Определение интерфейсов
interface HeaderProps {
  phones?: {
    mts?: string;
    a1?: string;
  };
}

const Header: React.FC<HeaderProps> = ({
  phones = {
    mts: "+375 (33) 664-18-30",
    a1: "+375 (29) 801-92-71",
  },
}) => {
  // Состояния для выпадающих меню
  const [isPhoneExpanded, setIsPhoneExpanded] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isNavMenuExpanded, setIsNavMenuExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Контексты для корзины и избранного
  // Вызываем хуки вне условий, чтобы соблюдать правила хуков React
  const cart = useCart();
  const favorites = useFavorites();

  // Используем значения только после монтирования, чтобы избежать проблем с гидратацией
  let cartItems = [];
  let cartTotalItems = 0;
  let favoritesItems = [];
  let favoritesFabricItems = [];

  if (isMounted) {
    cartItems = cart.items;
    cartTotalItems = cart.totalItems;
    favoritesItems = favorites.items;
    favoritesFabricItems = favorites.fabricItems;
  }

  // Вычисляем общее количество товаров в избранном
  const favoritesTotalItems =
    (favoritesItems?.length || 0) + (favoritesFabricItems?.length || 0);

  // Проверяем, что оба контекста гидратированы
  const isHydrated = isMounted;

  // Определение мобильного устройства
  useEffect(() => {
    if (!isHydrated) return;

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, [isHydrated]);

  // Примерное содержимое для выпадающего меню навигации
  const navMenuItems = [
    { title: "Кровати", url: "/catalog?category=bed" },
    { title: "Диваны", url: "/catalog?category=sofa" },
    { title: "Кресла", url: "/catalog?category=armchair" },
  ];

  // Мобильное меню
  const mobileMenuItems = [
    { title: "Главная", url: "/" },
    { title: "Каталог", url: "/catalog", items: navMenuItems },
    { title: "Ткани", url: "/fabrics" },
    { title: "Доставка и оплата", url: "/delivery" },
    // { title: 'Ткани', url: '/fabric' },
    { title: "Отзывы", url: "/reviews" },
    { title: "О нас", url: "/about" },
    { title: "Контакты", url: "/contacts" },
  ];

  const handleMobileMenuClick = () => {
    setIsMenuExpanded(false);
    setIsNavMenuExpanded(false);
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WPHeader",
            name: "Заголовок сайта",
            description: "Главная навигация сайта Dilavia",
          }),
        }}
      />
      <header className={styles.header}>
        <div className={styles.header__wrapper}>
          <div className={styles.header__content}>
            {/* Логотип */}
            <div className={styles.header__logo} tabIndex={0}>
              <Link href="/" title="Dilavia - Главная страница">
                <span>Dilavia</span>
              </Link>
            </div>

            {/* Навигация */}
            <nav className={styles.header__navigation}>
              <Link
                className={styles.header__link}
                href="/"
                title="Перейти на главную страницу"
              >
                <span>Главная</span>
              </Link>
              <div
                className={styles.header__link_menu}
                onMouseEnter={
                  isHydrated
                    ? () => !isMobile && setIsNavMenuExpanded(true)
                    : undefined
                }
                onMouseLeave={
                  isHydrated
                    ? () => !isMobile && setIsNavMenuExpanded(false)
                    : undefined
                }
              >
                <div className={styles.header__link}>
                  <Link
                    href="/catalog"
                    className={styles.header__link_text}
                    title="Перейти в каталог товаров"
                  >
                    <span>Каталог</span>
                  </Link>
                  <div
                    className={styles.header__link_arrow}
                    onClick={
                      isHydrated
                        ? () => setIsNavMenuExpanded(!isNavMenuExpanded)
                        : undefined
                    }
                  >
                    <ArrowDownIcon
                      className={`${styles.icon} ${isNavMenuExpanded ? styles.icon_rotated : ""}`}
                    />
                  </div>
                </div>
                {isNavMenuExpanded && (
                  <div
                    className={styles.header__expander}
                    suppressHydrationWarning
                  >
                    <div
                      className={`${styles.expander} ${styles.menu_expander}`}
                    >
                      <div className={styles.menu_expander__content}>
                        {navMenuItems.map((item, index) => (
                          <Link
                            key={index}
                            href={item.url}
                            className={styles.menu_expander__item}
                            title={`Перейти в раздел ${item.title}`}
                          >
                            <span>{item.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Link
                className={styles.header__link}
                href="/fabrics"
                title="Перейти в раздел тканей"
              >
                <span>Ткани</span>
              </Link>
              <Link
                className={styles.header__link}
                href="/delivery"
                title="Информация о доставке и оплате"
              >
                <span>Доставка и оплата</span>
              </Link>
              <Link
                className={styles.header__link}
                href="/reviews"
                title="Отзывы наших клиентов"
              >
                <span>Отзывы</span>
              </Link>
              <Link
                className={styles.header__link}
                href="/about"
                title="Информация о компании"
              >
                <span>О нас</span>
              </Link>
              <Link
                className={styles.header__link}
                href="/contacts"
                title="Контактная информация"
              >
                <span>Контакты</span>
              </Link>
            </nav>

            {/* Информация (телефон, избранное, корзина) */}
            <div className={styles.header__info}>
              {/* Телефон */}
              <div
                className={styles.header__info_phone}
                onMouseEnter={
                  isHydrated
                    ? () => !isMobile && setIsPhoneExpanded(true)
                    : undefined
                }
                onMouseLeave={
                  isHydrated
                    ? () => !isMobile && setIsPhoneExpanded(false)
                    : undefined
                }
                onClick={
                  isHydrated
                    ? () => isMobile && setIsPhoneExpanded(!isPhoneExpanded)
                    : undefined
                }
              >
                <div className={styles.header__info_link}>
                  <PhoneIcon className={styles.icon} />
                  <a
                    className={styles.header__info_title}
                    href={`tel:${phones.a1}`}
                    title="Позвонить по номеру"
                  >
                    {phones.a1}
                  </a>
                </div>
                {isPhoneExpanded && (
                  <div
                    className={styles.header__expander}
                    suppressHydrationWarning
                  >
                    <div
                      className={`${styles.expander} ${styles.phone_expander}`}
                    >
                      <div className={styles.phone_expander__links}>
                        <a
                          className={`${styles.phone_expander__link} ${styles.mts}`}
                          href={`tel:${phones.mts}`}
                          title="Позвонить по номеру МТС"
                        >
                          <span className={styles.icon}>МТС</span> {phones.mts}
                        </a>
                        <a
                          className={`${styles.phone_expander__link} ${styles.life}`}
                          href={`tel:${phones.a1}`}
                          title="Позвонить по номеру"
                        >
                          <span className={styles.icon}>МТС</span> {phones.a1}
                        </a>
                      </div>
                      <div className={styles.expander__small}>
                        Звоните нам с 08:00 до 20:00 без выходных
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Избранное */}
              <div className={styles.header__info_favorite}>
                <Link
                  href="/favorites"
                  className={styles.header__info_link}
                  title="Перейти в избранное"
                >
                  <HeartIcon />
                  <span
                    className={`${styles.badge} ${!isHydrated ? styles.badge_hidden : ""}`}
                    aria-label={
                      isHydrated && favoritesTotalItems > 0
                        ? `${favoritesTotalItems} товаров в избранном`
                        : undefined
                    }
                    suppressHydrationWarning
                  >
                    {favoritesTotalItems > 99 ? "99+" : favoritesTotalItems}
                  </span>
                </Link>
              </div>

              {/* Корзина */}
              <div className={styles.header__info_cart}>
                <Link
                  href="/cart"
                  className={styles.header__info_link}
                  title="Перейти в корзину"
                >
                  <CartIcon />
                  <span
                    className={`${styles.badge} ${!isHydrated ? styles.badge_hidden : ""}`}
                    aria-label={
                      isHydrated && cartTotalItems > 0
                        ? `${cartTotalItems} товаров в корзине`
                        : undefined
                    }
                    suppressHydrationWarning
                  >
                    {cartTotalItems > 99 ? "99+" : cartTotalItems}
                  </span>
                </Link>
              </div>

              {/* Мобильное меню */}
              <div className={styles.header__info_menu}>
                <div
                  className={`${styles.header__info_menu_btn} ${styles.menu_btn} ${isMenuExpanded ? styles.menu_btn_active : ""}`}
                  onClick={
                    isHydrated
                      ? () => setIsMenuExpanded(!isMenuExpanded)
                      : undefined
                  }
                >
                  <span className={styles.menu_btn__span}></span>
                  <span className={styles.menu_btn__span}></span>
                  <span className={styles.menu_btn__span}></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Мобильная навигация */}
        {isMenuExpanded && (
          <div className={styles.header_nav} suppressHydrationWarning>
            <div className={styles.mobile_menu}>
              <div className={styles.mobile_menu__content}>
                {mobileMenuItems.map((item, index) => (
                  <div key={index} className={styles.mobile_menu__item}>
                    <Link
                      href={item.url}
                      className={styles.mobile_menu__link}
                      onClick={handleMobileMenuClick}
                      title={`Перейти на страницу ${item.title}`}
                    >
                      {item.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Оверлей для закрытия меню при клике вне */}
        {(isPhoneExpanded || isMenuExpanded) && isMobile && (
          <div
            className={styles.header__overlay}
            onClick={() => {
              setIsPhoneExpanded(false);
              setIsMenuExpanded(false);
            }}
          />
        )}
      </header>
    </>
  );
};

export default Header;

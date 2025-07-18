"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCart } from "@/hooks/CartContext";
import Link from "next/link";
import styles from "./page.module.css";
import { AdditionalOption } from "@/types/product";
import { CartItem, FabricCartItem } from "@/types/cart";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import CheckoutForm from "./CheckoutForm";
import Script from "next/script";

// Google Analytics type declaration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [promo, setPromo] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderDiscount, setOrderDiscount] = useState(0);
  const [orderDiscountValue, setOrderDiscountValue] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const formRef = React.useRef<any>(null);
  const clearTimer = useRef<NodeJS.Timeout | null>(null);

  // Always call useCart at the top level
  const cart = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Проверка гидратации для предотвращения несоответствия SSR/CSR
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Сброс состояния загрузки при изменении формы (дополнительная защита)
  useEffect(() => {
    const handleFormChange = () => {
      if (loading) {
        setLoading(false);
      }
    };
    const form = formRef.current;
    if (form) {
      const inputs = form.querySelectorAll("input, select");
      inputs.forEach((input: Element) => {
        input.addEventListener("change", handleFormChange);
        input.addEventListener("input", handleFormChange);
      });
      return () => {
        inputs.forEach((input: Element) => {
          input.removeEventListener("change", handleFormChange);
          input.removeEventListener("input", handleFormChange);
        });
      };
    }
  }, [loading]);

  // Only access cart data after client-side mounting to prevent hydration issues
  const items: CartItem[] = isMounted ? cart.items : [];
  const fabricItems: FabricCartItem[] = isMounted ? cart.fabricItems : [];
  const totalPrice: number = isMounted ? cart.totalPrice || 0 : 0;
  const removeFromCart = isMounted ? cart.removeFromCart : () => {};
  const updateQuantity = isMounted ? cart.updateQuantity : () => {};
  const removeFabricFromCart = isMounted ? cart.removeFabricFromCart : () => {};
  const updateFabricQuantity = isMounted ? cart.updateFabricQuantity : () => {};
  const clearCart = isMounted ? cart.clearCart : () => {};

  const handleQuantityChange = (
    productId: string,
    dimensionId: string | undefined,
    newQuantity: number,
    additionalOptions?: AdditionalOption[],
  ) => {
    updateQuantity(productId, newQuantity, dimensionId, additionalOptions);
  };

  const handleRemoveItem = (
    productId: string,
    dimensionId: string | undefined,
    additionalOptions?: AdditionalOption[],
  ) => {
    removeFromCart(productId, dimensionId, additionalOptions);
  };

  const handleFabricQuantityChange = (
    fabricId: string,
    newQuantity: number,
  ) => {
    updateFabricQuantity(fabricId, newQuantity);
  };

  const handleRemoveFabricItem = (fabricId: string) => {
    removeFabricFromCart(fabricId);
  };

  const handleClearCart = () => {
    if (window.confirm("Вы уверены, что хотите очистить корзину?")) {
      clearCart();
      setPromo("");
      setPromoApplied(false);
      setDiscount(0);
      setPromoError("");
    }
  };

  const handlePromoApply = () => {
    if (promoApplied) return;
    if (promo.trim().toUpperCase() === "SALE10") {
      setDiscount(0.1);
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Промокод недействителен");
      setDiscount(0);
      setPromoApplied(false);
    }
  };

  const handleCheckout = () => {
    if (formRef.current && typeof formRef.current.submitForm === "function") {
      setLoading(true);
      formRef.current.submitForm();
    } else if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      const phoneInput = formRef.current.querySelector(
        'input[name="phone"]',
      ) as HTMLInputElement;
      if (phoneInput) setTimeout(() => phoneInput.focus(), 400);
    }
  };

  const handleValidationError = () => {
    setLoading(false);
  };

  const handleOrderSuccess = () => {
    setLoading(true);
    setOrderItems([...items, ...(fabricItems || [])]);
    setOrderTotal(Math.round((totalPrice || 0) * (1 - discount)));
    setOrderDiscount(discount);
    setOrderDiscountValue(Math.round((totalPrice || 0) * discount));

    // Google Analytics conversion tracking
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-17322570356/uHsmCIvMhfAaEPTkhcRA",
      });
    }

    setTimeout(() => {
      clearCart();
      setPromo("");
      setPromoApplied(false);
      setDiscount(0);
      setPromoError("");
      setLoading(false);
      if (typeof window !== "undefined") {
        window.location.href = "/catalog";
      }
    }, 450);
  };

  useEffect(() => {
    return () => {
      if (clearTimer.current) clearTimeout(clearTimer.current);
    };
  }, []);

  const totalWithDiscount = Math.round((totalPrice || 0) * (1 - discount));
  const totalItemsCount =
    (items ? items.length : 0) + (fabricItems ? fabricItems.length : 0);

  if (!isHydrated) {
    return (
      <div className={styles.container}>
        <Breadcrumbs
          items={[
            { name: "Главная", url: "https://dilavia.by/" },
            { name: "Корзина", url: "https://dilavia.by/cart" },
          ]}
        />
        <div className={styles.emptyCartModern}>
          <h1 className={styles.emptyCartTitle}>Загрузка корзины...</h1>
        </div>
      </div>
    );
  }

  if (
    totalItemsCount === 0 &&
    items !== undefined &&
    fabricItems !== undefined
  ) {
    return (
      <div className={styles.container}>
        <Breadcrumbs
          items={[
            { name: "Главная", url: "https://dilavia.by/" },
            { name: "Корзина", url: "https://dilavia.by/cart" },
          ]}
        />
        <div className={styles.emptyCartModern}>
          <h1 className={styles.emptyCartTitle}>
            В вашей корзине пока нет товаров
          </h1>
          <p className={styles.emptyCartSubtitle}>
            Попробуйте поискать интересующие вас товары
            <br />в каталоге.
          </p>
          <Link href="/catalog" className={styles.emptyCartButton}>
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.cartHeader}>
        <h1 className={styles.cartTitle}>Корзина</h1>
        <button className={styles.clearCartBtn} onClick={handleClearCart}>
          Очистить корзину
        </button>
      </div>
      <div className={styles.cartGrid}>
        <div className={styles.cartItemsSection}>
          {/* Товары */}
          {items?.map((item: CartItem, index: number) => (
            <div
              key={`${item.product.id}-${item.selectedDimension?.id || "default"}-${index}`}
              className={styles.cartProductRow}
            >
              <div className={styles.cartProductImage}>
                <img
                  src={
                    item.product.images?.[0] || "/public/images/no-image.png"
                  }
                  alt={item.product.name}
                />
              </div>
              <div className={styles.cartProductInfo}>
                <div className={styles.cartProductHeader}>
                  <span className={styles.cartProductName}>
                    {item.product.name}
                  </span>
                </div>
                <div className={styles.cartProductPriceRow}>
                  <span className={styles.cartProductPrice}>
                    от{" "}
                    {(
                      item.selectedDimension?.price ||
                      item.product.price?.current
                    ).toLocaleString("ru-RU")}{" "}
                    BYN
                  </span>
                  {item.product.price?.old && (
                    <span className={styles.cartProductOldPrice}>
                      {item.product.price.old.toLocaleString("ru-RU")} BYN
                    </span>
                  )}
                </div>
                {item.selectedDimension && (
                  <div className={styles.cartProductParam}>
                    <span>Размеры: </span>
                    <span className={styles.cartProductValue}>
                      {item.selectedDimension.width}см ×{" "}
                      {item.selectedDimension.length}см
                      {item.selectedDimension.height
                        ? ` × ${item.selectedDimension.height}см`
                        : ""}
                    </span>
                  </div>
                )}
                {item.selectedAdditionalOptions &&
                  item.selectedAdditionalOptions.length > 0 && (
                    <div className={styles.cartProductParam}>
                      <span>Доп. опции: </span>
                      <span className={styles.cartProductValue}>
                        {item.selectedAdditionalOptions
                          .map(
                            (opt: AdditionalOption) =>
                              `${opt.name}${opt.price ? ` (${opt.price} BYN)` : ""}`,
                          )
                          .join(", ")}
                      </span>
                    </div>
                  )}
              </div>
              <div className={styles.cartProductCounter}>
                <div className={styles.cartCounterBox}>
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item.product.id,
                        item.selectedDimension?.id,
                        item.quantity - 1,
                        item.selectedAdditionalOptions,
                      )
                    }
                    disabled={item.quantity <= 1}
                    aria-label="Уменьшить количество"
                    className={styles.counterBtn}
                  >
                    −
                  </button>
                  <span className={styles.counterValue}>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item.product.id,
                        item.selectedDimension?.id,
                        item.quantity + 1,
                        item.selectedAdditionalOptions,
                      )
                    }
                    disabled={item.quantity >= 99}
                    aria-label="Увеличить количество"
                    className={styles.counterBtn}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() =>
                    handleRemoveItem(
                      item.product.id,
                      item.selectedDimension?.id,
                      item.selectedAdditionalOptions,
                    )
                  }
                  className={styles.cartRemoveBtn}
                  aria-label="Удалить товар из корзины"
                  style={{ marginTop: "14px" }}
                >
                  Удалить <span className={styles.cartRemoveIcon}>×</span>
                </button>
              </div>
            </div>
          ))}

          {/* Ткани */}
          {fabricItems?.map((item, index) => (
            <div
              key={`fabric-${item.fabric.categorySlug}-${item.fabric.collectionSlug}-${item.fabric.variant.id}-${index}`}
              className={styles.cartProductRow}
            >
              <div className={styles.cartProductImage}>
                <img
                  src={item.fabric.variant.image}
                  alt={`${item.fabric.collection.nameLoc} - ${item.fabric.variant.color.name}`}
                />
              </div>
              <div className={styles.cartProductInfo}>
                <div className={styles.cartProductHeader}>
                  <span className={styles.cartProductName}>
                    {item.fabric.collection.nameLoc} -{" "}
                    {item.fabric.variant.color.name}
                  </span>
                </div>
                <div className={styles.cartProductPriceRow}>
                  <span className={styles.cartProductPrice}></span>
                </div>
                <div className={styles.cartProductParam}>
                  <span>Тип: </span>
                  <span className={styles.cartProductValue}>
                    {item.fabric.collection.technicalSpecifications.fabricType}
                  </span>
                </div>
                <div className={styles.cartProductParam}>
                  <span>Состав: </span>
                  <span className={styles.cartProductValue}>
                    {
                      item.fabric.collection.technicalSpecifications
                        .compositionLoc
                    }
                  </span>
                </div>
              </div>
              <div className={styles.cartProductCounter}>
                <button
                  onClick={() =>
                    handleRemoveFabricItem(
                      `fabric-${item.fabric.categorySlug}-${item.fabric.collectionSlug}-${item.fabric.variant.id}`,
                    )
                  }
                  className={styles.cartRemoveBtn}
                  aria-label="Удалить ткань из корзины"
                >
                  Удалить <span className={styles.cartRemoveIcon}>×</span>
                </button>
              </div>
            </div>
          ))}

          <CheckoutForm
            ref={formRef}
            onOrderSuccess={handleOrderSuccess}
            onValidationError={handleValidationError}
          />
        </div>
        <aside className={styles.cartSummarySection}>
          <div className={styles.cartSummaryBox}>
            <h2 className={styles.cartSummaryTitle}>Ваша корзина</h2>
            <div className={styles.cartSummaryRow}>
              <span>Кол-во товаров</span>
              <span>{totalItemsCount} шт.</span>
            </div>
            <div className={styles.cartSummaryTotalLabel}>Итого</div>
            <div className={styles.cartSummaryTotalValue}>
              от {totalWithDiscount.toLocaleString("ru-RU")} BYN
            </div>
            {discount > 0 && (
              <div className={styles.cartSummaryDiscount}>
                Скидка по промокоду: -
                {Math.round((totalPrice || 0) * discount).toLocaleString(
                  "ru-RU",
                )}{" "}
                BYN
              </div>
            )}
            <div className={styles.cartPromoBlock}>
              <div className={styles.cartPromoLabel}>У меня есть промокод</div>
              <div className={styles.cartPromoInputRow}>
                <input
                  type="text"
                  className={styles.cartPromoInput}
                  placeholder="Введите промокод"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  disabled={promoApplied}
                />
                <button
                  className={styles.cartPromoApplyBtn}
                  onClick={handlePromoApply}
                  disabled={promoApplied}
                >
                  Применить
                </button>
              </div>
              {promoError && (
                <div className={styles.cartPromoError}>{promoError}</div>
              )}
              {promoApplied && (
                <div className={styles.cartPromoSuccess}>
                  Промокод применён!
                </div>
              )}
            </div>
            <button
              className={styles.cartCheckoutBtn}
              onClick={handleCheckout}
              aria-label="Перейти к оформлению заказа"
              disabled={totalItemsCount === 0 || loading}
            >
              {loading ? "Оформляем заказ..." : "Оформить заказ"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

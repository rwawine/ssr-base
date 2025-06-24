'use client';

import React from 'react';
import { useCart } from '@/hooks/CartContext';
import Link from 'next/link';
import styles from './page.module.css';
import { AdditionalOption } from '@/types/product';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleQuantityChange = (productId: string, dimensionId: string | undefined, newQuantity: number, additionalOptions?: AdditionalOption[]) => {
    updateQuantity(productId, newQuantity, dimensionId, additionalOptions);
  };

  const handleRemoveItem = (productId: string, dimensionId: string | undefined, additionalOptions?: AdditionalOption[]) => {
    removeFromCart(productId, dimensionId, additionalOptions);
  };

  if (cart.items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCartModern}>
          <h1 className={styles.emptyCartTitle}>В вашей корзине пока нет товаров</h1>
          <p className={styles.emptyCartSubtitle}>
            Попробуйте поискать интересующие вас товары<br />в каталоге.
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
      <h1 className={styles.cartTitle}>Корзина</h1>
      <div className={styles.cartGrid}>
        <div className={styles.cartItemsSection}>
          {cart.items.map((item, index) => (
            <div key={`${item.product.id}-${item.selectedDimension?.id || 'default'}-${index}`} className={styles.cartProductRow}>
              <div className={styles.cartProductImage}>
                <img 
                  src={item.product.images?.[0] || '/public/images/no-image.png'} 
                  alt={item.product.name}
                />
              </div>
              <div className={styles.cartProductInfo}>
                <div className={styles.cartProductHeader}>
                  <span className={styles.cartProductName}>{item.product.name}</span>
                </div>
                <div className={styles.cartProductPriceRow}>
                  <span className={styles.cartProductPrice}>{(item.selectedDimension?.price || item.product.price?.current).toLocaleString('ru-RU')} ₽</span>
                  {item.product.price?.old && (
                    <span className={styles.cartProductOldPrice}>{item.product.price.old.toLocaleString('ru-RU')} ₽</span>
                  )}
                </div>
                {item.selectedDimension && (
                  <div className={styles.cartProductParam}>
                    <span>Размеры: </span>
                    <span className={styles.cartProductValue}>{item.selectedDimension.width}см × {item.selectedDimension.length}см{item.selectedDimension.height ? ` × ${item.selectedDimension.height}см` : ''}</span>
                  </div>
                )}
                {/* Можно добавить другие параметры */}
              </div>
              <div className={styles.cartProductCounter}>
                <div className={styles.cartCounterBox}>
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.selectedDimension?.id, item.quantity - 1, item.selectedAdditionalOptions)}
                    disabled={item.quantity <= 1}
                    aria-label="Уменьшить количество"
                    className={styles.counterBtn}
                  >
                    −
                  </button>
                  <span className={styles.counterValue}>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.selectedDimension?.id, item.quantity + 1, item.selectedAdditionalOptions)}
                    disabled={item.quantity >= 99}
                    aria-label="Увеличить количество"
                    className={styles.counterBtn}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.product.id, item.selectedDimension?.id, item.selectedAdditionalOptions)}
                  className={styles.cartRemoveBtn}
                  aria-label="Удалить товар из корзины"
                  style={{ marginTop: '14px' }}
                >
                  Удалить <span className={styles.cartRemoveIcon}>×</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        <aside className={styles.cartSummarySection}>
          <div className={styles.cartSummaryBox}>
            <h2 className={styles.cartSummaryTitle}>Ваша корзина</h2>
            <div className={styles.cartSummaryRow}>
              <span>Кол-во товаров</span>
              <span>{cart.totalItems} шт.</span>
            </div>
            <div className={styles.cartSummaryTotalLabel}>Итого</div>
            <div className={styles.cartSummaryTotalValue}>{cart.totalPrice.toLocaleString('ru-RU')} ₽</div>
            <button className={styles.cartCheckoutBtn}>
              Перейти к оформлению
            </button>
            <div className={styles.cartPromoBlock}>
              <div className={styles.cartPromoLabel}>У меня есть промокод</div>
              <div className={styles.cartPromoInputRow}>
                <input type="text" className={styles.cartPromoInput} placeholder="Введите промокод" />
                <button className={styles.cartPromoApplyBtn}>Применить</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

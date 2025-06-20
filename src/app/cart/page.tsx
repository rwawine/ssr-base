'use client';

import React from 'react';
import { useCart } from '@/hooks/CartContext';
import Link from 'next/link';
import styles from './page.module.css';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleQuantityChange = (productId: string, dimensionId: string | undefined, newQuantity: number) => {
    updateQuantity(productId, newQuantity, dimensionId);
  };

  const handleRemoveItem = (productId: string, dimensionId: string | undefined) => {
    removeFromCart(productId, dimensionId);
  };

  if (cart.items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCart}>
          <h1>Корзина пуста</h1>
          <p>Добавьте товары в корзину, чтобы оформить заказ</p>
          <Link href="/catalog" className={styles.continueShopping}>
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.cartHeader}>
        <h1>Корзина</h1>
        <button 
          onClick={clearCart} 
          className={styles.clearCart}
          aria-label="Очистить корзину"
        >
          Очистить корзину
        </button>
      </div>

      <div className={styles.cartContent}>
        <div className={styles.itemsList}>
          {cart.items.map((item, index) => (
            <div key={`${item.product.id}-${item.selectedDimension?.id || 'default'}-${index}`} className={styles.cartItem}>
              <div className={styles.itemImage}>
                <img 
                  src={item.product.images?.[0] || '/public/images/no-image.png'} 
                  alt={item.product.name}
                />
              </div>
              
              <div className={styles.itemInfo}>
                <h3>{item.product.name}</h3>
                {item.selectedDimension && (
                  <p className={styles.dimension}>
                    Размер: {item.selectedDimension.width}×{item.selectedDimension.length} см
                  </p>
                )}
                <p className={styles.price}>
                  {item.selectedDimension?.price || item.product.price?.current} BYN
                </p>
              </div>

              <div className={styles.itemQuantity}>
                <button
                  onClick={() => handleQuantityChange(item.product.id, item.selectedDimension?.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label="Уменьшить количество"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.product.id, item.selectedDimension?.id, item.quantity + 1)}
                  disabled={item.quantity >= 99}
                  aria-label="Увеличить количество"
                >
                  +
                </button>
              </div>

              <div className={styles.itemTotal}>
                <span>
                  {((item.selectedDimension?.price || item.product.price?.current || 0) * item.quantity).toFixed(2)} BYN
                </span>
              </div>

              <button
                onClick={() => handleRemoveItem(item.product.id, item.selectedDimension?.id)}
                className={styles.removeButton}
                aria-label="Удалить товар из корзины"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className={styles.cartSummary}>
          <h2>Итого</h2>
          <div className={styles.summaryRow}>
            <span>Товаров:</span>
            <span>{cart.totalItems}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Сумма:</span>
            <span className={styles.totalPrice}>{cart.totalPrice.toFixed(2)} BYN</span>
          </div>
          <button className={styles.checkoutButton}>
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );
}

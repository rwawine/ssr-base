'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '@/hooks/CartContext';
import Link from 'next/link';
import styles from './page.module.css';
import { AdditionalOption } from '@/types/product';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';
import CheckoutForm from './CheckoutForm';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();
  const [promo, setPromo] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderDiscount, setOrderDiscount] = useState(0);
  const [orderDiscountValue, setOrderDiscountValue] = useState(0);
  const formRef = React.useRef<any>(null);
  const clearTimer = useRef<NodeJS.Timeout | null>(null);

  // Сброс состояния загрузки при изменении формы (дополнительная защита)
  useEffect(() => {
    const handleFormChange = () => {
      if (loading) {
        setLoading(false);
      }
    };
    const form = formRef.current;
    if (form) {
      const inputs = form.querySelectorAll('input, select');
      inputs.forEach((input: Element) => {
        input.addEventListener('change', handleFormChange);
        input.addEventListener('input', handleFormChange);
      });
      return () => {
        inputs.forEach((input: Element) => {
          input.removeEventListener('change', handleFormChange);
          input.removeEventListener('input', handleFormChange);
        });
      };
    }
  }, [loading]);

  const handleQuantityChange = (productId: string, dimensionId: string | undefined, newQuantity: number, additionalOptions?: AdditionalOption[]) => {
    updateQuantity(productId, newQuantity, dimensionId, additionalOptions);
  };

  const handleRemoveItem = (productId: string, dimensionId: string | undefined, additionalOptions?: AdditionalOption[]) => {
    removeFromCart(productId, dimensionId, additionalOptions);
  };

  const handleClearCart = () => {
    if (window.confirm('Вы уверены, что хотите очистить корзину?')) {
      clearCart();
      setPromo('');
      setPromoApplied(false);
      setDiscount(0);
      setPromoError('');
    }
  };

  const handlePromoApply = () => {
    if (promoApplied) return;
    if (promo.trim().toUpperCase() === 'SALE10') {
      setDiscount(0.1); setPromoApplied(true); setPromoError('');
    } else {
      setPromoError('Промокод недействителен');
      setDiscount(0);
      setPromoApplied(false);
    }
  };

  const handleCheckout = () => {
    if (formRef.current && typeof formRef.current.submitForm === 'function') {
      setLoading(true);
      formRef.current.submitForm();
    } else if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const phoneInput = formRef.current.querySelector('input[name="phone"]') as HTMLInputElement;
      if (phoneInput) setTimeout(() => phoneInput.focus(), 400);
    }
  };

  const handleValidationError = () => {
    setLoading(false);
  };

  const handleOrderSuccess = () => {
    setLoading(true);
    setOrderItems(cart.items);
    setOrderTotal(Math.round(cart.totalPrice * (1 - discount)));
    setOrderDiscount(discount);
    setOrderDiscountValue(Math.round(cart.totalPrice * discount));
    setTimeout(() => {
      const randomId = Math.floor(Math.random() * 9000) + 1000;
      setOrderId(`#19${randomId}`);
      setOrderSubmitted(true);
      setLoading(false);
      clearTimer.current = setTimeout(() => {
        clearCart();
        setPromo('');
        setPromoApplied(false);
        setDiscount(0);
        setPromoError('');
      }, 200);
    }, 450);
  };

  useEffect(() => {
    return () => {
      if (clearTimer.current) clearTimeout(clearTimer.current);
    };
  }, []);

  const totalWithDiscount = Math.round(cart.totalPrice * (1 - discount));

  if (orderSubmitted) {
    return (
      <div className={styles.container}>
        <Breadcrumbs
          items={[
            { label: 'Главная', href: 'https://dilavia.by/' },
            { label: 'Корзина' }
          ]}
        />
        <div className={styles.orderSuccess}>
          <h1 className={styles.orderSuccessTitle}>Спасибо за заказ!</h1>
          <div className={styles.orderId}>{orderId}</div>
          <div className={styles.orderDetails}>
            <h2 className={styles.orderDetailsTitle}>Состав заказа:</h2>
            <div className={styles.orderItems}>
              {orderItems.length > 0 ? orderItems.map((item, index) => (
                <div key={index} className={styles.orderItem}>
                  <div className={styles.orderItemImage}>
                    <img
                      src={item.product.images?.[0] || '/public/images/no-image.png'}
                      alt={item.product.name}
                    />
                  </div>
                  <div className={styles.orderItemInfo}>
                    <div className={styles.orderItemName}>{item.product.name} <span style={{ color: '#888', fontSize: '0.95em' }}> {item.product.id}</span></div>
                    <div className={styles.orderItemQuantity}>Количество: {item.quantity} шт.</div>
                    {item.selectedDimension && (
                      <div className={styles.orderItemDimension}>
                        Размеры: {item.selectedDimension.width}см × {item.selectedDimension.length}см{item.selectedDimension.height ? ` × ${item.selectedDimension.height}см` : ''}
                      </div>
                    )}
                    {item.selectedAdditionalOptions && item.selectedAdditionalOptions.length > 0 && (
                      <div className={styles.orderItemDimension}>
                        {item.selectedAdditionalOptions.map((opt: any) => (
                          <span key={opt.name}>{opt.name}{opt.value ? `: ${opt.value}` : ''}{opt.price ? `` : ''} </span>
                        ))}
                      </div>
                    )}
                    <div className={styles.orderItemPrice}>
                      {(item.selectedDimension?.price || item.product.price?.current).toLocaleString('ru-RU')} BYN
                    </div>
                  </div>
                </div>
              )) : <div className={styles.orderEmpty}>Нет товаров</div>}
            </div>
            {orderDiscount > 0 && (
              <div className={styles.orderTotal}>
                <p className={styles.orderTotalLabel + styles.orderTotalLabelDiscount} style={{ color: '#388e3c' }}>Скидка по промокоду:</p>
                <div className={styles.orderTotalValue + styles.orderTotalLabelDiscount} style={{ color: '#388e3c' }}>-{orderDiscountValue.toLocaleString('ru-RU')} BYN</div>
              </div>
            )}
            <div className={styles.orderTotal}>
              <div className={styles.orderTotalLabel}>Итого:</div>
              <div className={styles.orderTotalValue}>{orderTotal.toLocaleString('ru-RU')} BYN</div>
            </div>
          </div>
          <p className={styles.orderSuccessMessage}>
            В течении часа с вами свяжется наш менеджер для уточнения деталей заказа.
          </p>
          <div className={styles.orderSuccessButtons}>
            <Link href="/" className={styles.orderSuccessButton}>
              На главную
            </Link>
            <Link href="/catalog" className={styles.orderSuccessButtonSecondary}>
              В каталог
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className={styles.container}>
        <Breadcrumbs
          items={[
            { label: 'Главная', href: 'https://dilavia.by/' },
            { label: 'Корзина' }
          ]}
        />
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
      <Breadcrumbs
        items={[
          { label: 'Главная', href: 'https://dilavia.by/' },
          { label: 'Корзина' }
        ]}
      />
      <div className={styles.cartHeader}>
        <h1 className={styles.cartTitle}>Корзина</h1>
        <button className={styles.clearCartBtn} onClick={handleClearCart}>Очистить корзину</button>
      </div>
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
                  <span className={styles.cartProductPrice}>{(item.selectedDimension?.price || item.product.price?.current).toLocaleString('ru-RU')} BYN</span>
                  {item.product.price?.old && (
                    <span className={styles.cartProductOldPrice}>{item.product.price.old.toLocaleString('ru-RU')} BYN</span>
                  )}
                </div>
                {item.selectedDimension && (
                  <div className={styles.cartProductParam}>
                    <span>Размеры: </span>
                    <span className={styles.cartProductValue}>{item.selectedDimension.width}см × {item.selectedDimension.length}см{item.selectedDimension.height ? ` × ${item.selectedDimension.height}см` : ''}</span>
                  </div>
                )}
                {item.selectedAdditionalOptions && item.selectedAdditionalOptions.length > 0 && (
                  <div className={styles.cartProductParam}>
                    <span>Доп. опции: </span>
                    <span className={styles.cartProductValue}>
                      {item.selectedAdditionalOptions.map(opt => `${opt.name}${opt.price ? '' : ''}`).join(', ')}
                    </span>
                  </div>
                )}
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
              <span>{cart.totalItems} шт.</span>
            </div>
            <div className={styles.cartSummaryTotalLabel}>Итого</div>
            <div className={styles.cartSummaryTotalValue}>{totalWithDiscount.toLocaleString('ru-RU')} BYN</div>
            {discount > 0 && (
              <div className={styles.cartSummaryDiscount}>Скидка по промокоду: -{Math.round(cart.totalPrice * discount).toLocaleString('ru-RU')} BYN</div>
            )}
            <div className={styles.cartPromoBlock}>
              <div className={styles.cartPromoLabel}>У меня есть промокод</div>
              <div className={styles.cartPromoInputRow}>
                <input type="text" className={styles.cartPromoInput} placeholder="Введите промокод" value={promo} onChange={e => setPromo(e.target.value)} disabled={promoApplied} />
                <button className={styles.cartPromoApplyBtn} onClick={handlePromoApply} disabled={promoApplied}>Применить</button>
              </div>
              {promoError && <div className={styles.cartPromoError}>{promoError}</div>}
              {promoApplied && <div className={styles.cartPromoSuccess}>Промокод применён!</div>}
            </div>
            <button
              className={styles.cartCheckoutBtn}
              onClick={handleCheckout}
              aria-label="Перейти к оформлению заказа"
              disabled={cart.items.length === 0 || loading}
            >
              {loading ? 'Оформляем заказ...' : 'Оформить заказ'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

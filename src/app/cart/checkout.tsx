import React, { useState } from 'react';
import { useCart } from '@/hooks/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, discount, clearCart, resetPromo } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', delivery: 'courier', payment: 'card' });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: any = {};
    if (!form.name.trim()) errs.name = 'Введите имя';
    if (!/^\+?\d{10,15}$/.test(form.phone)) errs.phone = 'Введите корректный телефон';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Введите корректный email';
    if (!form.address.trim()) errs.address = 'Введите адрес';
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      clearCart();
      resetPromo();
      setTimeout(() => router.push('/cart'), 2000);
    }, 1200);
  };

  const totalWithDiscount = Math.round(cart.totalPrice * (1 - discount));

  if (success) {
    return <div style={{ padding: 32, textAlign: 'center' }}><h2>Спасибо за заказ!</h2><p>Мы свяжемся с вами для подтверждения.</p></div>;
  }

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: 32 }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Оформление заказа</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Имя*</label>
          <input name="name" value={form.name} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
          {errors.name && <div style={{ color: '#d32f2f', fontSize: 13 }}>{errors.name}</div>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Телефон*</label>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="+375291234567" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
          {errors.phone && <div style={{ color: '#d32f2f', fontSize: 13 }}>{errors.phone}</div>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Email*</label>
          <input name="email" value={form.email} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
          {errors.email && <div style={{ color: '#d32f2f', fontSize: 13 }}>{errors.email}</div>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Адрес доставки*</label>
          <input name="address" value={form.address} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
          {errors.address && <div style={{ color: '#d32f2f', fontSize: 13 }}>{errors.address}</div>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Способ доставки</label>
          <select name="delivery" value={form.delivery} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
            <option value="courier">Курьером</option>
            <option value="pickup">Самовывоз</option>
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Способ оплаты</label>
          <select name="payment" value={form.payment} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
            <option value="card">Картой онлайн</option>
            <option value="cash">Наличными</option>
          </select>
        </div>
        <div style={{ margin: '24px 0', fontWeight: 600, fontSize: 18, textAlign: 'center' }}>
          Итог: {totalWithDiscount.toLocaleString('ru-RU')} ₽
        </div>
        <button type="submit" style={{ width: '100%', padding: 12, borderRadius: 8, background: '#111', color: '#fff', fontWeight: 600, fontSize: 17 }} disabled={loading}>
          {loading ? 'Оформляем...' : 'Подтвердить заказ'}
        </button>
      </form>
    </div>
  );
} 
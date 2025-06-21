"use client";

import React from 'react';
import styles from './ContactsPage.module.css';

export default function ContactForm() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Здесь будет логика отправки формы
        alert('Форма отправлена (демонстрация)');
    };

    return (
        <section className={styles.contactForm}>
          <h2 className={styles.formTitle}>Форма обратной связи</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Ваше имя</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Ваш Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="topic">Тема обращения</label>
                <select id="topic" name="topic" required defaultValue="">
                    <option value="" disabled>Выберите тему</option>
                    <option value="cooperation">Сотрудничество</option>
                    <option value="order_question">Вопрос по заказу</option>
                    <option value="product_question">Вопрос по товару</option>
                    <option value="other">Другое</option>
                </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message">Ваше сообщение</label>
              <textarea id="message" name="message" required></textarea>
            </div>
            <button type="submit" className={styles.submitButton}>Отправить</button>
          </form>
        </section>
    );
} 
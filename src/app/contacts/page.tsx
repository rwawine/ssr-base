import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import styles from './ContactsPage.module.css';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Контакты | Dilavia',
  description: 'Свяжитесь с мебельной фабрикой Dilavia. Адрес, телефон, email, график работы и форма обратной связи. Мы всегда готовы ответить на ваши вопросы.',
  openGraph: {
    title: 'Контакты | Dilavia',
    description: 'Контактная информация для связи с Dilavia. Мы производим современную дизайнерскую мебель и готовы к сотрудничеству.',
    url: 'https://dilavia.by/contacts', // Replace with actual URL
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Контакты | Dilavia',
    description: 'Свяжитесь с мебельной фабрикой Dilavia. Адрес, телефон, email, график работы и форма обратной связи.',
  },
};

export default function ContactsPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.breadcrumbs}>
        <Link href="/">Главная</Link> / <span>Контакты</span>
      </div>

      <h1 className={styles.title}>Наши контакты</h1>

      <div className={styles.contentWrapper}>
        <aside className={styles.contactInfo}>
          <div className={styles.infoBlock}>
            <h3>Адрес</h3>
            <p>Нижний Новгород, ул. Мебельная, д. 1</p>
          </div>
          <div className={styles.infoBlock}>
            <h3>Телефон</h3>
            <p><a href="tel:+78005553535">+7 (800) 555-35-35</a></p>
          </div>
          <div className={styles.infoBlock}>
            <h3>Email</h3>
            <p><a href="mailto:info@Dilavia.ru">info@Dilavia.ru</a></p>
          </div>
          <div className={styles.infoBlock}>
            <h3>График работы</h3>
            <p>Пн-Пт: 10:00 – 20:00</p>
            <p>Сб-Вс: 11:00 – 18:00</p>
          </div>
          <div className={styles.infoBlock}>
            <h3>Мы в соцсетях</h3>
            <div className={styles.socials}>
              <a href="#" className={styles.socialIcon}>VK</a>
              <a href="#" className={styles.socialIcon}>TG</a>
            </div>
          </div>
        </aside>

        <ContactForm />
      </div>
      
      <div className={styles.mapContainer}>
        Карта проезда
      </div>
    </div>
  );
}

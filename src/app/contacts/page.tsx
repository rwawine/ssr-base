import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import styles from './ContactsPage.module.css';
import ContactForm from './ContactForm';
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';

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
      <Breadcrumbs
        items={[
          { label: 'Главная', href: 'https://dilavia.by/' },
          { label: 'Контакты' }
        ]}
        className={styles.breadcrumbs}
      />

      <h1 className={styles.title}>Наши контакты</h1>

      <div className={styles.contentWrapper}>
        <aside className={styles.contactInfo}>
          <div className={styles.infoBlock}>
            <h3>Адрес</h3>
            <p>г. Минск, ул. Железнодорожная, д. 33А, оф. 402, 220089</p>
          </div>
          <div className={styles.infoBlock}>
            <h3>Телефон</h3>
            <p><a href="tel:+375336641830">+375 (33) 664-18-30</a></p>
            <p><a href="tel:+375298019271">+375 (29) 801-92-71</a></p>
          </div>
          <div className={styles.infoBlock}>
            <h3>Email</h3>
            <p><a href="mailto:information@dilavia.by">information@dilavia.by</a></p>
          </div>
        </aside>
        <ContactForm />
      </div>

      <div className={styles.mapContainer}>
        <iframe
          src="https://yandex.ru/map-widget/v1/?um=constructor%3Acb083bc486aed45f850ece7385add2f7e81cb687e9d55eb869b506291fac6df9&amp;source=constructor"
          width="100%"
          height="100%"
          frameBorder="0"
          title="Карта проезда к мебельной фабрике Dilavia"
          loading="lazy"
        />
      </div>
    </div>
  );
}

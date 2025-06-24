import React from 'react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';
import Reviews from '@/components/reviews/Reviews';
import styles from './ReviewsPage.module.css';

export const metadata: Metadata = {
  title: 'Отзывы | Dilavia',
  description: 'Отзывы покупателей о мебели и сервисе интернет-магазина Dilavia. Читайте реальные мнения клиентов и делитесь своим опытом.',
  openGraph: {
    title: 'Отзывы | Dilavia',
    description: 'Отзывы покупателей о мебели и сервисе интернет-магазина Dilavia. Читайте реальные мнения клиентов и делитесь своим опытом.',
    url: 'https://dilavia.by/reviews',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Отзывы | Dilavia',
    description: 'Отзывы покупателей о мебели и сервисе интернет-магазина Dilavia. Читайте реальные мнения клиентов и делитесь своим опытом.',
  },
};

export default function ReviewsPage() {
  return (
    <main className={styles.pageContainer}>
      <div className={styles.header}>
        <Breadcrumbs
          items={[
            { label: 'Главная', href: 'https://dilavia.by/' },
            { label: 'Отзывы' }
          ]}
          className={styles.breadcrumbs}
        />
        <h1 className={styles.mainTitle}>Отзывы и рейтинг</h1>
      </div>
      <Reviews />
    </main>
  );
}

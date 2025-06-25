import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import styles from './AboutPage.module.css';
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';

export const metadata: Metadata = {
  title: 'О компании Dilavia | Производство дизайнерской мебели',
  description: 'Узнайте больше о мебельной фабрике Dilavia. Наша миссия, ценности и технологии производства. Качественная мебель из экологичных материалов.',
  openGraph: {
    title: 'О компании Dilavia',
    description: 'Современная дизайнерская мебель от производителя. Контроль качества, европейские материалы и собственное производство в Нижнем Новгороде.',
    url: 'https://dilavia.by/about', // Replace with actual URL
    type: 'website',
    images: [
      {
        url: '/images/Sofa/Straight_sofa/Medyson/1.png', // Replace with a relevant banner image
        width: 1200,
        height: 630,
        alt: 'Современный диван от Dilavia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'О компании «Dilavia»',
    description: 'Современная дизайнерская мебель от производителя. Контроль качества, европейские материалы и собственное производство в Нижнем Новгороде.',
    images: ['/images/Sofa/Straight_sofa/Medyson/1.png'], // Replace with a relevant banner image
  },
};

export default function AboutPage() {
  return (
    <div className={styles.pageContainer}>
      <Breadcrumbs
        items={[
          { label: 'Главная', href: 'https://dilavia.by/' },
          { label: 'О компании' }
        ]}
        className={styles.breadcrumbs}
      />
              <h1 className={styles.title}>О компании «Dilavia»</h1>
      <section className={styles.banner}>
        <Image
          src="/images/sofas.webp"
          alt="Интерьер с мебелью Dilavia"
          layout="fill"
          className={styles.bannerImage}
          priority
        />
      </section>

      <div className={styles.header}>
        <p className={styles.subtitle}>
          Наша компания предлагает вам современную мебель. Мы самостоятельно разрабатываем конструкцию и удобную дизайнерскую мебель, опираясь на тренды индустрии.
        </p>
      </div>

      <section className={styles.features}>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>☘️</span>
          <p>Экологически чистые материалы</p>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>🌍</span>
          <p>Европейские поставщики тканей и фурнитуры</p>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>✅</span>
          <p>Контроль качества на каждом этапе производства</p>
        </div>
      </section>

      <section className={styles.interiorSection}>
        <div className={styles.interiorImageWrapper}>
          <Image
            src="/images/Sofa/Corner_sofa/Amsterdam/1.png" // Main interior image
            alt="Стильный интерьер с мебелью"
            width={800}
            height={550}
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles.interiorContent}>
          <h2 className={styles.interiorTitle}>Интерьер... Мы видим его как творчество, индивидуальность</h2>
          <div className={styles.descriptionBox}>
            <p>
              Над проектами работает большая команда, все материалы проходят контроль качества, опытные технологи прорабатывают каждый сантиметр изделий, толщину наполнителя, эргономику посадки.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.resultSection}>
        <div className={styles.resultLogo}>□ DILAVIA</div>
        <h2 className={styles.resultTitle}>
          Благодаря опыту и технологиям производства, мы получаем результат – мебель, которая будет радовать вас долгие годы.
        </h2>
      </section>

      <section className={styles.factorySection}>
        <div className={styles.factoryInfo}>
          <h2 className={styles.factoryTitle}>Фабрика мебели Dilavia – это собственное производство, расположенное в Беларуси.</h2>
          <p className={styles.factoryText}>
            Выстроив долгосрочные отношения с лучшими поставщиками материалов (фурнитуры, тканей, механизмов), мы гарантируем 100% результат и готовы радовать Вас низкими ценами.
          </p>
        </div>
        <div className={styles.factoryStats}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>1 000 м²</div>
            <div className={styles.statLabel}>производственных площадей</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>10 человек</div>
            <div className={styles.statLabel}>число сотрудников</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>100 ед.</div>
            <div className={styles.statLabel}>продукции в месяц</div>
          </div>
        </div>
      </section>
    </div>
  );
}

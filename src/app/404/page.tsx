import styles from './NotFound.module.css'
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import BackButton from './BackButton';

export const metadata: Metadata = {
  title: '404 — Страница не найдена | Dilavia',
  description: 'К сожалению, запрашиваемая страница не существует или была перемещена. Перейдите на главную или воспользуйтесь навигацией сайта.',
  openGraph: {
    title: '404 — Страница не найдена | Dilavia',
    description: 'К сожалению, запрашиваемая страница не существует или была перемещена. Перейдите на главную или воспользуйтесь навигацией сайта.',
    url: 'https://dilavia.by/404',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '404 — Страница не найдена | Dilavia',
    description: 'К сожалению, запрашиваемая страница не существует или была перемещена. Перейдите на главную или воспользуйтесь навигацией сайта.',
  },
};

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Страница не найдена</h2>
        <p className={styles.description}>
          К сожалению, запрашиваемая страница не существует или была перемещена.
        </p>
        <div className={styles.actions}>
          <BackButton className={styles.button} />
          <Link href="/" className={`${styles.button} ${styles.primary}`}>
            На главную
          </Link>
        </div>
      </div>
    </div>
  )
} 
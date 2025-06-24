import React from 'react';
import Link from 'next/link';
import styles from './Breadcrumbs.module.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Компонент для вставки JSON-LD микроразметки Schema.org BreadcrumbList
 */
const BreadcrumbsJsonLd: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  if (!items || items.length === 0) return null;
  const itemListElement = items.map((item, idx) => {
    const obj: any = {
      '@type': 'ListItem',
      position: idx + 1,
      name: item.label
    };
    // Только если есть href и это не последний элемент
    if (item.href && idx !== items.length - 1) {
      obj.item = item.href;
    }
    return obj;
  });
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement
        })
      }}
    />
  );
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav className={styles.breadcrumbs + (className ? ' ' + className : '')} aria-label="Хлебные крошки">
      <BreadcrumbsJsonLd items={items} />
      {items.map((item, idx) => (
        <span key={idx} className={styles.breadcrumbItem}>
          {item.href && idx !== items.length - 1 ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span className={styles.current}>{item.label}</span>
          )}
          {idx < items.length - 1 && <span className={styles.separator}>/</span>}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs; 
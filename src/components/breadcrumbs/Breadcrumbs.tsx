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

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav className={styles.breadcrumbs + (className ? ' ' + className : '')} aria-label="Хлебные крошки">
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
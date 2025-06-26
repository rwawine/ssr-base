import React from "react";
import Link from "next/link";
import { BreadcrumbItem } from "@/types";
import styles from "./Breadcrumbs.module.css";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Компонент для вставки JSON-LD микроразметки Schema.org BreadcrumbList
 */
const BreadcrumbsJsonLd: React.FC<{ items: BreadcrumbItem[] }> = ({
  items,
}) => {
  if (!items || items.length === 0) return null;
  const itemListElement = items.map((item, idx) => {
    const obj: any = {
      "@type": "ListItem",
      position: idx + 1,
      name: item.label,
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
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement,
        }),
      }}
    />
  );
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav
      className={`${styles.breadcrumbs} ${className || ""}`}
      aria-label="Хлебные крошки"
    >
      <BreadcrumbsJsonLd items={items} />
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li key={index} className={styles.item}>
            {item.isActive || !item.href ? (
              <span className={styles.current}>{item.label}</span>
            ) : (
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            )}
            {index < items.length - 1 && (
              <span className={styles.separator} aria-hidden="true">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;

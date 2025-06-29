import React from "react";
import Link from "next/link";
import styles from "./Breadcrumbs.module.css";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  // Генерируем структурированные данные для хлебных крошек
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <ol className={styles.breadcrumbs__list}>
          {items.map((item, index) => (
            <li key={index} className={styles.breadcrumbs__item}>
              {index === items.length - 1 ? (
                <span
                  className={styles.breadcrumbs__current}
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.url || "/"}
                    className={styles.breadcrumbs__link}
                  >
                    {item.name}
                  </Link>
                  <span className={styles.breadcrumbs__separator}>/</span>
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

export default Breadcrumbs;

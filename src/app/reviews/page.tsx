import React from "react";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import Reviews from "@/components/reviews/Reviews";
import styles from "./ReviewsPage.module.css";

export default function ReviewsPage() {
  return (
    <main className={styles.pageContainer}>
      <div className={styles.header}>
        <Breadcrumbs
          items={[
            { name: "Главная", url: "https://dilavia.by/" },
            { name: "Отзывы", url: "https://dilavia.by/reviews" },
          ]}
        />
        <h1 className={styles.mainTitle}>Отзывы и рейтинг</h1>
      </div>
      <Reviews />
    </main>
  );
}

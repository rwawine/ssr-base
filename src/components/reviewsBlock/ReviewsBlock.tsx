import React from "react";
import styles from "./ReviewsBlock.module.css";
import ReviewsCarousel from "./ReviewsCarousel";
import Link from "next/link";

export default function ReviewsBlock() {
  return (
    <div className={styles.block}>
      <div className={styles.titleWrapper}>
        <h2 className={styles.title}>Отзывы наших клиентов</h2>
        <Link href="/reviews" className={styles.button}>
          <span>Все отзывы</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.0097 15.9394L13.949 12.0001L10.0097 8.06072C9.71682 7.76783 9.71682 7.29296 10.0097 7.00007C10.0097 7.00007 10.0097 7.00007 10.0097 7.00007C10.3026 6.70717 10.7775 6.70717 11.0704 7.00007L15.54 11.4697C15.6807 11.6104 15.7597 11.8011 15.7597 12.0001C15.7597 12.199 15.6807 12.3897 15.54 12.5304L11.0704 17.0001C10.7775 17.2929 10.3026 17.2929 10.0097 17.0001C9.71682 16.7072 9.71682 16.2323 10.0097 15.9394Z"
              fill="black"
            />
          </svg>
        </Link>
      </div>
      <ReviewsCarousel />
    </div>
  );
}

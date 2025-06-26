"use client";
import React, { useEffect, useState, useRef } from "react";
import { db } from "@/utils/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import styles from "./ReviewsCarousel.module.css";
import { useRouter } from "next/navigation";

interface Review {
  id: string;
  username: string;
  comment: string;
  rating: number;
  timestamp?: { seconds: number; nanoseconds: number };
}

function getAvatarLetter(name: string) {
  return name?.charAt(0).toUpperCase() || "?";
}

function getUsername(name: string) {
  // Генерируем ник из имени (например, @ivanov)
  return "@" + name.toLowerCase().replace(/\s+/g, "").slice(0, 12);
}

function ReviewCard({ review }: { review: Review }) {
  const [showButton, setShowButton] = useState(false);
  const [clampedText, setClampedText] = useState<string | null>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (textRef.current) {
      const isClamped = textRef.current.offsetHeight > 150;
      setShowButton(isClamped);
      if (isClamped) {
        // Обрезаем текст вручную и добавляем ...
        // Клонируем элемент, чтобы не менять DOM напрямую
        const original = review.comment;
        let end = original.length;
        let start = 0;
        let result = original;
        // Бинарный поиск по длине текста
        while (start < end) {
          const mid = Math.floor((start + end) / 2);
          textRef.current.textContent = original.slice(0, mid) + "...";
          if (textRef.current.offsetHeight > 150) {
            end = mid - 1;
          } else {
            result = original.slice(0, mid) + "...";
            start = mid + 1;
          }
        }
        setClampedText(result);
        textRef.current.textContent = original; // Восстанавливаем
      } else {
        setClampedText(null);
      }
    }
  }, [review.comment]);

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginTop: 4,
          }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={i < review.rating ? "#FFD700" : "#E5E7EB"}
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: "inline-block", verticalAlign: "middle" }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
            </svg>
          ))}
        </div>
        <p
          className={
            showButton ? styles.clampText + " " + styles.text : styles.text
          }
          ref={textRef}
        >
          {showButton && clampedText ? clampedText : review.comment}
        </p>
        {showButton && (
          <button
            className={styles.fullButton}
            onClick={() => router.push("/reviews")}
            type="button"
          >
            Смотреть полностью
          </button>
        )}
      </div>
      <div className={styles.userRow}>
        <div className={styles.avatar}>{getAvatarLetter(review.username)}</div>
        <div>
          <div className={styles.name}>{review.username}</div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsCarousel() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const commentsRef = collection(db, "feedbacks");
    const q = query(commentsRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Review,
      );
      setReviews(fetchedReviews);
    });
    return () => unsubscribe();
  }, []);

  if (!reviews.length) {
    return <div className={styles.empty}>Нет отзывов</div>;
  }

  return (
    <div className={styles.carouselWrapper}>
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop
        slidesPerView={1}
        spaceBetween={24}
        breakpoints={{
          600: { slidesPerView: 2 },
          900: { slidesPerView: 5 },
        }}
        className={styles.swiper}
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id} className={styles.slide}>
            <ReviewCard review={review} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

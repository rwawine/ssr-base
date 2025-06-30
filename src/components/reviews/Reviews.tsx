"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/utils/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import styles from "./Reviews.module.css";

interface Review {
  id: string;
  username: string;
  comment: string;
  rating: number;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

const StarRating = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (r: number) => void;
}) => {
  return (
    <div className={styles.starRating}>
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          className={`${styles.star} ${value <= rating ? styles.selected : ""}`}
          data-value={value}
          onClick={() => setRating(value)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    comment?: string;
    rating?: string;
  }>({});
  const usernameRef = React.useRef<HTMLInputElement>(null);
  const commentRef = React.useRef<HTMLTextAreaElement>(null);
  const ratingRef = React.useRef<HTMLDivElement>(null);

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

  const validateForm = () => {
    const errors: { username?: string; comment?: string; rating?: string } = {};
    // Имя
    if (!username.trim()) errors.username = "Введите имя";
    else if (username.length < 2) errors.username = "Имя слишком короткое";
    else if (username.length > 20) errors.username = "Имя слишком длинное";
    else if (/https?:\/\//i.test(username))
      errors.username = "Имя не должно содержать ссылок";
    else if (/[^a-zA-Zа-яА-ЯёЁ0-9 \-]/.test(username))
      errors.username = "Имя содержит недопустимые символы";
    // Комментарий
    if (!comment.trim()) errors.comment = "Введите отзыв";
    else if (comment.length < 10)
      errors.comment = "Отзыв слишком короткий (минимум 10 символов)";
    else if (comment.length > 500)
      errors.comment = "Отзыв слишком длинный (максимум 500 символов)";
    else if (/https?:\/\//i.test(comment))
      errors.comment = "Отзыв не должен содержать ссылок";
    // Рейтинг
    if (rating === 0) errors.rating = "Поставьте оценку";
    return errors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const errors = validateForm();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      // Фокус только если ошибка есть у поля
      if (errors.username && usernameRef.current) {
        usernameRef.current.focus();
      } else if (errors.comment && commentRef.current) {
        commentRef.current.focus();
      } else if (errors.rating && ratingRef.current) {
        // Только если есть ошибка рейтинга
        ratingRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }
    setFormError(null);
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      const commentsRef = collection(db, "feedbacks");
      await addDoc(commentsRef, {
        username,
        comment,
        rating,
        timestamp: serverTimestamp(),
      });
      setUsername("");
      setComment("");
      setRating(0);
    } catch (error) {
      console.error("Ошибка при добавлении отзыва:", error);
      setFormError("Ошибка при отправке. Попробуйте ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2>Оставьте отзыв</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ваше имя"
            maxLength={20}
            style={
              fieldErrors.username
                ? { borderColor: "red", background: "#fff6f6" }
                : {}
            }
            ref={usernameRef}
          />
          {fieldErrors.username && (
            <div style={{ color: "red", marginBottom: 16 }}>
              {fieldErrors.username}
            </div>
          )}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ваш отзыв"
            maxLength={500}
            style={
              fieldErrors.comment
                ? { borderColor: "red", background: "#fff6f6" }
                : {}
            }
            ref={commentRef}
          ></textarea>
          {fieldErrors.comment && (
            <div style={{ color: "red", marginBottom: 16 }}>
              {fieldErrors.comment}
            </div>
          )}

          <div style={{ marginBottom: 8 }} tabIndex={-1} ref={ratingRef}>
            <StarRating rating={rating} setRating={setRating} />
          </div>
          {fieldErrors.rating && (
            <div style={{ color: "red", marginBottom: 16 }}>
              {fieldErrors.rating}
            </div>
          )}

          {formError && (
            <div style={{ color: "red", marginBottom: 12 }}>{formError}</div>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Отправка..." : "Отправить"}
          </button>
        </form>
      </div>
      <iframe src="https://yandex.by/sprav/widget/rating-badge/13269874920?type=rating" width="150" height="50"></iframe>
      <div className={styles.commentsSection}>
        <h2>Отзывы</h2>
        <div className={styles.comments}>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className={styles.comment}>
                <div className={styles.avatar}>
                  {review.username.charAt(0).toUpperCase()}
                </div>
                <div className={styles.commentContent}>
                  <div className={styles.commentHeader}>
                    <strong>{review.username}</strong>
                    <small>
                      {review.timestamp
                        ? new Date(
                            review.timestamp.seconds * 1000,
                          ).toLocaleString("ru-RU")
                        : "Недавно"}
                    </small>
                  </div>
                  <div className={styles.rating}>
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                  <p>{review.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Отзывов пока нет. Будьте первым!</p>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/utils/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import styles from './Reviews.module.css';

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

const StarRating = ({ rating, setRating }: { rating: number, setRating: (r: number) => void }) => {
  return (
    <div className={styles.starRating}>
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          className={`${styles.star} ${value <= rating ? styles.selected : ''}`}
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
  const [username, setUsername] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const commentsRef = collection(db, 'feedbacks');
    const q = query(commentsRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Review));
      setReviews(fetchedReviews);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !comment.trim() || rating === 0) {
      alert("Пожалуйста, заполните все поля и выберите рейтинг!");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const commentsRef = collection(db, 'feedbacks');
      await addDoc(commentsRef, {
        username,
        comment,
        rating,
        timestamp: serverTimestamp()
      });
      setUsername('');
      setComment('');
      setRating(0);
    } catch (error) {
      console.error("Ошибка при добавлении отзыва:", error);
      alert("Ошибка при отправке. Попробуйте ещё раз.");
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
            required
          />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ваш отзыв"
            required
          ></textarea>

          <StarRating rating={rating} setRating={setRating} />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      </div>

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
                      {review.timestamp ? new Date(review.timestamp.seconds * 1000).toLocaleString('ru-RU') : 'Недавно'}
                    </small>
                  </div>
                  <div className={styles.rating}>
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
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
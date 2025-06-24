"use client";
import React, { useEffect, useState, useRef } from 'react';
import { db } from '@/utils/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import styles from './ReviewsCarousel.module.css';
import { useRouter } from 'next/navigation';

interface Review {
    id: string;
    username: string;
    comment: string;
    rating: number;
    timestamp?: { seconds: number; nanoseconds: number };
}

function getAvatarLetter(name: string) {
    return name?.charAt(0).toUpperCase() || '?';
}

function getUsername(name: string) {
    // Генерируем ник из имени (например, @ivanov)
    return '@' + name.toLowerCase().replace(/\s+/g, '').slice(0, 12);
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
                    textRef.current.textContent = original.slice(0, mid) + '...';
                    if (textRef.current.offsetHeight > 150) {
                        end = mid - 1;
                    } else {
                        result = original.slice(0, mid) + '...';
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
            <div className={styles.quoteMark}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M11.0771 2.46997C11.4187 1.64868 12.5821 1.64868 12.9237 2.46997L15.3331 8.26292L21.5871 8.76429C22.4738 8.83538 22.8333 9.94188 22.1578 10.5206L17.3929 14.6022L18.8486 20.705C19.055 21.5702 18.1138 22.2541 17.3547 21.7904L12.0004 18.52L6.64613 21.7904C5.88703 22.2541 4.94578 21.5702 5.15217 20.705L6.60791 14.6022L1.84305 10.5206C1.16751 9.94188 1.52703 8.83538 2.41369 8.76429L8.66766 8.26292L11.0771 2.46997ZM13.9482 8.83896C14.1642 9.35832 14.6526 9.71317 15.2133 9.75812L20.2689 10.1634L16.4171 13.463C15.9899 13.8289 15.8033 14.4031 15.9338 14.9502L17.1106 19.8837L12.7823 17.2399C12.3023 16.9467 11.6985 16.9467 11.2185 17.2399L6.89016 19.8837L8.06697 14.9502C8.19749 14.4031 8.01093 13.8289 7.58375 13.463L3.73186 10.1634L8.78753 9.75812C9.34821 9.71317 9.83663 9.35832 10.0526 8.83896L12.0004 4.15598L13.9482 8.83896Z" fill="#FFD700" />
                </svg>
            </div>
            <p
                className={showButton ? styles.clampText + ' ' + styles.text : styles.text}
                ref={textRef}
            >
                {showButton && clampedText ? clampedText : review.comment}
            </p>
            {showButton && (
                <button
                    className={styles.fullButton}
                    onClick={() => router.push('/reviews')}
                    type="button"
                >
                    Смотреть полностью
                </button>
            )}
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
        const commentsRef = collection(db, 'feedbacks');
        const q = query(commentsRef, orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedReviews = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }) as Review);
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
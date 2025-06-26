import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>🔍</div>
        <h1 className={styles.title}>Товар не найден</h1>
        <div className={styles.joke}>
          Похоже, этот товар ушёл в отпуск! Но не переживайте, у нас есть ещё
          много отличных предложений.
        </div>
        <p className={styles.description}>
          К сожалению, запрашиваемый товар не существует или был удален.
          <br />
          Попробуйте поискать что-то другое или вернитесь в каталог.
        </p>
        <div className={styles.actions}>
          <Link href="/catalog" className={styles.primaryButton}>
            Перейти в каталог
          </Link>
          <Link href="/" className={styles.secondaryButton}>
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

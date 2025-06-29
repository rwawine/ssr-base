import styles from "./NotFound.module.css";
import Link from "next/link";
import React from "react";
import BackButton from "./BackButton";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Breadcrumbs
          items={[
            { name: "Главная", url: "https://dilavia.by/" },
            { name: "404", url: "https://dilavia.by/404" },
          ]}
        />
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Страница не найдена</h2>
        <p className={styles.description}>
          К сожалению, запрашиваемая страница не существует или была перемещена.
        </p>
        <div className={styles.actions}>
          <BackButton className={styles.button} />
          <Link href="/" className={`${styles.button} ${styles.primary}`}>
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

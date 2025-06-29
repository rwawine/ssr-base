import React from "react";
import Image from "next/image";
import styles from "./AboutPage.module.css";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import { getAboutData, type AboutData } from "@/services";

export default async function AboutPage() {
  const aboutData = await getAboutData();

  return (
    <div className={styles.pageContainer}>
      <Breadcrumbs
        items={[
          { name: "Главная", url: "/" },
          { name: "О компании", url: "/about" },
        ]}
      />
      <h1 className={styles.title}>{aboutData.T1}</h1>

      {aboutData.image1 && aboutData.image1.length > 0 && (
        <section className={styles.banner}>
          <Image
            src={aboutData.image1[0].url}
            alt="Интерьер с мебелью Dilavia"
            layout="fill"
            className={styles.bannerImage}
            priority
          />
        </section>
      )}

      <div className={styles.header}>
        <p className={styles.subtitle}>{aboutData.T2}</p>
      </div>

      {aboutData.inf && aboutData.inf.length > 0 && (
        <section className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>☘️</span>
            <p>{aboutData.inf[0].t1}</p>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🌍</span>
            <p>{aboutData.inf[0].t2}</p>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>✅</span>
            <p>{aboutData.inf[0].t3}</p>
          </div>
        </section>
      )}

      <section className={styles.interiorSection}>
        {aboutData.image2 && aboutData.image2.length > 0 && (
          <div className={styles.interiorImageWrapper}>
            <Image
              src={aboutData.image2[0].url}
              alt="Стильный интерьер с мебелью"
              width={800}
              height={550}
              className={styles.interiorImage}
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
        <div className={styles.interiorContent}>
          <h2 className={styles.interiorTitle}>{aboutData.t3}</h2>
          <div className={styles.descriptionBox}>
            <p>{aboutData.t3_5}</p>
          </div>
        </div>
      </section>

      <section className={styles.resultSection}>
        <div className={styles.resultLogo}>□ DILAVIA</div>
        <h2 className={styles.resultTitle}>{aboutData.t4}</h2>
      </section>

      <section className={styles.factorySection}>
        <div className={styles.factoryInfo}>
          <h2 className={styles.factoryTitle}>{aboutData.t5}</h2>
          <p className={styles.factoryText}>{aboutData.t5_5}</p>
        </div>
      </section>
    </div>
  );
}

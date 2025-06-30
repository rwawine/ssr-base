import React from "react";
import styles from "./ContactsPage.module.css";
import { ContactForm } from "@/components/contact-form/ContactForm";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";

export default function ContactsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: "https://dilavia.by/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Контакты",
        item: "https://dilavia.by/contacts",
      },
    ],
  };
  return (
    <div className={styles.pageContainer}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Breadcrumbs
        items={[
          { name: "Главная", url: "https://dilavia.by/" },
          { name: "Контакты", url: "https://dilavia.by/contacts" },
        ]}
      />

      <h1 className={styles.title}>Наши контакты</h1>

      <div className={styles.contentWrapper}>
        <aside className={styles.contactInfo}>
          <div className={styles.infoBlock}>
            <h3>Адрес</h3>
            <p>г. Минск, ул. Железнодорожная, д. 33А, оф. 402, 220089</p>
          </div>
          <div className={styles.infoBlock}>
            <h3>Телефон</h3>
            <p>
              <a href="tel:+375336641830">+375 (33) 664-18-30</a>
            </p>
            <p>
              <a href="tel:+375298019271">+375 (29) 801-92-71</a>
            </p>
          </div>
          <div className={styles.infoBlock}>
            <h3>Email</h3>
            <p>
              <a href="mailto:infomiagkhikomfort@gmail.com">
                infomiagkhikomfort@gmail.com
              </a>
            </p>
          </div>
        </aside>

        <ContactForm
          showTopic={true}
          showPhone={true}
          title="Форма обратной связи"
          contactDropdownItems={[
            { label: "Сотрудничество", value: "cooperation" },
            { label: "Вопрос по заказу", value: "order_question" },
            { label: "Вопрос по товару", value: "product_question" },
            { label: "Другое", value: "other" },
          ]}
        />
      </div>

      <div className={styles.mapContainer}>
        <iframe
          src="https://yandex.ru/map-widget/v1/?um=constructor%3Acb083bc486aed45f850ece7385add2f7e81cb687e9d55eb869b506291fac6df9&amp;source=constructor"
          width="100%"
          height="100%"
          frameBorder="0"
          title="Карта проезда к мебельной фабрике Dilavia"
          loading="lazy"
        />
      </div>
    </div>
  );
}

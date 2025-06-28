import React from "react";
import { Metadata } from "next";
import styles from "./PrivacyPage.module.css";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata(
  {
    title: "Политика конфиденциальности | Dilavia",
    description:
      "Политика конфиденциальности интернет-магазина Dilavia. Как мы обрабатываем и защищаем ваши персональные данные.",
    keywords: "политика конфиденциальности, персональные данные, защита данных",
    noindex: true, // Страница не должна индексироваться
  },
  "/privacy",
);

export default function PrivacyPage() {
  return (
    <div className={styles.pageContainer}>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "https://dilavia.by/" },
          { label: "Политика конфиденциальности" },
        ]}
        className={styles.breadcrumbs}
      />

      <h1 className={styles.title}>Политика конфиденциальности</h1>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Общие положения</h2>
          <p className={styles.text}>
            Настоящая Политика конфиденциальности (далее — «Политика»)
            определяет порядок обработки персональных данных пользователей сайта
            dilavia.by (далее — «Сайт») компанией Dilavia (далее — «Компания»,
            «мы», «нас», «наш»).
          </p>
          <p className={styles.text}>
            Используя наш Сайт, вы соглашаетесь с условиями данной Политики.
            Если вы не согласны с какими-либо условиями, пожалуйста, не
            используйте наш Сайт.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Сбор персональных данных</h2>
          <p className={styles.text}>
            Мы собираем следующие виды персональных данных:
          </p>
          <ul className={styles.list}>
            <li>Контактная информация (имя, email, телефон)</li>
            <li>Адрес доставки</li>
            <li>Информация о заказах и предпочтениях</li>
            <li>
              Технические данные (IP-адрес, тип браузера, операционная система)
            </li>
            <li>
              Данные о взаимодействии с сайтом (страницы, время посещения)
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Цели обработки данных</h2>
          <p className={styles.text}>
            Ваши персональные данные используются для следующих целей:
          </p>
          <ul className={styles.list}>
            <li>Обработка и выполнение заказов</li>
            <li>Связь с клиентами и поддержка</li>
            <li>Улучшение качества обслуживания</li>
            <li>Аналитика и оптимизация работы сайта</li>
            <li>Соблюдение юридических обязательств</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            4. Правовые основания обработки
          </h2>
          <p className={styles.text}>
            Обработка персональных данных осуществляется на следующих правовых
            основаниях:
          </p>
          <ul className={styles.list}>
            <li>Согласие субъекта персональных данных</li>
            <li>Исполнение договора</li>
            <li>Выполнение юридических обязательств</li>
            <li>Законные интересы Компании</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            5. Передача данных третьим лицам
          </h2>
          <p className={styles.text}>
            Мы не продаем, не обмениваем и не передаем ваши персональные данные
            третьим лицам, за исключением следующих случаев:
          </p>
          <ul className={styles.list}>
            <li>С вашего явного согласия</li>
            <li>Для выполнения заказа (службы доставки, платежные системы)</li>
            <li>По требованию закона или судебных органов</li>
            <li>Для защиты наших прав и безопасности</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Безопасность данных</h2>
          <p className={styles.text}>
            Мы принимаем соответствующие технические и организационные меры для
            защиты ваших персональных данных от несанкционированного доступа,
            изменения, раскрытия или уничтожения.
          </p>
          <p className={styles.text}>К таким мерам относятся:</p>
          <ul className={styles.list}>
            <li>Шифрование данных при передаче</li>
            <li>Регулярное обновление систем безопасности</li>
            <li>Ограничение доступа к персональным данным</li>
            <li>Мониторинг и аудит систем</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            7. Права субъектов персональных данных
          </h2>
          <p className={styles.text}>
            В соответствии с законодательством вы имеете право:
          </p>
          <ul className={styles.list}>
            <li>Получать информацию об обработке ваших данных</li>
            <li>Требовать исправления неточных данных</li>
            <li>Требовать удаления данных</li>
            <li>Ограничивать обработку данных</li>
            <li>Переносить данные</li>
            <li>Отзывать согласие на обработку</li>
            <li>Подавать жалобу в уполномоченный орган</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            8. Cookies и аналогичные технологии
          </h2>
          <p className={styles.text}>
            Наш сайт использует cookies и аналогичные технологии для улучшения
            пользовательского опыта, анализа трафика и персонализации контента.
          </p>
          <p className={styles.text}>
            Вы можете управлять настройками cookies в вашем браузере. Обратите
            внимание, что отключение cookies может повлиять на функциональность
            сайта.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>9. Срок хранения данных</h2>
          <p className={styles.text}>
            Персональные данные хранятся в течение времени, необходимого для
            достижения целей обработки, или в течение срока, установленного
            законодательством.
          </p>
          <p className={styles.text}>
            Данные о заказах хранятся в течение 5 лет в соответствии с
            требованиями налогового законодательства.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>10. Изменения в Политике</h2>
          <p className={styles.text}>
            Мы оставляем за собой право вносить изменения в данную Политику. О
            существенных изменениях мы будем уведомлять вас через сайт или по
            электронной почте.
          </p>
          <p className={styles.text}>
            Рекомендуем периодически знакомиться с актуальной версией Политики.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>11. Контактная информация</h2>
          <p className={styles.text}>
            По всем вопросам, связанным с обработкой персональных данных, вы
            можете обращаться к нам:
          </p>
          <div className={styles.contactInfo}>
            <p>
              <strong>Email:</strong> privacy@dilavia.by
            </p>
            <p>
              <strong>Телефон:</strong> +375 (29) 123-45-67
            </p>
            <p>
              <strong>Адрес:</strong> Республика Беларусь, г. Минск
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>12. Заключительные положения</h2>
          <p className={styles.text}>
            Данная Политика вступает в силу с момента ее размещения на сайте и
            действует до момента принятия новой редакции.
          </p>
          <p className={styles.text}>
            <strong>Дата последнего обновления:</strong>{" "}
            {new Date().toLocaleDateString("ru-RU")}
          </p>
        </section>
      </div>
    </div>
  );
}

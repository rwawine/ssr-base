import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import styles from "./Delivery.module.css";
import Accordion from "@/components/faq/Accordion";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import { FAQSchema } from "@/components/schema";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata(
  {
    title: "Доставка мебели по Беларуси | Dilavia",
    description:
      "Доставка мебели по всей Беларуси. Бесплатная доставка в Минске. Сроки, условия, стоимость доставки.",
    keywords:
      "доставка мебели, доставка по Беларуси, бесплатная доставка, сроки доставки, условия доставки",
  },
  "/delivery",
);

const faqItems = [
  {
    title: "Как осуществляется доставка?",
    content:
      "Доставка осуществляется по всей Беларуси. В Минске доставка бесплатная. В другие города доставка осуществляется через транспортные компании - бесплатно.",
  },
  {
    title: "Какие способы оплаты доступны?",
    content:
      "Мы принимаем оплату наличными при получении, банковской картой через терминал курьера, а также безналичным расчетом для юридических лиц.",
  },
  {
    title: "Как долго изготавливается мебель?",
    content:
      "Срок изготовления мебели зависит от модели и загруженности производства. В среднем, изготовление занимает от 2 до 4 недель. Точные сроки уточняйте у менеджера.",
  },
  {
    title: "Есть ли гарантия на мебель?",
    content:
      "Да, на всю нашу мебель предоставляется гарантия 18 месяцев. В течение гарантийного срока мы бесплатно устраняем производственные дефекты.",
  },
  {
    title: "Можно ли вернуть или обменять мебель?",
    content:
      "Да, в течение 14 дней с момента получения вы можете вернуть или обменять мебель, если она осталась в заводской упаковке. Мебель должна быть в идеальном состоянии.",
  },
];

export default function DeliveryPage() {
  return (
    <main className={styles.container}>
      <FAQSchema
        items={faqItems.map(({ title, content }) => ({
          question: title,
          answer: content,
        }))}
      />
      <Breadcrumbs
        items={[
          { label: "Главная", href: "https://dilavia.by/" },
          { label: "Покупателю" },
        ]}
        className={styles.breadcrumbs}
      />
      <h1 className={styles.mainTitle}>Покупателю</h1>
      <h2 className={styles.sectionTitle}>Часто задаваемые вопросы</h2>
      <Accordion items={faqItems} />
    </main>
  );
}

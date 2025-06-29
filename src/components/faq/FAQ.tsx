import React from "react";
import styles from "./FAQ.module.css";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  className?: string;
}

export function FAQ({
  items,
  title = "Часто задаваемые вопросы",
  className,
}: FAQProps) {
  if (!items || items.length === 0) {
    return null;
  }

  // Генерируем структурированные данные для FAQ
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className={`${styles.faq} ${className || ""}`}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.faqList}>
          {items.map((item, index) => (
            <div key={index} className={styles.faqItem}>
              <h3 className={styles.question}>{item.question}</h3>
              <div className={styles.answer}>
                <div>{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FAQ;

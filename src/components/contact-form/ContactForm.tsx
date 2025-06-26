"use client";

import { useState } from "react";
import { submitContactForm } from "@/lib/actions";
import { contactFormSchema, type ContactFormData } from "@/lib/schemas";
import styles from "./ContactForm.module.css";

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      // Валидируем данные
      const validatedData = contactFormSchema.parse(formData);
      const response = await submitContactForm(validatedData);

      if (response.data) {
        setResult(response.data);

        if (response.data.success) {
          setFormData({ name: "", email: "", phone: "", message: "" });
        }
      } else if (response.serverError) {
        setResult({ success: false, error: response.serverError });
      } else if (response.validationErrors) {
        setResult({ success: false, error: "Ошибка валидации формы" });
      }
    } catch (error) {
      console.error("Validation error:", error);
      setResult({ success: false, error: "Ошибка валидации формы" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Свяжитесь с нами</h2>

      {result?.success && (
        <div className={styles.success}>{result.message}</div>
      )}

      {result?.error && <div className={styles.error}>{result.error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Имя *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Введите ваше имя"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Введите ваш email"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="phone" className={styles.label}>
            Телефон *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Введите ваш телефон"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="message" className={styles.label}>
            Сообщение *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className={styles.textarea}
            placeholder="Введите ваше сообщение"
            rows={5}
            required
            disabled={isSubmitting}
          />
        </div>

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Отправка..." : "Отправить сообщение"}
        </button>
      </form>
    </div>
  );
}

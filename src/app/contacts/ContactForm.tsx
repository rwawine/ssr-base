"use client";

import React, { useState } from "react";
import styles from "./ContactsPage.module.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    topic: false,
    message: false,
  });

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name":
        if (!value.trim()) {
          return "Имя обязательно для заполнения";
        }
        if (value.trim().length < 2) {
          return "Имя должно содержать минимум 2 символа";
        }
        if (!/^[а-яёА-ЯЁ\s-]+$/.test(value.trim())) {
          return "Имя может содержать только буквы, пробелы и дефисы";
        }
        return "";

      case "email":
        if (!value.trim()) {
          return "Email обязателен для заполнения";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          return "Введите корректный email адрес";
        }
        return "";

      case "topic":
        if (!value.trim()) {
          return "Выберите тему обращения";
        }
        return "";

      case "message":
        if (!value.trim()) {
          return "Сообщение обязательно для заполнения";
        }
        if (value.trim().length < 10) {
          return "Сообщение должно содержать минимум 10 символов";
        }
        if (value.trim().length > 1000) {
          return "Сообщение не должно превышать 1000 символов";
        }
        return "";

      default:
        return "";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Валидация при вводе, если поле уже было в фокусе
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      topic: validateField("topic", formData.topic),
      message: validateField("message", formData.message),
    };

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      topic: true,
      message: true,
    });

    return (
      !newErrors.name &&
      !newErrors.email &&
      !newErrors.topic &&
      !newErrors.message
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Здесь будет логика отправки формы
    console.log("Форма отправлена:", formData);
    alert("Форма отправлена (демонстрация)");
  };

  return (
    <section className={styles.contactForm}>
      <h2 className={styles.formTitle}>Форма обратной связи</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Ваше имя</label>
          <input
            type="text"
            id="name"
            name="name"
            className={`${styles.input} ${errors.name && touched.name ? styles.inputError : ""}`}
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          {errors.name && touched.name && (
            <div className={styles.errorMessage}>{errors.name}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Ваш Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ""}`}
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          {errors.email && touched.email && (
            <div className={styles.errorMessage}>{errors.email}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="topic">Тема обращения</label>
          <select
            id="topic"
            name="topic"
            className={`${styles.select} ${errors.topic && touched.topic ? styles.inputError : ""}`}
            value={formData.topic}
            onChange={handleInputChange}
            onBlur={handleBlur}
          >
            <option value="">Выберите тему</option>
            <option value="cooperation">Сотрудничество</option>
            <option value="order_question">Вопрос по заказу</option>
            <option value="product_question">Вопрос по товару</option>
            <option value="other">Другое</option>
          </select>
          {errors.topic && touched.topic && (
            <div className={styles.errorMessage}>{errors.topic}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message">Ваше сообщение</label>
          <textarea
            id="message"
            name="message"
            className={`${styles.textarea} ${errors.message && touched.message ? styles.inputError : ""}`}
            value={formData.message}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          {errors.message && touched.message && (
            <div className={styles.errorMessage}>{errors.message}</div>
          )}
        </div>

        <button type="submit" className={styles.submitButton}>
          Отправить
        </button>
      </form>
    </section>
  );
}

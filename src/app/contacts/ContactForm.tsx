"use client";

import React, { useState } from "react";
import styles from "./ContactsPage.module.css";

interface FormData {
  name: string;
  email: string;
  topic: string;
  message: string;
}

interface FormErrors {
  name: string;
  email: string;
  topic: string;
  message: string;
}

interface FormTouched {
  name: boolean;
  email: boolean;
  topic: boolean;
  message: boolean;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const [touched, setTouched] = useState<FormTouched>({
    name: false,
    email: false,
    topic: false,
    message: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const validateField = (name: string, value: string): string => {
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

    // Сбрасываем статус отправки при изменении формы
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' });
    }

    // Валидация при вводе, если поле уже было в фокусе
    if (touched[name as keyof FormTouched]) {
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

  const validateForm = (): boolean => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Отправляем данные на API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact_form',
          name: formData.name,
          email: formData.email,
          topic: formData.topic,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.'
        });
        
        // Очищаем форму при успешной отправке
        setFormData({
          name: "",
          email: "",
          topic: "",
          message: "",
        });
        setTouched({
          name: false,
          email: false,
          topic: false,
          message: false,
        });
        setErrors({
          name: "",
          email: "",
          topic: "",
          message: "",
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Произошла ошибка при отправке сообщения. Попробуйте еще раз.'
        });
      }
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Произошла ошибка при отправке сообщения. Проверьте подключение к интернету и попробуйте еще раз.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.contactForm}>
      <h2 className={styles.formTitle}>Форма обратной связи</h2>
      
      {submitStatus.type && (
        <div className={`${styles.submitStatus} ${styles[submitStatus.type]}`}>
          {submitStatus.message}
        </div>
      )}

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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
          {errors.message && touched.message && (
            <div className={styles.errorMessage}>{errors.message}</div>
          )}
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Отправка..." : "Отправить"}
        </button>
      </form>
    </section>
  );
}

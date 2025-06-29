"use client";

import { useState } from "react";
import { submitContactForm } from "@/lib/actions";
import { contactFormSchema, type ContactFormData } from "@/lib/schemas";
import styles from "./ContactForm.module.css";

interface ContactFormProps {
  // Настройки для выпадающего меню контактов
  showContactDropdown?: boolean;
  contactDropdownItems?: Array<{
    label: string;
    value: string;
  }>;

  // Настройки для модальных окон
  showModalFeatures?: boolean;
  modalTitle?: string;
  modalDescription?: string;

  // Общие настройки
  title?: string;
  showPhone?: boolean;
  showTopic?: boolean;
  customStyles?: string;
  onSubmit?: (data: ContactFormData) => void;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
}

export function ContactForm({
  showContactDropdown = false,
  contactDropdownItems = [
    { label: "Сотрудничество", value: "cooperation" },
    { label: "Вопрос по заказу", value: "order_question" },
    { label: "Вопрос по товару", value: "product_question" },
    { label: "Другое", value: "other" },
  ],
  showModalFeatures = false,
  modalTitle = "Свяжитесь с нами",
  modalDescription,
  title = "Форма обратной связи",
  showPhone = false,
  showTopic = false,
  customStyles,
  onSubmit,
  onSuccess,
  onError,
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    topic: showTopic ? "" : undefined,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    topic: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    message: false,
    topic: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
  } | null>(null);

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
          return "Введите корректный email";
        }
        return "";

      case "phone":
        if (!value.trim()) {
          return "Телефон обязателен для заполнения";
        }
        // Поддержка белорусских номеров +375 и российских +7/8
        const phoneRegex =
          /^(\+375|375|\+7|8)?[\s\-]?\(?[0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        const cleanPhone = value.replace(/\s/g, "");
        if (!phoneRegex.test(cleanPhone)) {
          return "Введите корректный номер телефона (+375 для Беларуси, +7 для России)";
        }
        return "";

      case "message":
        if (!value.trim()) {
          return "Сообщение обязательно для заполнения";
        }
        if (value.trim().length < 10) {
          return "Сообщение должно содержать минимум 10 символов";
        }
        if (value.trim().length > 500) {
          return "Сообщение не должно превышать 500 символов";
        }
        return "";

      case "topic":
        if (showTopic && !value.trim()) {
          return "Выберите тему обращения";
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
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Сбрасываем статус отправки при изменении формы
    if (result) {
      setResult(null);
    }

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
      phone: showPhone ? validateField("phone", formData.phone || "") : "",
      message: validateField("message", formData.message),
      topic: showTopic ? validateField("topic", formData.topic || "") : "",
    };

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      message: true,
      topic: true,
    });

    return (
      !newErrors.name &&
      !newErrors.email &&
      (!showPhone || !newErrors.phone) &&
      !newErrors.message &&
      (!showTopic || !newErrors.topic)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      // Если передан кастомный обработчик, используем его
      if (onSubmit) {
        await onSubmit(formData);
        return;
      }

      // Валидируем форму
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      // Валидируем данные через схему
      const validatedData = contactFormSchema.parse(formData);
      const response = await submitContactForm(validatedData);

      if (response.data) {
        setResult(response.data);

        if (response.data.success) {
          setFormData({
            name: "",
            email: "",
            phone: "",
            message: "",
            topic: showTopic ? "" : undefined,
          });

          // Сбрасываем состояния ошибок и touched
          setErrors({
            name: "",
            email: "",
            phone: "",
            message: "",
            topic: "",
          });
          setTouched({
            name: false,
            email: false,
            phone: false,
            message: false,
            topic: false,
          });

          if (onSuccess) {
            onSuccess(response.data);
          }
        }
      } else if (response.serverError) {
        const error = { success: false, error: response.serverError };
        setResult(error);
        if (onError) {
          onError(error);
        }
      } else if (response.validationErrors) {
        const error = { success: false, error: "Ошибка валидации формы" };
        setResult(error);
        if (onError) {
          onError(error);
        }
      }
    } catch (error) {
      console.error("Validation error:", error);
      const errorResult = { success: false, error: "Ошибка валидации формы" };
      setResult(errorResult);
      if (onError) {
        onError(errorResult);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.containerContactForm} ${customStyles || ""}`}>
      <h2 className={styles.title}>{title}</h2>

      {modalDescription && showModalFeatures && (
        <p className={styles.description}>{modalDescription}</p>
      )}

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
            onBlur={handleBlur}
            className={`${styles.input} ${errors.name && touched.name ? styles.inputError : ""}`}
            placeholder="Введите ваше имя"
            disabled={isSubmitting}
          />
          {errors.name && touched.name && (
            <div className={styles.errorMessage}>{errors.name}</div>
          )}
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
            onBlur={handleBlur}
            className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ""}`}
            placeholder="Введите ваш email"
            disabled={isSubmitting}
          />
          {errors.email && touched.email && (
            <div className={styles.errorMessage}>{errors.email}</div>
          )}
        </div>

        {showPhone && (
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
              onBlur={handleBlur}
              className={`${styles.input} ${errors.phone && touched.phone ? styles.inputError : ""}`}
              placeholder="Введите ваш телефон"
              disabled={isSubmitting}
            />
            {errors.phone && touched.phone && (
              <div className={styles.errorMessage}>{errors.phone}</div>
            )}
          </div>
        )}

        {showTopic && (
          <div className={styles.field}>
            <label htmlFor="topic" className={styles.label}>
              Тема обращения
            </label>
            <select
              id="topic"
              name="topic"
              value={formData.topic || ""}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`${styles.input} ${errors.topic && touched.topic ? styles.inputError : ""}`}
              disabled={isSubmitting}
            >
              <option value="">Выберите тему</option>
              {contactDropdownItems.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            {errors.topic && touched.topic && (
              <div className={styles.errorMessage}>{errors.topic}</div>
            )}
          </div>
        )}

        <div className={styles.field}>
          <label htmlFor="message" className={styles.label}>
            Сообщение *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`${styles.textarea} ${errors.message && touched.message ? styles.inputError : ""}`}
            placeholder="Введите ваше сообщение"
            rows={5}
            disabled={isSubmitting}
          />
          {errors.message && touched.message && (
            <div className={styles.errorMessage}>{errors.message}</div>
          )}
        </div>

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Отправка..." : "Отправить сообщение"}
        </button>
      </form>
    </div>
  );
}

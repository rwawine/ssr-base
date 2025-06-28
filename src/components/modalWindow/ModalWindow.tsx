"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ModalWindow.module.css";

export type ModalContent = {
  type: "text" | "form" | "discount";
  title?: string;
  content?: string;
  image?: string;
  buttonText?: string;
  onButtonClick?: () => void;
};

interface ModalWindowProps {
  isOpen: boolean;
  onClose: () => void;
  content: ModalContent;
}

export default function ModalWindow({
  isOpen,
  onClose,
  content,
}: ModalWindowProps) {
  const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderContent = () => {
    switch (content.type) {
      case "text":
        return (
          <div className={styles.textContent}>
            {content.title && <h2 className={styles.title}>{content.title}</h2>}
            {content.content && (
              <p className={styles.text}>{content.content}</p>
            )}
            {content.buttonText && (
              <button
                className={styles.button}
                onClick={content.onButtonClick || onClose}
              >
                {content.buttonText}
              </button>
            )}
          </div>
        );

      case "form":
        return (
          <div className={styles.formContent}>
            {content.title && <h2 className={styles.title}>{content.title}</h2>}
            <ContactForm
              onClose={onClose}
              isPrivacyAccepted={isPrivacyAccepted}
              setIsPrivacyAccepted={setIsPrivacyAccepted}
            />
          </div>
        );

      case "discount":
        return (
          <div className={styles.discountContent}>
            {content.image && (
              <div className={styles.imageContainer}>
                <img
                  src={content.image}
                  alt="Скидка"
                  className={styles.discountImage}
                />
              </div>
            )}
            <div className={styles.discountText}>
              {content.title && (
                <h2 className={styles.title}>{content.title}</h2>
              )}
              {content.content && (
                <p className={styles.text}>{content.content}</p>
              )}
              {content.buttonText && (
                <button
                  className={styles.button}
                  onClick={content.onButtonClick || onClose}
                >
                  {content.buttonText}
                </button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.modalOverlay}
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <button className={styles.closeButton} onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {renderContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Компонент формы обратной связи
function ContactForm({
  onClose,
  isPrivacyAccepted,
  setIsPrivacyAccepted,
}: {
  onClose: () => void;
  isPrivacyAccepted: boolean;
  setIsPrivacyAccepted: (value: boolean) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    message: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

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

      default:
        return "";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Сбрасываем статус отправки при изменении формы
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: "" });
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
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
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
      phone: validateField("phone", formData.phone),
      message: validateField("message", formData.message),
    };

    setErrors(newErrors);
    setTouched({
      name: true,
      phone: true,
      message: true,
    });

    return !newErrors.name && !newErrors.phone && !newErrors.message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPrivacyAccepted) {
      setSubmitStatus({
        type: "error",
        message: "Необходимо согласиться с обработкой персональных данных",
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Подготавливаем данные для отправки
      const contactData = {
        type: "contact" as const,
        name: formData.name,
        phone: formData.phone,
        message: formData.message,
      };

      // Отправляем данные на API
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus({
          type: "success",
          message:
            "Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.",
        });

        // Очищаем форму при успешной отправке
        setFormData({
          name: "",
          phone: "",
          message: "",
        });
        setTouched({
          name: false,
          phone: false,
          message: false,
        });
        setErrors({
          name: "",
          phone: "",
          message: "",
        });

        // Закрываем модальное окно через 2 секунды
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setSubmitStatus({
          type: "error",
          message:
            result.error ||
            "Произошла ошибка при отправке сообщения. Попробуйте еще раз.",
        });
      }
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
      setSubmitStatus({
        type: "error",
        message:
          "Произошла ошибка при отправке сообщения. Проверьте подключение к интернету и попробуйте еще раз.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {submitStatus.type && (
        <div className={`${styles.submitStatus} ${styles[submitStatus.type]}`}>
          {submitStatus.message}
        </div>
      )}

      <div className={styles.formGroup}>
        <input
          type="text"
          name="name"
          placeholder="Ваше имя"
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
        <input
          type="tel"
          name="phone"
          placeholder="Ваш телефон"
          className={`${styles.input} ${errors.phone && touched.phone ? styles.inputError : ""}`}
          value={formData.phone}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
        />
        {errors.phone && touched.phone && (
          <div className={styles.errorMessage}>{errors.phone}</div>
        )}
      </div>

      <div className={styles.formGroup}>
        <textarea
          name="message"
          placeholder="Ваше сообщение"
          className={`${styles.textarea} ${errors.message && touched.message ? styles.inputError : ""}`}
          rows={4}
          value={formData.message}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
        />
        {errors.message && touched.message && (
          <div className={styles.errorMessage}>{errors.message}</div>
        )}
      </div>

      <div className={styles.privacyCheckbox}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isPrivacyAccepted}
            onChange={(e) => setIsPrivacyAccepted(e.target.checked)}
            className={styles.checkbox}
            disabled={isSubmitting}
          />
          <span className={styles.checkmark}></span>
          <span className={styles.privacyText}>
            Я согласен с обработкой персональных данных в соответствии с{" "}
            <a href="/privacy" className={styles.privacyLink}>
              политикой конфиденциальности
            </a>
          </span>
        </label>
      </div>

      <button
        type="submit"
        className={styles.button}
        disabled={!isPrivacyAccepted || isSubmitting}
      >
        {isSubmitting ? "Отправка..." : "Отправить"}
      </button>
    </form>
  );
}

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "@/types";
import {
  contactFormSchema,
  checkoutFormSchema,
  reviewSchema,
  type ContactFormData,
  type CheckoutFormData,
  type ReviewData,
} from "./schemas";

const action = createSafeActionClient();

// Экшен для отправки контактной формы
export const submitContactForm = action(contactFormSchema, async (data) => {
  try {
    // Отправляем данные на API для отправки email
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "contact_form",
        name: data.name,
        email: data.email,
        phone: data.phone,
        topic: data.topic || "Общий вопрос",
        message: data.message,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error:
          result.error ||
          "Произошла ошибка при отправке сообщения. Попробуйте позже.",
      };
    }

    return {
      success: true,
      message:
        "Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.",
    };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return {
      success: false,
      error: "Произошла ошибка при отправке сообщения. Попробуйте позже.",
    };
  }
});

// Экшен для оформления заказа
export const submitCheckoutForm = action(checkoutFormSchema, async (data) => {
  try {
    // Здесь будет логика оформления заказа
    console.log("Checkout form submitted:", data);

    // Имитация обработки заказа
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      success: true,
      message:
        "Заказ успешно оформлен! Номер заказа: #" +
        Math.random().toString(36).substr(2, 9).toUpperCase(),
      data: {
        orderId: Math.random().toString(36).substr(2, 9).toUpperCase(),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Произошла ошибка при оформлении заказа. Попробуйте позже.",
    };
  }
});

// Экшен для добавления отзыва
export const submitReview = action(reviewSchema, async (data) => {
  try {
    // Здесь будет логика сохранения отзыва
    console.log("Review submitted:", data);

    // Имитация сохранения
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message: "Отзыв успешно добавлен! Спасибо за ваш отзыв.",
    };
  } catch (error) {
    return {
      success: false,
      error: "Произошла ошибка при добавлении отзыва. Попробуйте позже.",
    };
  }
});

// Экшен для поиска продуктов
export const searchProducts = action(
  z.object({
    query: z.string().min(1),
    category: z.string().optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(50).default(12),
  }),
  async (data) => {
    try {
      // Здесь будет логика поиска продуктов
      console.log("Searching products:", data);

      // Имитация поиска
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        success: true,
        data: {
          products: [],
          total: 0,
          page: data.page,
          limit: data.limit,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: "Произошла ошибка при поиске. Попробуйте позже.",
      };
    }
  },
);

// Экшен для добавления в корзину
export const addToCart = action(
  z.object({
    productId: z.string().min(1),
    quantity: z.number().min(1).default(1),
    variantId: z.string().optional(),
  }),
  async (data) => {
    try {
      // Здесь будет логика добавления в корзину
      console.log("Adding to cart:", data);

      return {
        success: true,
        message: "Товар добавлен в корзину!",
      };
    } catch (error) {
      return {
        success: false,
        error: "Произошла ошибка при добавлении в корзину.",
      };
    }
  },
);

// Экшен для добавления в избранное
export const addToFavorites = action(
  z.object({
    productId: z.string().min(1),
  }),
  async (data) => {
    try {
      // Здесь будет логика добавления в избранное
      console.log("Adding to favorites:", data);

      return {
        success: true,
        message: "Товар добавлен в избранное!",
      };
    } catch (error) {
      return {
        success: false,
        error: "Произошла ошибка при добавлении в избранное.",
      };
    }
  },
);

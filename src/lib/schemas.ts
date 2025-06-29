import { z } from "zod";

// Схема для контактной формы
export const contactFormSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Сообщение должно содержать минимум 10 символов"),
  topic: z.string().optional(),
});

// Схема для формы заказа
export const checkoutFormSchema = z.object({
  firstName: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  lastName: z.string().min(2, "Фамилия должна содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  phone: z.string().min(10, "Введите корректный номер телефона"),
  address: z.string().min(10, "Адрес должен содержать минимум 10 символов"),
  city: z.string().min(2, "Город должен содержать минимум 2 символа"),
  postalCode: z
    .string()
    .min(5, "Почтовый индекс должен содержать минимум 5 символов"),
  deliveryType: z.enum(["pickup", "delivery"]),
  paymentMethod: z.enum(["card", "cash"]),
});

// Схема для поиска
export const searchSchema = z.object({
  query: z.string().min(1, "Введите поисковый запрос"),
  category: z.string().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  sort: z
    .enum(["price_asc", "price_desc", "name_asc", "name_desc", "popularity"])
    .optional(),
});

// Схема для фильтров каталога
export const catalogFiltersSchema = z.object({
  categories: z.array(z.string()).optional(),
  priceRange: z
    .object({
      min: z.number().min(0),
      max: z.number().min(0),
    })
    .optional(),
  materials: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  availability: z.enum(["in_stock", "on_order", "all"]).optional(),
});

// Схема для отзывов
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(5, "Заголовок должен содержать минимум 5 символов"),
  content: z.string().min(10, "Отзыв должен содержать минимум 10 символов"),
  productId: z.string().min(1, "ID продукта обязателен"),
});

// Схема для пагинации
export const paginationSchema = z.object({
  page: z.number().min(1, "Номер страницы должен быть больше 0"),
  limit: z.number().min(1).max(100, "Лимит должен быть от 1 до 100"),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

// Типы для использования в TypeScript
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
export type SearchData = z.infer<typeof searchSchema>;
export type CatalogFiltersData = z.infer<typeof catalogFiltersSchema>;
export type ReviewData = z.infer<typeof reviewSchema>;
export type PaginationData = z.infer<typeof paginationSchema>;

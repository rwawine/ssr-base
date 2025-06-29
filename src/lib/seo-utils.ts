import type { Product } from "@/types/product";
import type { Metadata } from "next";

// Конфигурация ключевых слов по категориям
const categoryKeywords: Record<string, string[]> = {
  sofa: [
    "диван",
    "мягкая мебель",
    "диван для гостиной",
    "угловой диван",
    "прямой диван",
    "диван-кровать",
    "раскладной диван",
    "еврокнижка",
    "аккордеон",
    "клик-кляк",
    "мебель для гостиной",
    "комфортная мебель",
    "стильный диван",
  ],
  bed: [
    "кровать",
    "кровать для спальни",
    "ортопедическая кровать",
    "подъемная кровать",
    "кровать с ящиками",
    "кровать-трансформер",
    "мебель для спальни",
    "спальный гарнитур",
    "кровать односпальная",
    "кровать двуспальная",
    "кровать полутороспальная",
  ],
  armchair: [
    "кресло",
    "кресло для гостиной",
    "кресло-кровать",
    "кресло качалка",
    "кресло мешок",
    "комфортное кресло",
    "стильное кресло",
    "мягкое кресло",
    "кресло для отдыха",
  ],
  table: [
    "стол",
    "обеденный стол",
    "журнальный стол",
    "стол для гостиной",
    "стол трансформер",
    "стол-книжка",
    "стол для кухни",
    "стол для столовой",
    "деревянный стол",
  ],
};

// Конфигурация ключевых слов по стилям
const styleKeywords: Record<string, string[]> = {
  Современный: [
    "современная мебель",
    "современный дизайн",
    "модерн",
    "минимализм",
  ],
  Классический: [
    "классическая мебель",
    "классический стиль",
    "традиционная мебель",
  ],
  Лофт: ["лофт мебель", "индустриальный стиль", "стиль лофт"],
  Скандинавский: ["скандинавская мебель", "скандинавский стиль", "минимализм"],
};

// Конфигурация ключевых слов по материалам
const materialKeywords: Record<string, string[]> = {
  Ткань: ["тканевая обивка", "обивка тканью", "ткань для мебели"],
  Кожа: ["кожаная мебель", "натуральная кожа", "кожаная обивка"],
  Экокожа: ["экокожа", "искусственная кожа", "экологичная кожа"],
  Велюр: ["велюр", "велюровая обивка", "мягкий велюр"],
  Микрофибра: ["микрофибра", "микрофибровая обивка", "износостойкая ткань"],
};

// Локальные ключевые слова
const localKeywords = [
  "Минск",
  "Беларусь",
  "РБ",
  "Белоруссия",
  "мебель Минск",
  "купить мебель Минск",
  "доставка по Беларуси",
  "мебельный магазин Минск",
  "производство мебели Беларусь",
];

// Функция для генерации уникального заголовка
export function generateProductTitle(product: Product): string {
  const { name, category, subcategory, style, price } = product;

  // Базовый заголовок
  let title = name;

  // Добавляем категорию если её нет в названии
  if (category && !name.toLowerCase().includes(category.name.toLowerCase())) {
    title = `${category.name} ${name}`;
  }

  // Добавляем стиль если есть
  if (style && style !== "Современный") {
    title = `${title} в стиле ${style}`;
  }

  // Добавляем ценовую категорию
  if (price.current < 2000) {
    title = `${title} - недорого`;
  } else if (price.current > 5000) {
    title = `${title} - премиум`;
  }

  // Добавляем бренд и локацию
  title = `${title} | Dilavia - мебель в Минске`;

  return title;
}

// Функция для генерации описания
export function generateProductDescription(product: Product): string {
  const { name, description, category, price, materials, features, delivery } =
    product;

  let desc = `Купить ${name.toLowerCase()} в интернет-магазине Dilavia. `;

  // Добавляем ключевые характеристики
  if (materials && materials.length > 0) {
    const mainMaterial = materials.find(
      (m) => m.name === "Ткань" || m.name === "Обивка",
    );
    if (mainMaterial) {
      desc += `Качественная обивка: ${mainMaterial.type}. `;
    }
  }

  // Добавляем особенности
  if (features && features.length > 0) {
    const mainFeature = features[0];
    desc += `${mainFeature}. `;
  }

  // Добавляем цену
  desc += `Цена от ${price.current} BYN. `;

  // Добавляем доставку
  if (delivery?.available) {
    desc += `Бесплатная доставка по Беларуси. `;
  }

  // Добавляем призыв к действию
  desc += `Заказывайте онлайн с гарантией качества!`;

  return desc;
}

// Функция для генерации ключевых слов
export function generateProductKeywords(product: Product): string[] {
  const { name, category, subcategory, style, materials, features } = product;
  const keywords = new Set<string>();

  // Добавляем название товара
  keywords.add(name.toLowerCase());

  // Добавляем категорийные ключевые слова
  if (category?.code && categoryKeywords[category.code]) {
    categoryKeywords[category.code].forEach((keyword) => keywords.add(keyword));
  }

  // Добавляем подкатегорийные ключевые слова
  if (subcategory?.name) {
    keywords.add(subcategory.name.toLowerCase());
    keywords.add(`купить ${subcategory.name.toLowerCase()}`);
  }

  // Добавляем стилевые ключевые слова
  if (style && styleKeywords[style]) {
    styleKeywords[style].forEach((keyword) => keywords.add(keyword));
  }

  // Добавляем ключевые слова по материалам
  if (materials) {
    materials.forEach((material) => {
      if (materialKeywords[material.name]) {
        materialKeywords[material.name].forEach((keyword) =>
          keywords.add(keyword),
        );
      }
    });
  }

  // Добавляем ключевые слова по особенностям
  if (features) {
    features.forEach((feature) => {
      const featureKeywords = feature.toLowerCase().split(" ");
      featureKeywords.forEach((keyword) => {
        if (keyword.length > 3) keywords.add(keyword);
      });
    });
  }

  // Добавляем локальные ключевые слова
  localKeywords.forEach((keyword) => keywords.add(keyword));

  // Добавляем общие ключевые слова
  keywords.add("купить мебель");
  keywords.add("интернет-магазин мебели");
  keywords.add("мебель с доставкой");
  keywords.add("качественная мебель");

  return Array.from(keywords).slice(0, 20); // Ограничиваем количество ключевых слов
}

// Функция для генерации полных метаданных товара
export function generateProductMetadata(product: Product): Metadata {
  const title = generateProductTitle(product);
  const description = generateProductDescription(product);
  const keywords = generateProductKeywords(product);

  return {
    title,
    description,
    keywords: keywords.join(", "),
    openGraph: {
      title,
      description,
      url: `https://dilavia.by/catalog/${product.slug}`,
      type: "website",
      images:
        product.images?.map((img) => ({
          url: img,
          alt: product.name,
          width: 1200,
          height: 630,
        })) || [],
      locale: "ru_RU",
      siteName: "Dilavia",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.images?.[0] || "",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `https://dilavia.by/catalog/${product.slug}`,
    },
  };
}

// Функция для генерации структурированных данных товара
export function generateProductStructuredData(product: Product) {
  const {
    name,
    description,
    images,
    category,
    price,
    materials,
    features,
    delivery,
  } = product;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: images,
    category: category?.name,
    brand: {
      "@type": "Brand",
      name: "Dilavia",
    },
    offers: {
      "@type": "Offer",
      price: price.current,
      priceCurrency: "BYN",
      availability: delivery?.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://dilavia.by/catalog/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: "Dilavia",
        url: "https://dilavia.by",
      },
      deliveryLeadTime: {
        "@type": "QuantitativeValue",
        value: 5,
        unitCode: "DAY",
      },
    },
    additionalProperty: [
      ...(materials?.map((material) => ({
        "@type": "PropertyValue",
        name: material.name,
        value: material.type,
      })) || []),
      ...(features?.map((feature) => ({
        "@type": "PropertyValue",
        name: "Особенности",
        value: feature,
      })) || []),
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.popularity || 4.5,
      reviewCount: Math.floor((product.popularity || 4.5) * 10),
    },
  };
}

// Функция для генерации метаданных категории
export function generateCategoryMetadata(
  categoryName: string,
  productsCount: number,
): Metadata {
  const title = `${categoryName} - купить в Минске | Dilavia`;
  const description = `Купить ${categoryName.toLowerCase()} в интернет-магазине Dilavia. ${productsCount} товаров в наличии. Доставка по всей Беларуси. Гарантия качества.`;

  return {
    title,
    description,
    keywords: [
      categoryName.toLowerCase(),
      `купить ${categoryName.toLowerCase()}`,
      `${categoryName.toLowerCase()} Минск`,
      "мебель",
      "интернет-магазин мебели",
      "Dilavia",
      "Беларусь",
    ].join(", "),
    openGraph: {
      title,
      description,
      url: `https://dilavia.by/catalog?category=${categoryName.toLowerCase()}`,
      type: "website",
      locale: "ru_RU",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Генерирует метаданные для страницы
 * @param pageData Объект с данными страницы
 * @returns Объект метаданных для Next.js
 */
export function generatePageMetadata(pageData: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  type?: string;
  locale?: string;
}): Metadata {
  return {
    title: pageData.title,
    description: pageData.description,
    openGraph: {
      title: pageData.title,
      description: pageData.description,
      url: pageData.url,
      siteName: "Dilavia",
      images: pageData.imageUrl
        ? [{ url: pageData.imageUrl, width: 1200, height: 630 }]
        : [
            {
              url: "https://dilavia.by/images/logo.svg",
              width: 1200,
              height: 630,
            },
          ],
      locale: pageData.locale || "ru_RU",
      type: (pageData.type as "website") || "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageData.title,
      description: pageData.description,
      images: pageData.imageUrl
        ? [pageData.imageUrl]
        : ["https://dilavia.by/images/logo.svg"],
    },
  };
}

/**
 * Генерирует схему Product для страницы товара
 * @param product Объект с данными товара
 * @returns Объект схемы Product
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  currency: string;
  availability: boolean;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.imageUrl,
    description: product.description,
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price,
      availability: product.availability
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    url: `https://dilavia.by/catalog/${product.slug}`,
  };
}

/**
 * Генерирует схему WebPage для информационных страниц
 * @param pageData Объект с данными страницы
 * @returns Объект схемы WebPage
 */
export function generateWebPageSchema(pageData: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageData.name,
    description: pageData.description,
    url: pageData.url,
  };
}

/**
 * Генерирует схему ItemList для каталогов и списков
 * @param listData Объект с данными списка
 * @returns Объект схемы ItemList
 */
export function generateItemListSchema(listData: {
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listData.name,
    description: listData.description,
  };
}

/**
 * Генерирует схему FAQPage для страниц с вопросами и ответами
 * @param faqData Массив вопросов и ответов
 * @returns Объект схемы FAQPage
 */
export function generateFAQSchema(
  faqData: Array<{
    question: string;
    answer: string;
  }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Генерирует схему Review для отзывов
 * @param reviewData Объект с данными отзыва
 * @returns Объект схемы Review
 */
export function generateReviewSchema(reviewData: {
  name: string;
  author: string;
  reviewBody: string;
  ratingValue: number;
  datePublished: string;
  itemReviewed?: {
    name: string;
    type: "Product" | "Organization" | "Service";
  };
}) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Review",
    name: reviewData.name,
    author: {
      "@type": "Person",
      name: reviewData.author,
    },
    reviewBody: reviewData.reviewBody,
    reviewRating: {
      "@type": "Rating",
      ratingValue: reviewData.ratingValue,
      bestRating: 5,
      worstRating: 1,
    },
    datePublished: reviewData.datePublished,
  };

  if (reviewData.itemReviewed) {
    schema.itemReviewed = {
      "@type": reviewData.itemReviewed.type,
      name: reviewData.itemReviewed.name,
    };
  }

  return schema;
}

/**
 * Генерирует схему AggregateRating для рейтингов
 * @param ratingData Объект с данными рейтинга
 * @returns Объект схемы AggregateRating
 */
export function generateAggregateRatingSchema(ratingData: {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    ratingValue: ratingData.ratingValue,
    reviewCount: ratingData.reviewCount,
    bestRating: ratingData.bestRating || 5,
    worstRating: ratingData.worstRating || 1,
  };
}

/**
 * Генерирует схему Organization для компании
 * @param orgData Объект с данными организации
 * @returns Объект схемы Organization
 */
export function generateOrganizationSchema(orgData: {
  name: string;
  url: string;
  logo?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone: string;
    email: string;
    contactType: string;
  };
}) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: orgData.name,
    url: orgData.url,
  };

  if (orgData.logo) {
    schema.logo = orgData.logo;
  }

  if (orgData.address) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: orgData.address.streetAddress,
      addressLocality: orgData.address.addressLocality,
      addressRegion: orgData.address.addressRegion,
      postalCode: orgData.address.postalCode,
      addressCountry: orgData.address.addressCountry,
    };
  }

  if (orgData.contactPoint) {
    schema.contactPoint = {
      "@type": "ContactPoint",
      telephone: orgData.contactPoint.telephone,
      email: orgData.contactPoint.email,
      contactType: orgData.contactPoint.contactType,
    };
  }

  return schema;
}

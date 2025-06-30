import { Metadata } from "next";
import { Product } from "@/types/product";
import { generateProductMetadata } from "@/lib/seo-utils";
import { generatePageMetadata } from "@/lib/metadata";

async function getProductsData() {
  const data = await import("@/data/data.json");
  return data.default;
}

interface Params {
  productId: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { productId: slug } = await params;
  const productsData = await getProductsData();
  const products = productsData[0].products as unknown as Product[];
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return generatePageMetadata(
      {
        title: "Товар не найден | Dilavia",
        description: "Запрашиваемый товар не найден",
        noindex: true,
      },
      `/catalog/${slug}`,
    );
  }

  // Используем SEO-ключи из product.seo, если они есть
  const seo = product.seo || {};
  const title = seo.title || `${product.name} - купить в Минске | Dilavia`;
  const description = seo.metaDescription || "";
  const keywords = Array.isArray(seo.keywords)
    ? seo.keywords.join(", ")
    : generateProductKeywords(product).join(", ");

  const baseMetadata = generatePageMetadata(
    {
      title,
      description,
      keywords,
    },
    `/catalog/${slug}`,
  );

  return {
    ...baseMetadata,
    openGraph: {
      title: `${product.name} - Dilavia`,
      description:
        product.description ||
        `Купите ${product.name} от мебельной фабрики Dilavia с доставкой по Беларуси.`,
      url: `https://dilavia.by/catalog/${slug}`,
      siteName: "Dilavia",
      images:
        product.images && product.images.length > 0
          ? [{ url: product.images[0], width: 800, height: 600 }]
          : [
              {
                url: "https://dilavia.by/images/logo.svg",
                width: 1200,
                height: 630,
              },
            ],
      locale: "ru_RU",
      type: "website",
    },
  };
}

// Вспомогательные функции для генерации SEO-данных товара
function generateProductKeywords(product: Product): string[] {
  const keywords = [
    product.name.toLowerCase(),
    "мебель",
    "купить мебель",
    "Dilavia",
    "Минск",
    "Беларусь",
  ];

  if (product.category?.name) {
    keywords.push(product.category.name.toLowerCase());
    keywords.push(`купить ${product.category.name.toLowerCase()}`);
  }

  if (product.subcategory?.name) {
    keywords.push(product.subcategory.name.toLowerCase());
  }

  if (product.style && product.style !== "Современный") {
    keywords.push(`мебель в стиле ${product.style.toLowerCase()}`);
  }

  return keywords;
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const { productId: slug } = await params;
  const productsData = await getProductsData();
  const products = productsData[0].products as unknown as Product[];
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return children;
  }

  // Генерируем структурированные данные только для товара
  const structuredData = generateProductMetadata(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}

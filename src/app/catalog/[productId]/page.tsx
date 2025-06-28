import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Product } from "@/types/product";
import ProductDetail from "./ProductDetail";
import { generateProductMetadata } from "@/lib/seo-utils";
import { generatePageMetadata } from "@/lib/metadata";
import { SeoProvider } from "@/components/seo/SeoProvider";

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

  // Используем централизованную систему для генерации метаданных
  return generatePageMetadata(
    {
      title: generateProductTitle(product),
      description: generateProductDescription(product),
      keywords: generateProductKeywords(product).join(", "),
      ogImage: product.images?.[0] || "/images/fabrics-placeholder.jpg",
      ogType: "article",
    },
    `/catalog/${product.slug}`,
  );
}

// Вспомогательные функции для генерации SEO-данных товара
function generateProductTitle(product: Product): string {
  const baseTitle = product.name;
  const category = product.category?.name;
  const style = product.style;

  let title = baseTitle;
  if (category && !title.toLowerCase().includes(category.toLowerCase())) {
    title = `${category} ${title}`;
  }
  if (style && style !== "Современный") {
    title = `${title} в стиле ${style}`;
  }

  return `${title} | Dilavia - мебель в Минске`;
}

function generateProductDescription(product: Product): string {
  const { name, description, price, materials } = product;

  let desc = `Купить ${name.toLowerCase()} в интернет-магазине Dilavia. `;

  if (description) {
    desc += `${description} `;
  }

  if (materials && materials.length > 0) {
    const mainMaterial = materials.find(
      (m) => m.name === "Ткань" || m.name === "Обивка",
    );
    if (mainMaterial) {
      desc += `Качественная обивка: ${mainMaterial.type}. `;
    }
  }

  desc += `Цена от ${price.current} BYN. Бесплатная доставка по Беларуси. Заказывайте онлайн с гарантией качества!`;

  return desc;
}

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

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { productId: slug } = await params;
  const productsData = await getProductsData();
  const products = productsData[0].products as unknown as Product[];
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Находим связанные товары из той же категории
  const relatedProducts = products
    .filter(
      (p) => p.id !== product.id && p.category?.code === product.category?.code,
    )
    .slice(0, 4);

  // Используем новую утилиту для генерации структурированных данных
  const structuredData = generateProductMetadata(product);

  return (
    <SeoProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ProductDetail product={product} relatedProducts={relatedProducts} />
    </SeoProvider>
  );
}

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Product } from "@/types/product";
import ProductDetail from "./ProductDetail";
import {
  generateProductMetadata,
  generateProductStructuredData,
} from "@/lib/seo-utils";

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
    return {
      title: "Товар не найден | Dilavia",
      description: "Запрашиваемый товар не найден",
    };
  }

  // Используем новую утилиту для генерации оптимизированных метаданных
  return generateProductMetadata(product);
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
  const structuredData = generateProductStructuredData(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ProductDetail product={product} relatedProducts={relatedProducts} />
    </>
  );
}

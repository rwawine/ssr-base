import { notFound } from "next/navigation";
import { Product } from "@/types/product";
import ProductDetail from "./ProductDetail";

async function getProductsData() {
  const data = await import("@/data/data.json");
  return data.default;
}

interface Params {
  productId: string;
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

  return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}

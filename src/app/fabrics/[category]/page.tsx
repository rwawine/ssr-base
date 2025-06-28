import { Metadata } from "next";
import {
  getFabricMaterialBySlug,
  getFabricCollectionsByCategory,
} from "@/lib/fabric-utils";
import { generatePageMetadata } from "@/lib/metadata";
import { FabricCard } from "@/components/fabric-card/FabricCard";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import type { BreadcrumbItem } from "@/types";
import styles from "./page.module.css";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const material = getFabricMaterialBySlug(category);
  if (!material) return {};

  return generatePageMetadata(
    {
      title: `Ткани ${material.nameLoc} - Дилавия`,
      description: `Коллекции тканей ${material.nameLoc} для мебели. Широкий выбор цветов и фактур.`,
      keywords: `ткани ${material.nameLoc.toLowerCase()}, купить ткани, мебельные ткани, Dilavia, Беларусь`,
    },
    `/fabrics/${category}`,
  );
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const material = getFabricMaterialBySlug(category);

  if (!material) {
    return (
      <div className={styles.container}>
        <h1>Категория не найдена</h1>
      </div>
    );
  }

  const collectionsData = getFabricCollectionsByCategory(category);

  // Формируем хлебные крошки
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: "Главная",
      href: "/",
    },
    {
      label: "Ткани",
      href: "/fabrics",
    },
    {
      label: material.nameLoc,
      isActive: true,
    },
  ];

  return (
    <div className={styles.container}>
      <Breadcrumbs items={breadcrumbItems} />

      <div className={styles.header}>
        <h1 className={styles.title}>Ткани {material.nameLoc}</h1>
        <p className={styles.description}>
          Коллекции тканей {material.nameLoc} для создания стильной и комфортной
          мебели
        </p>
      </div>

      <div className={styles.collectionsGrid}>
        {collectionsData.map((collectionData) => (
          <FabricCard
            key={collectionData.slug}
            collection={collectionData.collection}
            materialSlug={collectionData.slug}
            categorySlug={category}
          />
        ))}
      </div>
    </div>
  );
}

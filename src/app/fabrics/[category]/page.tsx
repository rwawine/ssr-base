import { notFound } from "next/navigation";
import {
  getFabricMaterialBySlug,
  getFabricCollectionsByCategory,
} from "@/lib/fabric-utils";
import { FabricCard } from "@/components/fabric-card/FabricCard";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import styles from "./page.module.css";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const material = getFabricMaterialBySlug(category);

  if (!material) {
    notFound();
  }

  const collectionsData = getFabricCollectionsByCategory(category);

  // Формируем хлебные крошки
  const breadcrumbItems = [
    {
      name: "Главная",
      url: "/",
    },
    {
      name: "Ткани",
      url: "/fabrics",
    },
    {
      name: material.nameLoc,
      url: `/fabrics/${category}`,
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

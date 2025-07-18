import Link from "next/link";
import Image from "next/image";
import {
  getAllFabricCategories,
  getFabricMaterialBySlug,
} from "@/lib/fabric-utils";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import styles from "./page.module.css";

export default function FabricsPage() {
  const categories = getAllFabricCategories();

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
  ];

  return (
    <div className={styles.container}>
      <Breadcrumbs items={breadcrumbItems} />

      <div className={styles.header}>
        <h1 className={styles.title}>Каталог тканей для мебели</h1>
        <p className={styles.subtitle}>
          Выберите категорию ткани для просмотра коллекций и цветовых решений
        </p>
      </div>

      <div className={styles.categoriesGrid}>
        {categories.map((category, index) => {
          // Получаем материал для доступа к первой коллекции
          const material = getFabricMaterialBySlug(category.slug);
          const firstCollection = material?.collections[0];
          const firstVariant = firstCollection?.variants[0];
          const imageSrc =
            firstVariant?.image || "/images/fabrics-placeholder.jpg";

          return (
            <div key={category.slug}>
              <Link
                href={`/fabrics/${category.slug}`}
                className={styles.categoryCard}
              >
                <div className={styles.categoryImage}>
                  <Image
                    src={imageSrc}
                    alt={category.name}
                    width={300}
                    height={200}
                    className={styles.image}
                  />
                </div>
                <div className={styles.categoryContent}>
                  <h2 className={styles.categoryTitle}>{category.name}</h2>
                  <div className={styles.categoryStats}>
                    <span className={styles.stat}>
                      {category.collectionsCount} коллекций
                    </span>
                    <span className={styles.stat}>
                      {category.totalVariants} цветов
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      <div className={styles.info}>
        <h2 className={styles.infoTitle}>Почему выбирают наши ткани?</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <h3>Качество</h3>
            <p>
              Все ткани проходят строгий контроль качества и соответствуют
              международным стандартам
            </p>
          </div>
          <div className={styles.infoItem}>
            <h3>Износостойкость</h3>
            <p>
              Высокие показатели износостойкости обеспечивают долговечность
              мебели
            </p>
          </div>
          <div className={styles.infoItem}>
            <h3>Уход</h3>
            <p>
              Простой уход и устойчивость к загрязнениям делают ткани
              практичными
            </p>
          </div>
          <div className={styles.infoItem}>
            <h3>Дизайн</h3>
            <p>
              Современные дизайны и богатая цветовая палитра для любого
              интерьера
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

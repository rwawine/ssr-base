import { Metadata } from "next";
import { getFabricMaterialBySlug } from "@/lib/fabric-utils";
import { generatePageMetadata } from "@/lib/metadata";

interface CategoryLayoutProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({
  params,
}: CategoryLayoutProps): Promise<Metadata> {
  const { category } = await params;
  const material = getFabricMaterialBySlug(category);

  if (!material) {
    return generatePageMetadata(
      {
        title: "Категория не найдена | Dilavia",
        description: "Запрашиваемая категория тканей не найдена",
        noindex: true,
      },
      `/fabrics/${category}`,
    );
  }

  return generatePageMetadata(
    {
      title: `Ткани ${material.nameLoc} - купить в Минске | Dilavia`,
      description: `Коллекции тканей ${material.nameLoc} для мебели. Широкий выбор цветов и фактур. Доставка по всей Беларуси.`,
      keywords: `ткани ${material.nameLoc.toLowerCase()}, купить ткани, мебельные ткани, Dilavia, Беларусь, Минск`,
    },
    `/fabrics/${category}`,
  );
}

export default async function CategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const material = getFabricMaterialBySlug(category);

  if (!material) {
    return children;
  }

  // Генерируем структурированные данные только для категории тканей
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Ткани ${material.nameLoc}`,
    description: `Коллекции тканей ${material.nameLoc} для мебели. Широкий выбор цветов и фактур.`,
    url: `https://dilavia.by/fabrics/${category}`,
    mainEntity: {
      "@type": "ItemList",
      name: `Коллекции тканей ${material.nameLoc}`,
      description: `Список коллекций тканей ${material.nameLoc} для мебели`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Главная",
          item: "https://dilavia.by",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Ткани",
          item: "https://dilavia.by/fabrics",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: material.nameLoc,
          item: `https://dilavia.by/fabrics/${category}`,
        },
      ],
    },
  };

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

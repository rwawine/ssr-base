import { Metadata } from "next";
import {
  getFullFabricCollection,
  getFabricVariantById,
} from "@/lib/fabric-utils";
import { generatePageMetadata } from "@/lib/metadata";

interface FabricDetailLayoutProps {
  params: Promise<{
    category: string;
    collection: string;
    variantId: string;
  }>;
}

export async function generateMetadata({
  params,
}: FabricDetailLayoutProps): Promise<Metadata> {
  const { category, collection: collectionSlug, variantId } = await params;
  const collection = getFullFabricCollection(category, collectionSlug);
  const variant = getFabricVariantById(category, collectionSlug, variantId);

  if (!collection || !variant) {
    return generatePageMetadata(
      {
        title: "Ткань не найдена | Dilavia",
        description: "Запрашиваемая ткань не найдена",
        noindex: true,
      },
      `/fabrics/${category}/${collectionSlug}/${variantId}`,
    );
  }

  return generatePageMetadata(
    {
      title: `${collection.nameLoc} ${variant.color.name} - ткань для мебели купить`,
      description: `Купить ткань ${collection.nameLoc} цвет ${variant.color.name} для мебели. Износостойкость: ${collection.technicalSpecifications.abrasionResistance}. Доставка по всей Беларуси.`,
      keywords: `${collection.nameLoc.toLowerCase()} ткань, ${variant.color.name.toLowerCase()}, ткани для мебели, ткани для диванов, купить ткань`,
    },
    `/fabrics/${category}/${collectionSlug}/${variantId}`,
  );
}

export default async function FabricDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    category: string;
    collection: string;
    variantId: string;
  }>;
}) {
  const { category, collection: collectionSlug, variantId } = await params;
  const collection = getFullFabricCollection(category, collectionSlug);
  const variant = getFabricVariantById(category, collectionSlug, variantId);

  if (!collection || !variant) {
    return children;
  }

  // Генерируем структурированные данные только для ткани
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${collection.nameLoc} ${variant.color.name}`,
    description: `Ткань ${collection.nameLoc} цвет ${variant.color.name} для мебели. Износостойкость: ${collection.technicalSpecifications.abrasionResistance}.`,
    image: variant.image,
    url: `https://dilavia.by/fabrics/${category}/${collectionSlug}/${variantId}`,
    brand: {
      "@type": "Brand",
      name: "Dilavia",
    },
    category: "Ткани для мебели",
    offers: {
      "@type": "Offer",
      priceCurrency: "BYN",
      price: 0,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "ООО МЯГКИЙ КОМФОРТ",
        url: "https://dilavia.by",
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Износостойкость",
        value: collection.technicalSpecifications.abrasionResistance,
      },
      {
        "@type": "PropertyValue",
        name: "Категория ткани",
        value: category,
      },
      {
        "@type": "PropertyValue",
        name: "Цвет",
        value: variant.color.name,
      },
    ],
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

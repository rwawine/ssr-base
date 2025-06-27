import { notFound } from "next/navigation";
import {
  getFullFabricCollection,
  getFabricVariantById,
} from "@/lib/fabric-utils";
import { generateMetadata as generatePageMetadata } from "@/lib/metadata";
import { FabricDetailClient } from "./FabricDetailClient";

interface FabricDetailPageProps {
  params: {
    category: string;
    collection: string;
    variantId: string;
  };
}

export async function generateMetadata({ params }: FabricDetailPageProps) {
  const { category, collection: collectionSlug, variantId } = params;
  const collection = getFullFabricCollection(category, collectionSlug);
  const variant = getFabricVariantById(category, collectionSlug, variantId);

  if (!collection || !variant) return {};

  return generatePageMetadata({
    title: `${collection.nameLoc} ${variant.color.name} - ткань для мебели купить`,
    description: `Купить ткань ${collection.nameLoc} цвет ${variant.color.name} для мебели. Износостойкость: ${collection.technicalSpecifications.abrasionResistance}. Доставка по всей Беларуси.`,
    keywords: [
      `${collection.nameLoc.toLowerCase()} ткань`,
      `${variant.color.name.toLowerCase()}`,
      "ткани для мебели",
      "ткани для диванов",
      "купить ткань",
    ],
  });
}

export default async function FabricDetailPage({
  params,
}: FabricDetailPageProps) {
  const { category, collection: collectionSlug, variantId } = params;
  const collection = getFullFabricCollection(category, collectionSlug);
  const currentVariant = getFabricVariantById(
    category,
    collectionSlug,
    variantId,
  );

  if (!collection || !currentVariant) {
    notFound();
  }

  return (
    <FabricDetailClient
      collection={collection}
      currentVariant={currentVariant}
      params={{ category, collection: collectionSlug, variantId }}
    />
  );
}

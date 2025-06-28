import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getFullFabricCollection,
  getFabricVariantById,
} from "@/lib/fabric-utils";
import { generatePageMetadata } from "@/lib/metadata";
import { FabricDetailClient } from "./FabricDetailClient";
import { SeoProvider } from "@/components/seo/SeoProvider";

interface FabricDetailPageProps {
  params: Promise<{
    category: string;
    collection: string;
    variantId: string;
  }>;
}

export async function generateMetadata({
  params,
}: FabricDetailPageProps): Promise<Metadata> {
  const { category, collection: collectionSlug, variantId } = await params;
  const collection = getFullFabricCollection(category, collectionSlug);
  const variant = getFabricVariantById(category, collectionSlug, variantId);

  if (!collection || !variant) return {};

  return generatePageMetadata(
    {
      title: `${collection.nameLoc} ${variant.color.name} - ткань для мебели купить`,
      description: `Купить ткань ${collection.nameLoc} цвет ${variant.color.name} для мебели. Износостойкость: ${collection.technicalSpecifications.abrasionResistance}. Доставка по всей Беларуси.`,
      keywords: `${collection.nameLoc.toLowerCase()} ткань, ${variant.color.name.toLowerCase()}, ткани для мебели, ткани для диванов, купить ткань`,
    },
    `/fabrics/${category}/${collectionSlug}/${variantId}`,
  );
}

export default async function FabricDetailPage({
  params,
}: FabricDetailPageProps) {
  const { category, collection: collectionSlug, variantId } = await params;
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
    <SeoProvider>
      <FabricDetailClient
        collection={collection}
        currentVariant={currentVariant}
        params={{ category, collection: collectionSlug, variantId }}
      />
    </SeoProvider>
  );
}

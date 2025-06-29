import { notFound } from "next/navigation";
import {
  getFullFabricCollection,
  getFabricVariantById,
} from "@/lib/fabric-utils";
import { FabricDetailClient } from "./FabricDetailClient";

interface FabricDetailPageProps {
  params: Promise<{
    category: string;
    collection: string;
    variantId: string;
  }>;
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
    <FabricDetailClient
      collection={collection}
      currentVariant={currentVariant}
      params={{ category, collection: collectionSlug, variantId }}
    />
  );
}

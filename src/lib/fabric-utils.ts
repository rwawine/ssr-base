import data from "@/data/data.json";
import type {
  FabricMaterial,
  FabricCollection,
  FabricVariant,
} from "@/types/fabric";

export function getFabricMaterials(): FabricMaterial[] {
  // Ищем материалы в data.json - они находятся в первом элементе массива
  const materialsData = data[0]?.materials;
  return materialsData || [];
}

export function getFabricMaterialBySlug(
  slug: string,
): FabricMaterial | undefined {
  const materials = getFabricMaterials();
  return materials.find(
    (material) =>
      material.name.toLowerCase().replace(/\s+/g, "-") === slug ||
      material.nameLoc.toLowerCase().replace(/\s+/g, "-") === slug,
  );
}

export function getFabricCollectionBySlug(
  materialSlug: string,
  collectionSlug: string,
): FabricCollection | undefined {
  const material = getFabricMaterialBySlug(materialSlug);
  if (!material) return undefined;

  return material.collections.find(
    (collection) =>
      collection.name.toLowerCase().replace(/\s+/g, "-") === collectionSlug ||
      collection.nameLoc.toLowerCase().replace(/\s+/g, "-") === collectionSlug,
  );
}

export function getFabricVariantById(
  materialSlug: string,
  collectionSlug: string,
  variantId: string,
): FabricVariant | undefined {
  const collection = getFabricCollectionBySlug(materialSlug, collectionSlug);
  if (!collection) return undefined;

  return collection.variants.find(
    (variant) => variant.id.toString() === variantId,
  );
}

export function getAllFabricCategories() {
  const materials = getFabricMaterials();
  return materials.map((material) => ({
    slug: material.name.toLowerCase().replace(/\s+/g, "-"),
    name: material.nameLoc,
    code: material.name,
    collectionsCount: material.collections.length,
    totalVariants: material.collections.reduce(
      (sum, collection) => sum + collection.variants.length,
      0,
    ),
  }));
}

export function getFabricCollectionsByCategory(categorySlug: string) {
  const material = getFabricMaterialBySlug(categorySlug);
  if (!material) return [];

  return material.collections.map((collection) => ({
    slug: collection.name.toLowerCase().replace(/\s+/g, "-"),
    name: collection.nameLoc,
    code: collection.name,
    type: collection.type,
    variantsCount: collection.variants.length,
    technicalSpecifications: collection.technicalSpecifications,
    collection: collection, // Полная коллекция
  }));
}

export function getFullFabricCollection(
  categorySlug: string,
  collectionSlug: string,
): FabricCollection | undefined {
  const material = getFabricMaterialBySlug(categorySlug);
  if (!material) return undefined;

  return material.collections.find(
    (collection) =>
      collection.name.toLowerCase().replace(/\s+/g, "-") === collectionSlug ||
      collection.nameLoc.toLowerCase().replace(/\s+/g, "-") === collectionSlug,
  );
}

export interface FabricColor {
  code: string;
  name: string;
}

export interface FabricVariant {
  id: number;
  color: FabricColor;
  image: string;
}

export interface FabricTechnicalSpecifications {
  fabricType: string;
  abrasionResistance: string;
  composition: string;
  compositionLoc: string;
  origin: string;
  originLoc: string;
  collectionName: string;
  applicationAreas: string[];
}

export interface FabricCollection {
  name: string;
  nameLoc: string;
  filterType: string;
  type: string;
  availability: string;
  technicalSpecifications: FabricTechnicalSpecifications;
  careInstructions: string[];
  variants: FabricVariant[];
}

export interface FabricMaterial {
  name: string;
  nameLoc: string;
  collections: FabricCollection[];
}

export interface FabricData {
  materials: FabricMaterial[];
}

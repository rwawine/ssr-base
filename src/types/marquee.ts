export interface MarqueeImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail: ImageFormat;
    small: ImageFormat;
    medium: ImageFormat;
    large: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: {
    public_id: string;
    resource_type: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
  provider_metadata: {
    public_id: string;
    resource_type: string;
  };
}

export interface MarqueeSlideItem {
  __component: "shared.slide-item";
  id: number;
  size: "Large" | "Medium" | "Small";
  position: "top" | "bottom" | "left" | "right";
  imageUrl: MarqueeImage;
}

export interface MarqueeTitleItem {
  __component: "shared.title-item";
  id: number;
  text: string;
  type: "title";
}

export type MarqueeItem = MarqueeSlideItem | MarqueeTitleItem;

export interface MarqueeData {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  item: MarqueeItem[];
}

export interface MarqueeApiResponse {
  data: MarqueeData;
  meta: Record<string, any>;
} 
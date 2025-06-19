export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: {
    current: number;
    old?: number | null;
  };
  seo?: {
    title?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  category?: {
    code: string;
    name: string;
  };
  popularity?: number;
  images?: string[];
  dimensions?: Dimension[];
}

export interface Dimension {
  width: number;
  length: number;
  height?: number | null;
  price: number;
  additionalOptions?: AdditionalOption[];
}

export interface AdditionalOption {
  name: string;
  price: number;
}
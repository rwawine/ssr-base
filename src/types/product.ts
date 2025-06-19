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
}
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
  subcategory?: {
    code: string;
    name: string;
  };
  popularity?: number;
  images?: string[];
  dimensions?: Dimension[];
  materials?: Material[];
  features?: string[];
  style?: string;
  color?: string | null;
  country?: string;
  warranty?: string;
  delivery?: Delivery;
  installmentPlans?: InstallmentPlan[];
  availability?: string;
  manufacturing?: string;
  configuration?: string;
  filler?: string;
  legs?: string;
  frame?: string;
  mechanism?: boolean;
}

export interface Dimension {
  id: string;
  width: number;
  length: number;
  height?: number | null;
  depth?: number | null;
  price: number;
  oldPrice?: number;
  additionalOptions?: AdditionalOption[];
}

export interface AdditionalOption {
  name: string;
  available: boolean;
  price: number;
  type?: string;
  color?: string;
  image?: string;
}

export interface Material {
  name: string;
  type: string;
  color?: string | null;
}

export interface Delivery {
  available: boolean;
  cost: string;
  time: string;
}

export interface InstallmentPlan {
  bank: string;
  installment: {
    durationMonths: number;
    interest: string;
    additionalFees: string;
  };
  credit: {
    durationMonths: number;
    interest: string;
  };
}
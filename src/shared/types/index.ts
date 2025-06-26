// Общие типы для всего приложения
export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Типы для изображений
export interface ImageData {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  format?: string;
}

export interface OptimizedImageData extends ImageData {
  srcSet?: string;
  sizes?: string;
  placeholder?: string;
  blurDataURL?: string;
}

// Типы для метрик производительности
export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  navigationType?: string;
}

// Типы для форм
export interface FormErrors {
  [key: string]: string | undefined;
}

export interface FormTouched {
  [key: string]: boolean;
}

// Типы для сортировки и фильтрации
export interface SortOption {
  value: string;
  label: string;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

// Типы для навигации
export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

// Типы для модальных окон
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

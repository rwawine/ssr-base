"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";

interface SeoContextType {
  updateSeo: (seoData: SeoData) => void;
  getCurrentSeo: () => SeoData | null;
}

interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: Record<string, any>[];
  noindex?: boolean;
  nofollow?: boolean;
}

const SeoContext = createContext<SeoContextType | null>(null);

interface SeoProviderProps {
  children: ReactNode;
  defaultSeo?: SeoData;
}

export function SeoProvider({ children, defaultSeo }: SeoProviderProps) {
  const pathname = usePathname();
  const [currentSeo, setCurrentSeo] = useState<SeoData | null>(
    defaultSeo || null,
  );

  const updateSeo = (seoData: SeoData) => {
    setCurrentSeo(seoData);
  };

  const getCurrentSeo = () => currentSeo;

  // Обновляем SEO при изменении маршрута
  useEffect(() => {
    if (defaultSeo) {
      setCurrentSeo(defaultSeo);
    }
  }, [pathname, defaultSeo]);

  return (
    <SeoContext.Provider value={{ updateSeo, getCurrentSeo }}>
      {children}
    </SeoContext.Provider>
  );
}

export function useSeo() {
  const context = useContext(SeoContext);
  if (!context) {
    throw new Error("useSeo must be used within a SeoProvider");
  }
  return context;
}

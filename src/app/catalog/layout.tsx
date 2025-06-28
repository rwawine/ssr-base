import { Metadata } from "next";
import { SeoProvider } from "@/components/seo/SeoProvider";

// Базовые метаданные для layout каталога
export const metadata: Metadata = {
  title: "Каталог мебели - купить в Минске | Dilavia",
  description:
    "Широкий ассортимент качественной мебели: кровати, диваны, кресла и многое другое. Доставка по всей Беларуси. Гарантия качества.",
  keywords:
    "каталог мебели, мебель Минск, купить мебель, диваны, кровати, кресла, доставка по Беларуси, Dilavia",
  openGraph: {
    title: "Каталог мебели - купить в Минске | Dilavia",
    description:
      "Широкий ассортимент качественной мебели: кровати, диваны, кресла и многое другое. Доставка по всей Беларуси. Гарантия качества.",
    type: "website",
    url: "/catalog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Каталог мебели - купить в Минске | Dilavia",
    description:
      "Широкий ассортимент качественной мебели: кровати, диваны, кресла и многое другое. Доставка по всей Беларуси. Гарантия качества.",
  },
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SeoProvider>{children}</SeoProvider>;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Каталог товаров | Dilavia - Мебель для дома",
  description:
    "Широкий ассортимент качественной мебели: кровати, диваны, кресла, столы и многое другое. Доставка по всей Беларуси.",
  keywords:
    "мебель, кровати, диваны, кресла, столы, шкафы, каталог, купить мебель",
  openGraph: {
    title: "Каталог товаров | Dilavia",
    description: "Широкий ассортимент качественной мебели для вашего дома",
    type: "website",
    locale: "ru_RU",
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: "summary_large_image",
    title: "Каталог товаров | Dilavia",
    description:
      "Откройте для себя широкий ассортимент мебели в нашем каталоге. Кровати, диваны, кресла и многое другое по выгодным ценам с доставкой по всей Беларуси.",
  },
  alternates: {
    canonical: "https://dilavia.by/catalog",
  },
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

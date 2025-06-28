import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Каталог мебели Dilavia - диваны, кровати, кресла в Минске 2025",
  description:
    "Широкий выбор мебели от белорусского производителя. 56 моделей диванов, кроватей, кресел. Собственное производство, гарантия 18 месяцев, доставка по РБ.",
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

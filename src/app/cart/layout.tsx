import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Корзина | Dilavia",
  description:
    "Ваша корзина в интернет-магазине Dilavia. Здесь вы можете просмотреть, изменить или оформить заказ на выбранную мебель с доставкой по всей Беларуси.",
  openGraph: {
    title: "Корзина | Dilavia",
    description:
      "Ваша корзина в интернет-магазине Dilavia. Здесь вы можете просмотреть, изменить или оформить заказ на выбранную мебель с доставкой по всей Беларуси.",
    url: "https://dilavia.by/cart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Корзина | Dilavia",
    description:
      "Ваша корзина в интернет-магазине Dilavia. Здесь вы можете просмотреть, изменить или оформить заказ на выбранную мебель с доставкой по всей Беларуси.",
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

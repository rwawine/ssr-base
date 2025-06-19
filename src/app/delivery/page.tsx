import React from 'react'
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Доставка и оплата | Dilavia',
  description: 'Условия доставки и оплаты мебели в интернет-магазине Dilavia. Быстрая и удобная доставка по всей Беларуси. Способы оплаты и сроки.',
  openGraph: {
    title: 'Доставка и оплата | Dilavia',
    description: 'Условия доставки и оплаты мебели в интернет-магазине Dilavia. Быстрая и удобная доставка по всей Беларуси. Способы оплаты и сроки.',
    url: 'https://dilavia.by/delivery',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Доставка и оплата | Dilavia',
    description: 'Условия доставки и оплаты мебели в интернет-магазине Dilavia. Быстрая и удобная доставка по всей Беларуси. Способы оплаты и сроки.',
  },
};

export default async function page() {
  return (
    <div>page</div>
  )
}

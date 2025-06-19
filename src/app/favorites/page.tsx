import React from 'react'
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Избранное | Dilavia',
  description: 'Ваши избранные товары в интернет-магазине Dilavia. Сохраняйте понравившуюся мебель и возвращайтесь к ней в любое время для оформления заказа.',
  openGraph: {
    title: 'Избранное | Dilavia',
    description: 'Ваши избранные товары в интернет-магазине Dilavia. Сохраняйте понравившуюся мебель и возвращайтесь к ней в любое время для оформления заказа.',
    url: 'https://dilavia.by/favorites',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Избранное | Dilavia',
    description: 'Ваши избранные товары в интернет-магазине Dilavia. Сохраняйте понравившуюся мебель и возвращайтесь к ней в любое время для оформления заказа.',
  },
};

export default async function page() {
  return (
    <div>page</div>
  )
}

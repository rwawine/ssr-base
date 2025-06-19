import React from 'react'
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Контакты | Dilavia',
  description: 'Контактная информация интернет-магазина Dilavia: адрес, телефон, email, график работы. Свяжитесь с нами для консультации или оформления заказа.',
  openGraph: {
    title: 'Контакты | Dilavia',
    description: 'Контактная информация интернет-магазина Dilavia: адрес, телефон, email, график работы. Свяжитесь с нами для консультации или оформления заказа.',
    url: 'https://dilavia.by/contacts',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Контакты | Dilavia',
    description: 'Контактная информация интернет-магазина Dilavia: адрес, телефон, email, график работы. Свяжитесь с нами для консультации или оформления заказа.',
  },
};

export default async function page() {
  // Здесь можно добавить условие для notFound, если нет данных
  // if (!data) notFound();
  return (
    <div>page</div>
  )
}

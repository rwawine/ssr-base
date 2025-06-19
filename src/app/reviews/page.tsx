import React from 'react'
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Отзывы | Dilavia',
  description: 'Отзывы покупателей о мебели и сервисе интернет-магазина Dilavia. Читайте реальные мнения клиентов и делитесь своим опытом.',
  openGraph: {
    title: 'Отзывы | Dilavia',
    description: 'Отзывы покупателей о мебели и сервисе интернет-магазина Dilavia. Читайте реальные мнения клиентов и делитесь своим опытом.',
    url: 'https://dilavia.by/reviews',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Отзывы | Dilavia',
    description: 'Отзывы покупателей о мебели и сервисе интернет-магазина Dilavia. Читайте реальные мнения клиентов и делитесь своим опытом.',
  },
};

export default async function page() {
  return (
    <div>page</div>
  )
}

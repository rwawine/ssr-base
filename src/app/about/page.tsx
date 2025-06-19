import React from 'react'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'О компании | Dilavia',
  description: 'Узнайте больше о компании Dilavia: наша миссия, ценности, опыт и преимущества. Мы предлагаем качественную мебель с доставкой по всей Беларуси.',
  openGraph: {
    title: 'О компании | Dilavia',
    description: 'Узнайте больше о компании Dilavia: наша миссия, ценности, опыт и преимущества. Мы предлагаем качественную мебель с доставкой по всей Беларуси.',
    url: 'https://dilavia.by/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'О компании | Dilavia',
    description: 'Узнайте больше о компании Dilavia: наша миссия, ценности, опыт и преимущества. Мы предлагаем качественную мебель с доставкой по всей Беларуси.',
  },
};

export default async function page() {
  return (
    <div>page</div>
  )
}

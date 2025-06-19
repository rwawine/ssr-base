import React from 'react'
import { notFound } from 'next/navigation';

export default function page() {
  // Здесь можно добавить условие для notFound, если нет данных
  // if (!data) notFound();
  return (
    <div>page</div>
  )
}

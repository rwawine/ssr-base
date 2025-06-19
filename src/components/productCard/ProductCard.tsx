'use client'
import React from 'react'
import { Product } from '@/types/product'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/catalog/${product.id}`);
    };

    return (
        <div onClick={handleClick} style={{ cursor: 'pointer' }}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Цена: {product.price.current} ₽</p>
        </div>
    )
}

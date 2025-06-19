import React from "react";
import { Product } from "@/types/product";
import Hover from "./Hover";

interface ProductCardHoverProps {
  product: Product;
  onAddToCart?: () => void;
  onMoreDetails?: () => void;
}

const ProductCardHover: React.FC<ProductCardHoverProps> = ({ product, onAddToCart, onMoreDetails }) => {
  // Формируем массив размеров
  const sizes = product.dimensions?.map(dim => `${dim.width}x${dim.length}`) || [];
  // Собираем все опции из additionalOptions
  const allOptions = product.dimensions?.flatMap(dim => dim.additionalOptions?.map(opt => opt.name) || []) || [];
  // Оставляем только уникальные опции
  const mechanisms = Array.from(new Set(allOptions));

  return (
    <Hover
      productImage={product.images?.[0] || undefined}
      title={product.name}
      price={product.price?.current ? `${product.price.current} BYN` : undefined}
      dimensions={product.dimensions}
      addToCartText="В корзину"
      moreDetailsText="Подробнее о товаре"
      onAddToCart={onAddToCart}
      onMoreDetails={onMoreDetails}
      categoryCode={product.category?.code}
      categoryName={product.category?.name}
    />
  );
};

export default ProductCardHover; 
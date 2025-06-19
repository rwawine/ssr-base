import * as React from "react";
import styles from "./Hover.module.css";

interface ProductImageProps {
  imageUrl: string;
  alt?: string;
}

export default function ProductImage({
  imageUrl,
  alt = "Product image"
}: ProductImageProps) {
  return (
    <section className={styles.imageContainer}>
        <img
          src={imageUrl}
          alt={alt}
          className={styles.productImage}
        />
    </section>
  );
}

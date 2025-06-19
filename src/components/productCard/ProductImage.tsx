import * as React from "react";
import styles from "./Hover.module.css";
import Image from "next/image";

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
        <Image
          src={imageUrl}
          alt={alt}
          className={styles.productImage}
          width={600}
          height={400}
          priority
        />
    </section>
  );
}

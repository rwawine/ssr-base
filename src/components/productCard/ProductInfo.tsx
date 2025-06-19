"use client";
import * as React from "react";
import styles from "./Hover.module.css";

interface ProductInfoProps {
    title: string;
    price: string;
}

export default function ProductInfo({ title, price }: ProductInfoProps) {
    return (
        <header className={styles.productDetails}>
            <div className={styles.productInfo}>
                <div className={styles.titlePriceContainer}>
                    <h2 className={styles.productTitle}>
                        {title}
                    </h2>
                    <p className={styles.productPrice}>
                        {price}
                    </p>
                </div>
            </div>
        </header>
    );
};

"use client";
import * as React from "react";
import styles from "./Hover.module.css";

interface ProductActionsProps {
    addToCartText?: string;
    moreDetailsText?: string;
    onAddToCart?: () => void;
    onMoreDetails?: () => void;
}

export default function ProductActions({
    addToCartText = "В корзину",
    moreDetailsText = "Подробнее о товаре",
    onAddToCart,
    onMoreDetails
}: ProductActionsProps) {
    return (
        <>
            <button
                className={styles.addToCartButton}
                onClick={onAddToCart}
                type="button"
            >
                {addToCartText}
            </button>
            <a
                className={styles.moreDetailsLink}
                onClick={onMoreDetails}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        onMoreDetails?.();
                    }
                }}
            >
                <span className={styles.linkText}>
                    {moreDetailsText}
                </span>
                <div className={styles.underline} />
            </a>
        </>
    );
};

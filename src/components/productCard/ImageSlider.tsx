"use client";
import * as React from "react";
import styles from "./Hover.module.css";

interface ImageSliderProps {
    backgroundImage: string;
    thumbnailImage: string;
    alt?: string;
}

export default function ImageSlider({
    backgroundImage,
    thumbnailImage,
    alt = "Product thumbnail"
}: ImageSliderProps) {
    return (
        <div className={styles.imageSlider}>
            <div className={styles.sliderContainer}>
                <img
                    src={backgroundImage}
                    alt="Slider background"
                    className={styles.sliderBackground}
                />
                <img
                    src={thumbnailImage}
                    alt={alt}
                    className={styles.thumbnailImage}
                />
            </div>
        </div>
    );
};

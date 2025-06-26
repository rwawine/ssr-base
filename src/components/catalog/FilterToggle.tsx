"use client";

import React from "react";
import styles from "./FilterToggle.module.css";

interface FilterToggleProps {
  onToggle: () => void;
  isOpen: boolean;
  activeFiltersCount: number;
}

export default function FilterToggle({
  onToggle,
  isOpen,
  activeFiltersCount,
}: FilterToggleProps) {
  return (
    <button
      className={`${styles.filterToggle} ${isOpen ? styles.filterToggleActive : ""}`}
      onClick={onToggle}
      aria-label="Открыть фильтры"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={styles.filterIcon}
      >
        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
      </svg>
      <span>Фильтры</span>
      {activeFiltersCount > 0 && (
        <span className={styles.filterBadge}>{activeFiltersCount}</span>
      )}
    </button>
  );
}

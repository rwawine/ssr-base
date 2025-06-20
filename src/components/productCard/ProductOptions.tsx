"use client";
import React, { useState, useRef, useEffect } from "react";
import { Dimension } from '@/types/product';
import styles from './ProductCard.module.css';

interface ProductOptionsProps {
  dimensions: Dimension[];
}

export default function ProductOptions({ dimensions }: ProductOptionsProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const selectedDimension = dimensions[selectedIdx];
  const hasLift = selectedDimension?.additionalOptions?.some(opt => opt.name.toLowerCase().includes('подъем'));
  const liftPrice = selectedDimension?.additionalOptions?.find(opt => opt.name.toLowerCase().includes('подъем'))?.price || 0;
  const [liftOption, setLiftOption] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayPrice = selectedDimension ? selectedDimension.price + (liftOption ? liftPrice : 0) : 0;

  // Закрытие по клику вне
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className={styles.options}>
      <div className={styles.customSelect} ref={dropdownRef}>
        <div
          className={styles.selected}
          onClick={() => setOpen((v) => !v)}
          tabIndex={0}
          role="button"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span>
            {selectedDimension ? `${selectedDimension.width}x${selectedDimension.length} см` : 'Выберите размер'}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
            className={styles.arrow + (open ? ' ' + styles.arrowOpen : '')}
          >
            <path
              d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
            ></path>
          </svg>
        </div>
        <div className={styles.optionsList} style={{ display: open ? 'flex' : 'none' }}>
          {dimensions.map((dim, idx) => (
            <div key={idx} className={styles.optionItem} onClick={() => { setSelectedIdx(idx); setOpen(false); setLiftOption(false); }}>
              {dim.width}x{dim.length} см
            </div>
          ))}
        </div>
      </div>
      {hasLift && (
        <label className={styles.iosCheckbox + ' ' + styles.blue}>
          <input
            type="checkbox"
            checked={liftOption}
            onChange={() => setLiftOption(v => !v)}
          />
          <div className={styles.checkboxWrapper}>
            <div className={styles.checkboxBg}></div>
            <svg fill="none" viewBox="0 0 24 24" className={styles.checkboxIcon}>
              <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="3"
                stroke="currentColor"
                d="M4 12L10 18L20 6"
                className={styles.checkPath}
              ></path>
            </svg>
          </div>
          <span>Подъемный механизм</span>
        </label>
      )}
      <div className={styles.priceRow}>
        <span className={styles.price}>{displayPrice} BYN</span>
      </div>
    </div>
  );
} 
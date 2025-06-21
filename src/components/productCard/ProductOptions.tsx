"use client";
import React, { useState, useRef, useEffect } from "react";
import { Dimension, AdditionalOption } from '@/types/product';
import styles from './ProductCard.module.css';

interface ProductOptionsProps {
  dimensions: Dimension[];
  onDimensionSelect: (dimension: Dimension) => void;
  selectedDimension?: Dimension;
  onAdditionalOptionToggle: (option: AdditionalOption) => void;
  selectedAdditionalOptions: AdditionalOption[];
}

const ArrowIcon = () => (
    <svg className={styles.dropdownArrow} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


export default function ProductOptions({ 
  dimensions, 
  onDimensionSelect, 
  selectedDimension,
  onAdditionalOptionToggle,
  selectedAdditionalOptions
}: ProductOptionsProps) {
  
  const [isDimOpen, setIsDimOpen] = useState(false);
  const [isOptOpen, setIsOptOpen] = useState(false);
  const dimDropdownRef = useRef<HTMLDivElement>(null);
  const optDropdownRef = useRef<HTMLDivElement>(null);

  const availableAdditionalOptions = selectedDimension?.additionalOptions || [];
  
  const isAdditionalOptionSelected = (option: AdditionalOption) => {
    return selectedAdditionalOptions.some(selected => selected.name === option.name);
  };

  const handleDimSelect = (dim: Dimension) => {
    onDimensionSelect(dim);
    setIsDimOpen(false);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dimDropdownRef.current && !dimDropdownRef.current.contains(event.target as Node)) {
        setIsDimOpen(false);
      }
      if (optDropdownRef.current && !optDropdownRef.current.contains(event.target as Node)) {
        setIsOptOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatSelectedOptions = () => {
    if (selectedAdditionalOptions.length === 0) {
      return 'Выберите опции';
    }
    if (selectedAdditionalOptions.length === 1) {
      return selectedAdditionalOptions[0].name;
    }
    return `Выбрано: ${selectedAdditionalOptions.length}`;
  };

  return (
    <>
      {dimensions.length > 1 && (
        <div className={styles.optionGroup}>
          <span className={styles.optionLabel}>Размер:</span>
          <div className={styles.customDropdown} ref={dimDropdownRef} data-is-open={isDimOpen}>
            <button className={styles.dropdownButton} onClick={() => setIsDimOpen(!isDimOpen)}>
              <span>{selectedDimension ? `${selectedDimension.width}x${selectedDimension.length}` : 'Выберите размер'}</span>
              <ArrowIcon />
            </button>
            {isDimOpen && (
              <ul className={styles.dropdownList}>
                {dimensions.map((dim, index) => (
                  <li 
                    key={dim.id ? `dim-${dim.id}` : `dim-idx-${index}`}
                    className={styles.dropdownItem}
                    onClick={() => handleDimSelect(dim)}
                  >
                    {dim.width}x{dim.length}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      
      {availableAdditionalOptions.length > 0 && (
        <div className={styles.optionGroup}>
          <span className={styles.optionLabel}>Доп. опции:</span>
          <div className={styles.customDropdown} ref={optDropdownRef} data-is-open={isOptOpen}>
             <button className={styles.dropdownButton} onClick={() => setIsOptOpen(!isOptOpen)}>
              <span>{formatSelectedOptions()}</span>
              <ArrowIcon />
            </button>
            {isOptOpen && (
               <ul className={styles.dropdownList}>
                {availableAdditionalOptions.map((option, index) => (
                  <li 
                    key={option.name ? `opt-${option.name}` : `opt-idx-${index}`}
                    className={styles.dropdownItemCheckbox}
                    onClick={() => onAdditionalOptionToggle(option)}
                  >
                    <div className={`${styles.checkbox} ${isAdditionalOptionSelected(option) ? styles.checkboxSelected : ''}`}>
                       {isAdditionalOptionSelected(option) && <svg viewBox="0 0 16 16" fill="white"><path d="M4 8.2l2.4 2.4L12 5"/></svg>}
                    </div>
                    <span>{option.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
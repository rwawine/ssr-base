'use client';

import React, { useState } from 'react';
import styles from './Accordion.module.css';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onClick }) => {
  return (
    <div className={styles.item}>
      <button className={styles.header} onClick={onClick}>
        <span className={styles.title}>{title}</span>
        <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`}></span>
      </button>
      <div className={`${styles.content} ${isOpen ? styles.contentOpen : ''}`}>
        <div className={styles.contentInner}>
          {children}
        </div>
      </div>
    </div>
  );
};

interface AccordionProps {
  items: {
    title: string;
    content: string;
  }[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.accordion}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          isOpen={openIndex === index}
          onClick={() => handleClick(index)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion; 
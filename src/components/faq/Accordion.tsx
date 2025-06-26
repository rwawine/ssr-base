"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Accordion.module.css";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  isOpen,
  onClick,
}) => {
  return (
    <div className={styles.item}>
      <button className={styles.header} onClick={onClick}>
        <span className={styles.title}>{title}</span>
        <motion.span
          className={styles.icon}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.41707 10L12.0029 13.5858L15.5887 10C15.9792 9.60952 16.6123 9.60952 17.0029 10C17.0517 10.0489 17.0944 10.1015 17.131 10.1569C17.3873 10.5451 17.3446 11.0726 17.0029 11.4143L12.71 15.7072C12.5224 15.8947 12.2681 16 12.0029 16C11.7376 16 11.4833 15.8947 11.2958 15.7072L7.00285 11.4143C6.61233 11.0237 6.61233 10.3906 7.00285 10C7.05167 9.95123 7.10428 9.90852 7.15973 9.87191C7.54788 9.61563 8.07536 9.65834 8.41707 10Z"
              fill="black"
            />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className={styles.content}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
              opacity: { duration: 0.2 },
            }}
            style={{ overflow: "hidden" }}
          >
            <div className={styles.contentInner}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
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

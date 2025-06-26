import { forwardRef } from "react";
import { formatPrice } from "@/lib/utils";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    const buttonClasses = [
      styles.button,
      styles[variant],
      styles[size],
      isLoading && styles.loading,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <div className={styles.spinner}>
            <div className={styles.spinnerInner} />
          </div>
        )}

        {!isLoading && leftIcon && (
          <span className={styles.leftIcon}>{leftIcon}</span>
        )}

        <span className={styles.content}>{children}</span>

        {!isLoading && rightIcon && (
          <span className={styles.rightIcon}>{rightIcon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

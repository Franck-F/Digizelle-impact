import { clsx } from "clsx";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "gold";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

const variants = {
  primary: "bg-navy text-white hover:bg-navy-light dark:bg-gold dark:text-navy-dark dark:hover:bg-gold-light",
  secondary: "bg-gold text-navy-dark hover:bg-gold-light",
  outline: "border-2 border-heading text-heading hover:bg-heading hover:text-cream",
  gold: "border-2 border-gold text-gold hover:bg-gold hover:text-navy-dark",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-base sm:px-6 sm:py-3",
  lg: "px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg",
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const classes = clsx(
    "inline-flex items-center justify-center font-medium tracking-wide transition-all duration-300 rounded-sm focus-ring",
    variants[variant],
    sizes[size],
    disabled && "cursor-not-allowed opacity-50",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}

import { clsx } from "clsx";

interface SectionTitleProps {
  label?: string;
  title: string;
  description?: React.ReactNode;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionTitle({
  label,
  title,
  description,
  align = "center",
  light = false,
}: SectionTitleProps) {
  return (
    <div
      className={clsx(
        "mb-10 md:mb-16",
        align === "center" && "text-center",
        align === "left" && "text-left"
      )}
    >
      {label && (
        <span
          className={clsx(
            "mb-3 inline-block text-xs font-medium uppercase tracking-[0.2em] sm:text-sm",
            light ? "text-gold-light" : "text-gold"
          )}
        >
          {label}
        </span>
      )}
      <h2
        className={clsx(
          "font-serif text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl",
          light ? "text-white" : "text-heading"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={clsx(
            "mt-3 max-w-2xl text-base sm:mt-4 sm:text-lg",
            align === "center" && "mx-auto",
            light ? "text-cream-dark" : "text-body"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

import { cn } from "@/lib/cn";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-gold-light to-gold text-ink font-semibold hover:brightness-110 shadow-[0_8px_30px_-8px_rgba(201,161,90,0.6)]",
  outline:
    "border border-paper/25 text-paper hover:border-gold hover:text-gold-light bg-transparent",
  ghost: "text-paper/80 hover:text-gold-light bg-transparent",
  dark: "bg-ink text-paper hover:bg-ink-soft border border-paper/10",
};

const sizes: Record<Size, string> = {
  sm: "text-xs px-4 py-2 gap-1.5",
  md: "text-sm px-5 py-3 gap-2",
  lg: "text-base px-7 py-4 gap-2.5",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkProps = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

export default function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(
    "inline-flex items-center justify-center rounded-full transition-all duration-300 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    className
  );

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        className={classes}
        target={props.target}
        rel={props.rel}
        onClick={props.onClick}
      >
        {children}
      </Link>
    );
  }

  const btnProps = props as ButtonProps;
  return (
    <button {...btnProps} className={classes}>
      {children}
    </button>
  );
}

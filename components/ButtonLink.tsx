import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "green" | "ghost";
  className?: string;
};

const variants = {
  primary:
    "bg-[#06B6D4] text-[#0A0F1E] shadow-lg shadow-cyan-950/20 hover:bg-[#06B6D4]/90",
  secondary:
    "border border-white/80 text-white hover:border-[#06B6D4] hover:bg-white/10",
  green:
    "bg-[#22C55E] text-white shadow-lg shadow-emerald-950/20 hover:bg-[#16A34A]",
  ghost:
    "border border-[#141D38]/20 bg-white text-[#0F172A] hover:border-[#06B6D4] hover:bg-[#EAF8FF]",
};

export default function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={`interactive-lift inline-flex min-h-10 w-full max-w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-center text-xs font-bold transition duration-200 active:translate-y-0 sm:min-h-11 sm:w-auto sm:px-5 sm:py-3 sm:text-sm ${variants[variant]} ${className}`}
    >
      {children}
    </a>
  );
}

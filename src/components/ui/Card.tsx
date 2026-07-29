"use client";

import { cn } from "@/lib/cn";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = true, glow = false, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      onClick={onClick}
      className={cn(
        "glass-card p-6",
        hover && "cursor-pointer hover-lift",
        glow && "ring-1 ring-primary-500/20",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function CardImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      <div className="aspect-[16/9] bg-gradient-to-br from-primary-100 to-accent-100 dark:from-dark-700 dark:to-dark-800" />
      <div className="absolute inset-0 flex items-center justify-center text-slate-400">
        📷 {alt}
      </div>
    </div>
  );
}

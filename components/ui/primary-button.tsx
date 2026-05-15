"use client";

import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function PrimaryButton({ children, className = "", ...props }: PrimaryButtonProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <button
        className={`h-12 w-full rounded-2xl bg-[linear-gradient(180deg,#4b8c91_0%,#3f7e83_100%)] px-5 text-sm font-semibold text-white shadow-[0_16px_30px_-16px_rgba(53,106,110,0.75)] transition-[filter,box-shadow,transform] duration-200 hover:brightness-[1.03] hover:shadow-[0_20px_36px_-17px_rgba(47,96,101,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6ea7aa] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e9f1f2] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        {...props}
      >
        {children}
      </button>
    </motion.div>
  );
}

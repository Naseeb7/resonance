"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type ScreenTransitionProps = {
  children: ReactNode;
};

const transition = {
  duration: 0.45,
  ease: [0.25, 0.9, 0.3, 1] as const,
};

export function ScreenTransition({ children }: ScreenTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

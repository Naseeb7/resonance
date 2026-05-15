"use client";

import { motion } from "framer-motion";

type ProgressBarProps = {
  value: number;
  max?: number;
  label?: string;
};

export function ProgressBar({ value, max = 100, label }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(value, max));
  const percentage = Math.round((safeValue / max) * 100);

  return (
    <section aria-label={label ?? "Practice progress"} className="space-y-2.5">
      <div className="flex items-center justify-between text-xs text-app-muted">
        <span>{label ?? "Today's flow"}</span>
        <span className="font-medium text-[#536980]">{percentage}%</span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full border border-[#d3e0e5] bg-[#e6eef1]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-app-teal via-[#4e8292] to-app-blue"
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.7, ease: [0.25, 0.9, 0.3, 1] }}
        />
        <motion.div
          className="pointer-events-none absolute inset-y-0 w-10 rounded-full bg-white/30"
          animate={{ x: ["-140%", "420%"] }}
          transition={{ duration: 1.9, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}

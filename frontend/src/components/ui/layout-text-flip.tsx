"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface LayoutTextFlipProps {
  text?: string;
  words?: string[];
  duration?: number;
  className?: string;
  textClassName?: string;
  wordClassName?: string;
}

export const LayoutTextFlip = ({
  text = "",
  words = ["Daily Mala (हार ₹30–₹100)", "Nitya Har (नित्य सेवा)", "Mandir Puja (मंदिर पुष्प)"],
  duration = 2800,
  className,
  textClassName,
  wordClassName,
}: LayoutTextFlipProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!words || words.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      {text && (
        <motion.span
          layoutId="subtext"
          className={cn("tracking-tight mr-1.5", textClassName)}
        >
          {text}
        </motion.span>
      )}

      <motion.span
        layout
        className={cn(
          "relative inline-flex w-fit overflow-hidden items-center justify-center",
          wordClassName
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={currentIndex}
            initial={{ y: -18, opacity: 0, scale: 0.96 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
            }}
            exit={{ y: 18, opacity: 0, scale: 0.96 }}
            transition={{
              duration: 0.32,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ willChange: "transform, opacity" }}
            className="inline-block whitespace-nowrap"
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </span>
  );
};

export default LayoutTextFlip;

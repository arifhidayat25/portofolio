"use client";

import { motion } from "framer-motion";

interface SlideIndicatorProps {
  currentSlide: number;
  totalSlides: number;
}

export function SlideIndicator({ currentSlide, totalSlides }: SlideIndicatorProps) {
  return (
    <div className="fixed bottom-8 right-8 z-50 mix-blend-difference">
      <div className="flex items-baseline gap-2 font-heading tracking-widest text-glacier-arctic">
        <motion.span
          key={currentSlide}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold text-glacier-ice"
        >
          {String(currentSlide).padStart(2, "0")}
        </motion.span>
        <span className="text-sm opacity-50">/</span>
        <span className="text-sm opacity-50">{String(totalSlides).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

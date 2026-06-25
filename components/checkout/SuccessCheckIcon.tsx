"use client";
import { useSafeReducedMotion } from "../useSafeReducedMotion";

import { motion } from "framer-motion";
import { useState } from "react";
import { HiCheck } from "react-icons/hi2";

export default function SuccessCheckIcon() {
  const reduceMotion = useSafeReducedMotion();
  const [tapCount, setTapCount] = useState(0);

  return (
    <button
      type="button"
      onClick={() => setTapCount((count) => count + 1)}
      className="group relative inline-flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 outline-none transition hover:border-[#22C55E]/60 hover:bg-[#22C55E]/15 focus-visible:ring-4 focus-visible:ring-[#22C55E]/25 sm:h-28 sm:w-28"
      aria-label="Order berhasil"
    >
      <motion.span
        className="absolute inset-0 rounded-full border border-[#22C55E]/30"
        animate={
          reduceMotion
            ? undefined
            : {
                opacity: [0.72, 0],
                scale: [1, 1.26],
              }
        }
        transition={{
          duration: 1.6,
          ease: "easeOut",
          repeat: Infinity,
        }}
      />
      <motion.span
        key={tapCount}
        className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#22C55E] text-white shadow-2xl shadow-emerald-950/35 sm:h-20 sm:w-20"
        initial={reduceMotion ? false : { scale: 0.72, rotate: -12 }}
        animate={reduceMotion ? undefined : { scale: 1, rotate: 0 }}
        whileHover={reduceMotion ? undefined : { scale: 1.06 }}
        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
      >
        <HiCheck className="h-9 w-9 sm:h-11 sm:w-11" aria-hidden="true" />
      </motion.span>
    </button>
  );
}

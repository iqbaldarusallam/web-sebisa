"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi2";

export type SliderTestimonial = {
  name: string;
  role: string;
  comment: string;
  initials: string;
  category: string;
};

type TestimonialSliderProps = {
  items: SliderTestimonial[];
};

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 52 : -52,
    scale: 0.98,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -52 : 52,
    scale: 0.98,
  }),
};

export default function TestimonialSlider({ items }: TestimonialSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const activeItem = items[activeIndex];
  const shouldAutoPlay = !isPaused && items.length > 1;

  const goToSlide = useCallback(
    (nextIndex: number, nextDirection: number) => {
      setDirection(nextDirection);
      setActiveIndex((nextIndex + items.length) % items.length);
    },
    [items.length],
  );

  useEffect(() => {
    if (!shouldAutoPlay) {
      return;
    }

    const intervalId = window.setInterval(() => {
      goToSlide(activeIndex + 1, 1);
    }, 3200);

    return () => window.clearInterval(intervalId);
  }, [activeIndex, goToSlide, shouldAutoPlay]);

  const goToPrevious = () => {
    goToSlide(activeIndex - 1, -1);
  };

  const goToNext = () => {
    goToSlide(activeIndex + 1, 1);
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/15 bg-white p-4 shadow-2xl shadow-black/35 sm:p-5 lg:p-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#20C4E8]/16 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-[#12345A]/10 blur-3xl" />

      <div className="relative">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.article
            key={activeItem.name}
            custom={direction}
            variants={slideVariants}
            initial={reduceMotion ? false : "enter"}
            animate="center"
            exit={reduceMotion ? undefined : "exit"}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            drag={reduceMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) {
                goToNext();
              }

              if (info.offset.x > 70) {
                goToPrevious();
              }
            }}
            className="cursor-grab rounded-2xl border border-[#12345A]/10 bg-[#F4FBFF] p-5 text-[#10243F] shadow-xl shadow-slate-950/8 active:cursor-grabbing sm:p-6 lg:p-7"
          >
            <div className="flex min-h-[14.5rem] flex-col">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1 text-[#F8E941]" aria-label="Rating 5 dari 5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FaStar
                        key={index}
                        className="h-4 w-4 fill-current sm:h-5 sm:w-5"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="rounded-full bg-[#30B652] px-3 py-1.5 text-[0.68rem] font-extrabold text-white sm:px-4 sm:text-xs">
                    {activeItem.category}
                  </span>
                </div>
                <span className="rounded-full border border-[#12345A]/10 bg-white px-3 py-1.5 text-[0.68rem] font-extrabold text-[#12345A]">
                  Review pilihan
                </span>
              </div>

              <p className="mt-6 max-w-4xl text-base font-extrabold leading-8 text-[#10243F] sm:text-xl lg:text-2xl">
                &quot;{activeItem.comment}&quot;
              </p>

              <div className="mt-auto flex items-center justify-between gap-4 border-t border-[#12345A]/10 pt-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#12345A] text-sm font-extrabold text-white">
                    {activeItem.initials}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-extrabold text-[#12345A]">
                      {activeItem.name}
                    </h3>
                    <p className="mt-1 truncate text-xs font-semibold text-[#6F7F91]">
                      {activeItem.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="relative mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goToPrevious}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#12345A]/20 bg-white text-[#12345A] transition hover:-translate-y-0.5 hover:bg-[#12345A] hover:text-white"
            aria-label="Testimoni sebelumnya"
          >
            <HiArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#12345A] text-white transition hover:-translate-y-0.5 hover:bg-[#0879A8]"
            aria-label="Testimoni berikutnya"
          >
            <HiArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <p className="text-sm font-extrabold text-[#12345A]">
            {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {items.map((item, index) => (
              <button
                key={item.name}
                type="button"
                onClick={() => goToSlide(index, index > activeIndex ? 1 : -1)}
                className={`h-3 rounded-full transition-all ${
                  activeIndex === index
                    ? "w-14 bg-[#12345A]"
                    : "w-3 bg-[#12345A]/25 hover:bg-[#12345A]/50"
                }`}
                aria-label={`Tampilkan testimoni ${item.name}`}
                aria-current={activeIndex === index}
              />
            ))}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#12345A]/15 sm:w-64">
            <div
              className="h-full rounded-full bg-[#12345A] transition-all duration-500"
              style={{ width: `${((activeIndex + 1) / items.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

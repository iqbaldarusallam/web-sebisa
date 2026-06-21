"use client";

import { testimonials, type Testimonial } from "@/data/testimonials";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import MotionReveal from "./MotionReveal";

export default function Testimonials({ items = testimonials }: { items?: Testimonial[] }) {
  const testimonialItems = items.length > 0 ? items : testimonials;
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduceMotion = useReducedMotion();

  const syncActiveCard = useCallback(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const containerLeft = container.getBoundingClientRect().left;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cardRefs.current.forEach((card, index) => {
      if (!card) {
        return;
      }

      const distance = Math.abs(card.getBoundingClientRect().left - containerLeft);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex((current) => (current === closestIndex ? current : closestIndex));
  }, []);

  const scrollToCard = useCallback(
    (index: number) => {
      const container = scrollRef.current;
      const card = cardRefs.current[index];

      if (!container || !card) {
        return;
      }

      container.scrollTo({
        left: card.offsetLeft - container.offsetLeft,
        behavior: reduceMotion ? "auto" : "smooth",
      });
      setActiveIndex(index);
    },
    [reduceMotion],
  );

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    syncActiveCard();
    container.addEventListener("scroll", syncActiveCard, { passive: true });

    return () => container.removeEventListener("scroll", syncActiveCard);
  }, [syncActiveCard]);

  const goToPrevious = () => {
    scrollToCard(Math.max(0, activeIndex - 1));
  };

  const goToNext = () => {
    scrollToCard(Math.min(testimonialItems.length - 1, activeIndex + 1));
  };

  return (
    <section id="testimoni" className="bg-[#DFF3FF] py-12 text-[#333333] md:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
        <MotionReveal className="text-center">
          <span className="inline-flex rounded-md bg-[#12345A] px-4 py-2 text-sm font-extrabold uppercase leading-none text-white">
            Testimoni Klien
          </span>
          <h2 className="mx-auto mt-5 max-w-3xl text-[1.75rem] font-extrabold leading-tight text-[#333333] sm:text-[2.1rem] md:text-[2.45rem]">
            Ini kata mereka tentang{" "}
            <span className="text-[#12345A]">Sebisa Project</span>
          </h2>
        </MotionReveal>

        <div
          ref={scrollRef}
          className="sebisa-hidden-scrollbar mt-10 overflow-x-auto scroll-smooth"
        >
          <div className="testimonial-carousel-track flex w-max gap-3">
            {testimonialItems.map((testimonial, index) => (
              <MotionReveal key={testimonial.name} delay={index * 0.05}>
                <motion.button
                  ref={(element) => {
                    cardRefs.current[index] = element;
                  }}
                  type="button"
                  onClick={() => scrollToCard(index)}
                  onFocus={() => setActiveIndex(index)}
                  whileHover={reduceMotion ? undefined : { y: -7 }}
                  className={`group flex h-[17.5rem] w-[18rem] flex-col rounded-lg bg-white px-4 py-5 text-left shadow-sm outline-none transition duration-300 hover:shadow-xl hover:shadow-sky-950/10 focus-visible:ring-4 focus-visible:ring-[#5B91FF]/25 sm:h-[18rem] sm:w-80 sm:px-5 ${
                    index === activeIndex
                      ? "border-2 border-[#5B91FF] shadow-xl shadow-[#5B91FF]/10"
                      : "border-2 border-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-1 text-[#FFF43B]" aria-label="Rating 5 dari 5">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <FaStar
                          key={starIndex}
                          className="h-4 w-4 fill-current"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <span
                      className={`h-2.5 w-2.5 rounded-full transition ${
                        index === activeIndex ? "bg-[#5B91FF]" : "bg-[#12345A]/15"
                      }`}
                      aria-hidden="true"
                    />
                  </div>

                  <p className="mt-3 overflow-hidden text-[0.72rem] font-medium leading-5 text-[#747474] transition [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4] group-hover:text-[#4F5E6F] sm:text-xs">
                    &quot;{testimonial.comment}&quot;
                  </p>

                  <div className="mt-auto flex items-center gap-3 pt-4">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold transition ${
                        index === activeIndex
                          ? "bg-[#5B91FF] text-white"
                          : "bg-[#12345A] text-white"
                      }`}
                    >
                      {testimonial.initials}
                    </div>
                    <div className="min-w-0 text-left">
                      <h3 className="truncate text-xs font-extrabold leading-tight text-[#333333] sm:text-sm">
                        {testimonial.name}
                      </h3>
                      <p className="mt-0.5 truncate text-[0.68rem] font-medium leading-tight text-[#A0A0A0]">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  <motion.div
                    className="mt-4 h-1 overflow-hidden rounded-full bg-[#12345A]/10"
                    animate={reduceMotion ? undefined : { opacity: index === activeIndex ? 1 : 0.45 }}
                  >
                    <motion.div
                      className="h-full rounded-full bg-[#5B91FF]"
                      animate={{ width: index === activeIndex ? "100%" : "24%" }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    />
                  </motion.div>
                </motion.button>
              </MotionReveal>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={goToPrevious}
            className="slider-arrow bg-white"
            disabled={activeIndex === 0}
            aria-label="Pindah ke testimoni sebelumnya"
          >
            <HiChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="flex items-center justify-center gap-2">
            {testimonialItems.map((testimonial, index) => (
              <button
                key={`${testimonial.name}-dot`}
                type="button"
                onClick={() => scrollToCard(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex ? "w-10 bg-[#12345A]" : "w-2.5 bg-[#12345A]/25"
                }`}
                aria-label={`Tampilkan testimoni ${testimonial.name}`}
                aria-current={index === activeIndex}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goToNext}
            className="slider-arrow bg-white"
            disabled={activeIndex === testimonialItems.length - 1}
            aria-label="Pindah ke testimoni berikutnya"
          >
            <HiChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

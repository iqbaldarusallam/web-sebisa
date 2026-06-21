"use client";

import { teamMembers, type TeamMember } from "@/data/team";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import MotionReveal from "./MotionReveal";
import { useScrollSlider } from "./useScrollSlider";

export default function Team({ items = teamMembers }: { items?: TeamMember[] }) {
  const {
    canScrollNext,
    canScrollPrev,
    handleScroll,
    handleSliderChange,
    scrollByDirection,
    scrollMax,
    scrollRef,
    scrollValue,
  } = useScrollSlider();

  return (
    <section id="tim" className="bg-[#DFF3FF] py-12 text-[#333333] md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-20">
        <MotionReveal className="text-center">
          <span className="inline-flex rounded-full bg-[#12345A] px-3 py-1.5 text-[0.68rem] font-extrabold uppercase leading-none text-white sm:text-xs">
            Tim Kami
          </span>
          <h2 className="mt-4 text-[1.4rem] font-extrabold leading-tight text-[#333333] sm:text-[1.75rem] md:text-[2rem]">
            Individu profesional di balik Sebisa Project
          </h2>
        </MotionReveal>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="sebisa-hidden-scrollbar -mx-4 mt-5 overflow-x-auto px-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:overflow-visible lg:px-0"
        >
          <div className="flex w-max gap-3 sm:gap-4 lg:w-full lg:flex-wrap lg:justify-center">
            {items.map((member, index) => (
              <MotionReveal
                key={`${member.name}-${index}`}
                className="w-[13.25rem] shrink-0 sm:w-[15rem] lg:w-auto lg:basis-[calc((100%-2rem)/3)]"
                delay={index * 0.03}
              >
                <article className="interactive-lift h-full rounded-lg bg-white px-3 py-3.5 text-center shadow-sm transition duration-200 hover:shadow-md sm:px-3.5 sm:py-4">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#12345A] text-xs font-extrabold text-white">
                    {member.initials}
                  </div>
                  <h3 className="mt-2 text-[0.72rem] font-extrabold leading-tight text-[#333333] sm:text-xs">
                    {member.name}
                  </h3>
                  <p className="mt-0.5 text-[0.58rem] font-semibold leading-tight text-[#6F7882] sm:text-[0.62rem]">
                    {member.position}
                  </p>
                  <p className="mx-auto mt-2.5 max-w-[10.5rem] text-[0.58rem] font-medium leading-snug text-[#8A8F95] sm:mt-3 sm:text-[0.62rem]">
                    {member.description}
                  </p>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => scrollByDirection("prev")}
            disabled={!canScrollPrev}
            className="slider-arrow"
            aria-label="Geser tim sebelumnya"
          >
            <HiChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <input
            type="range"
            min={0}
            max={scrollMax || 1}
            value={Math.min(scrollValue, scrollMax)}
            onChange={(event) => handleSliderChange(Number(event.target.value))}
            className="sebisa-scroll-slider w-full max-w-[26rem]"
            aria-label="Geser tim"
          />
          <button
            type="button"
            onClick={() => scrollByDirection("next")}
            disabled={!canScrollNext}
            className="slider-arrow"
            aria-label="Geser tim berikutnya"
          >
            <HiChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

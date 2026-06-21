"use client";

import { portfolioItems, type PortfolioItem } from "@/data/portfolio";
import Image from "next/image";
import {
  HiArrowTopRightOnSquare,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi2";
import MotionReveal from "./MotionReveal";
import CountUpValue from "./CountUpValue";
import { useScrollSlider } from "./useScrollSlider";

export default function Portfolio({ items = portfolioItems }: { items?: PortfolioItem[] }) {
  const featuredItems = [
    items[3],
    items[0],
    items[2],
  ].filter((item): item is PortfolioItem => Boolean(item));
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
    <section id="portfolio" className="overflow-hidden bg-[#0A0F1E] py-10 text-white sm:py-12 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-[4.5rem] lg:px-20">
        <MotionReveal className="text-center">
          <h2 className="text-[1.75rem] font-extrabold leading-none text-white sm:text-[2.3rem] md:text-[2.75rem]">
            Portofolio
          </h2>
          <span className="mt-3 inline-flex rounded-lg bg-[#12345A] px-3 py-1.5 text-[0.68rem] font-extrabold leading-none text-white sm:mt-4 sm:px-4 sm:text-xs">
            <CountUpValue value="100+" duration={1100} />
            <span className="ml-1">Project Digital Telah Dikerjakan</span>
          </span>
          <p className="mt-3 text-xs font-medium text-white/35 sm:text-sm">
            Recent Work yang telah kami kerjakan sepenuh hati dan cinta
          </p>
        </MotionReveal>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="sebisa-hidden-scrollbar -mx-4 mt-6 overflow-x-auto px-4 pb-3 sm:-mx-[4.5rem] sm:px-[4.5rem] lg:-mx-20 lg:px-20"
        >
          <div className="flex min-w-max gap-3 sm:gap-5 lg:gap-6">
            {featuredItems.map((item, index) => (
              <MotionReveal key={item.name} delay={index * 0.05}>
                <article className="group interactive-lift flex h-full w-[min(16.5rem,calc(100vw-2rem))] flex-col rounded-lg border-2 border-[#49E681] bg-[#DFF3FF] p-3.5 text-[#12345A] shadow-lg shadow-black/25 transition duration-300 hover:shadow-[#49E681]/20 sm:w-[24rem] sm:p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex rounded-full bg-[#22C55E] px-2.5 py-1 text-[0.68rem] font-extrabold leading-none text-white sm:px-3 sm:text-xs">
                      Featured
                    </span>
                    <span className="rounded-full bg-[#22C55E]/15 px-3 py-1 text-[0.68rem] font-extrabold text-[#22A755]">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="mt-3 text-[1.15rem] font-extrabold leading-none text-[#333333] sm:text-[1.45rem]">
                    Recent Work
                  </h3>

                  <div className="mt-3 aspect-[1.48/1] w-full overflow-hidden rounded-lg bg-white p-2">
                    <Image
                      src={item.image}
                      alt={`${item.name} portfolio preview`}
                      width={620}
                      height={430}
                      unoptimized
                      className="h-full w-full object-contain transition duration-300"
                    />
                  </div>

                  <div className="mt-4 flex flex-1 flex-col">
                    <h4 className="text-sm font-extrabold leading-tight text-[#64748B] sm:text-base">
                      {item.name}
                    </h4>
                    <p className="mt-2 line-clamp-2 text-[0.72rem] font-medium leading-5 text-[#7B8894] sm:text-xs">
                      {item.description}
                    </p>
                    <a
                      href="#contact"
                      className="mt-auto inline-flex items-center justify-end gap-1 pt-4 text-xs font-extrabold text-[#22A755] transition group-hover:translate-x-1 sm:text-sm"
                    >
                      Lihat
                      <HiArrowTopRightOnSquare className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>

        <div className="mt-7 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => scrollByDirection("prev")}
            disabled={!canScrollPrev}
            className="slider-arrow"
            aria-label="Geser portofolio sebelumnya"
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
            aria-label="Geser portofolio"
          />
          <button
            type="button"
            onClick={() => scrollByDirection("next")}
            disabled={!canScrollNext}
            className="slider-arrow"
            aria-label="Geser portofolio berikutnya"
          >
            <HiChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

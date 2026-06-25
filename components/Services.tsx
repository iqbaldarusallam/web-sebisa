"use client";

import { services, type Service } from "@/data/services";
import { HiArrowTopRightOnSquare, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import Link from "next/link";
import MotionReveal from "./MotionReveal";
import SectionHeading from "./SectionHeading";
import { useScrollSlider } from "./useScrollSlider";

const serviceVisuals: Record<Service["icon"], { label: string; className: string }> = {
  ads: {
    label: "Ads",
    className: "bg-[#F97316] text-white shadow-orange-500/25",
  },
  landing: {
    label: "LP",
    className: "bg-[#06B6D4] text-white shadow-cyan-500/25",
  },
  social: {
    label: "Soc",
    className: "bg-[#8B5CF6] text-white shadow-violet-500/25",
  },
  store: {
    label: "Shop",
    className: "bg-[#22C55E] text-white shadow-emerald-500/25",
  },
  video: {
    label: "Vid",
    className: "bg-[#EF4444] text-white shadow-red-500/25",
  },
  website: {
    label: "Web",
    className: "bg-[#12345A] text-white shadow-blue-950/25",
  },
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Services({ items = services }: { items?: Service[] }) {
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
    <section id="layanan" className="bg-[#0A0F1E] py-10 text-white sm:py-12 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-20">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Layanan Kami"
            title="Project digital yang"
            highlight="bisnis Anda butuhkan"
            description="Pilih kebutuhan project mulai dari branding, social media, iklan, konten, marketplace, website, landing page, hingga paket digital bisnis."
            dark
          />
          <a
            href="#contact"
            className="interactive-lift inline-flex w-fit rounded-full border border-white/40 px-3 py-1.5 text-[0.68rem] font-bold text-white transition hover:border-[#06B6D4] hover:bg-white/10 sm:px-3.5 sm:text-xs"
          >
            Konsultasi Gratis
          </a>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="sebisa-hidden-scrollbar -mx-4 mt-6 overflow-x-auto px-4 pb-3 sm:-mx-8 sm:mt-8 sm:px-8 lg:-mx-20 lg:px-20"
        >
          <div className="flex min-w-max gap-3 sm:gap-4">
            {items.map((service, index) => (
              <MotionReveal key={service.title} className="h-full" delay={index * 0.03}>
                <article className="group interactive-lift relative flex min-h-[23rem] w-[min(15.5rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-white/70 bg-[#EAF8FF] p-3.5 text-[#0F172A] shadow-lg shadow-black/10 transition duration-300 hover:shadow-cyan-950/30 sm:min-h-[24.5rem] sm:w-[18rem] sm:p-4">
                  <div className="pointer-events-none absolute inset-0 opacity-80 [background:radial-gradient(circle_at_85%_12%,rgba(6,182,212,0.2),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.76),transparent_45%,rgba(34,197,94,0.1))]" />
                  <div className="relative flex items-center justify-between gap-4">
                    <span className="inline-flex rounded-full bg-[#12345A] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.06em] text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-[0.62rem] font-black uppercase shadow-lg sm:h-10 sm:w-10 sm:text-[0.68rem] ${serviceVisuals[service.icon].className}`}
                      aria-hidden="true"
                    >
                      {serviceVisuals[service.icon].label}
                    </span>
                  </div>
                  <h3 className="relative mt-3 text-sm font-black leading-tight sm:text-base">
                    {service.title}
                  </h3>
                  <p className="relative mt-2 text-[0.72rem] leading-5 text-slate-600 sm:text-xs">
                    {service.description}
                  </p>
                  <div className="relative mt-auto rounded-lg border border-[#12345A]/10 bg-white/85 px-3 py-2.5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-[#22C55E] px-2.5 py-1 text-[0.58rem] font-extrabold uppercase tracking-[0.06em] text-white">
                        {service.compareAtPrice > service.price ? "Promo" : "Harga"}
                      </span>
                      {service.compareAtPrice > service.price ? (
                        <span className="whitespace-nowrap text-xs font-bold text-slate-500 line-through">
                          {formatMoney(service.compareAtPrice)}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2.5 text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-slate-500">
                      Mulai dari
                    </p>
                    <p className="mt-1 text-lg font-black leading-none text-[#12345A] sm:text-xl">
                      {formatMoney(service.price)}
                    </p>
                  </div>
                  <Link
                    href={`/checkout?service=${encodeURIComponent(service.title)}`}
                    className="relative mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#12345A] px-3 text-[0.72rem] font-extrabold text-white transition hover:bg-[#0D7EA5] sm:text-xs"
                  >
                    Mulai project ini
                    <HiArrowTopRightOnSquare className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => scrollByDirection("prev")}
            disabled={!canScrollPrev}
              suppressHydrationWarning
            className="slider-arrow"
            aria-label="Geser layanan sebelumnya"
          >
            <HiChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <input
            type="range"
            min={0}
            max={scrollMax || 1}
            value={Math.min(scrollValue, scrollMax)}
            onChange={(event) => handleSliderChange(Number(event.target.value))}
            suppressHydrationWarning
            className="sebisa-scroll-slider w-full max-w-[26rem]"
            aria-label="Geser layanan"
          />
          <button
            type="button"
            onClick={() => scrollByDirection("next")}
            disabled={!canScrollNext}
              suppressHydrationWarning
            className="slider-arrow"
            aria-label="Geser layanan berikutnya"
          >
            <HiChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

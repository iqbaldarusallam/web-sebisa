"use client";

import type { Service, ServiceIcon } from "@/data/services";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useScrollSlider } from "./useScrollSlider";

const categories: { id: ServiceIcon; title: string; subtitle: string }[] = [
  {
    id: "social",
    title: "Social Media Management",
    subtitle: "Pilih paket pengelolaan konten sesuai kebutuhan brand Anda.",
  },
  {
    id: "video",
    title: "Content Production",
    subtitle: "Produksi foto, video, podcast, dan konten visual profesional.",
  },
  {
    id: "ads",
    title: "Digital Ads",
    subtitle: "Paket iklan digital untuk awareness, traffic, dan leads.",
  },
  {
    id: "website",
    title: "Website Development",
    subtitle: "Website profesional untuk company profile dan kredibilitas brand.",
  },
  {
    id: "landing",
    title: "Landing Page",
    subtitle: "Landing page promosi yang fokus pada konversi dan transaksi.",
  },
  {
    id: "store",
    title: "Marketplace & Merchandise",
    subtitle: "Optimasi toko online dan kebutuhan campaign fisik brand.",
  },
];

function formatMoney(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getFeatures(service: Service) {
  const fragments = service.description
    .split(/,| dan | untuk | agar /i)
    .map((item) => item.trim())
    .filter((item) => item.length > 10);

  const features = [
    ...fragments.slice(0, 4),
    "Konsultasi kebutuhan project",
    "Revisi sesuai scope layanan",
  ];

  return [...new Set(features)].slice(0, 6);
}

function getBadge(index: number, service: Service) {
  if (index === 1) {
    return "POPULER";
  }

  if (service.compareAtPrice > service.price) {
    const percent = Math.round(
      ((service.compareAtPrice - service.price) / service.compareAtPrice) * 100,
    );
    return `Hemat ${percent}%`;
  }

  return "";
}

export default function PricingCards({ services }: { services: Service[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="space-y-14">
      {categories.map((category) => {
        const categoryServices = services.filter((service) => service.icon === category.id);

        if (categoryServices.length === 0) {
          return null;
        }

        return (
          <PricingCategory
            key={category.id}
            category={category}
            reduceMotion={Boolean(reduceMotion)}
            services={categoryServices}
          />
        );
      })}
    </div>
  );
}

function PricingCategory({
  category,
  reduceMotion,
  services,
}: {
  category: { id: ServiceIcon; title: string; subtitle: string };
  reduceMotion: boolean;
  services: Service[];
}) {
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

  if (services.length === 0) {
    return null;
  }

  return (
    <section className="overflow-visible">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl">
                Paket {category.title}
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-white/58 sm:text-base">
                {category.subtitle}
              </p>
            </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="sebisa-hidden-scrollbar -mx-4 overflow-x-auto px-4 pb-4 pt-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:overflow-visible lg:px-0"
      >
        <div className="flex w-max gap-4 overflow-visible md:gap-5 lg:w-full lg:flex-wrap lg:justify-center">
              {services.map((service, index) => (
                <motion.article
                  key={service.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  whileHover={reduceMotion ? undefined : { y: -5 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.75,
                    delay: index * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`relative flex h-auto w-[16.5rem] shrink-0 flex-col overflow-visible rounded-xl border-2 bg-[#0A0F1E] px-3.5 pb-4 pt-5 text-white shadow-xl shadow-black/25 transition-[border-color,box-shadow,filter] duration-300 hover:shadow-2xl hover:shadow-cyan-950/25 sm:w-[20rem] sm:px-4 sm:pb-5 sm:pt-6 lg:w-auto lg:basis-[calc((100%-2.5rem)/3)] ${
                    index === 1 ? "border-red-500" : "border-white/85"
                  }`}
                >
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,#12345A_0%,#0A0F1E_48%,#0A0F1E_100%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(6,182,212,0.28),transparent_34%)]" />
                  </div>

                  {getBadge(index, service) ? (
                    <div
                      className={`absolute -top-4 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[8px] font-bold uppercase text-white shadow-lg sm:px-4 sm:text-[10px] ${
                        index === 1 ? "bg-red-500" : "bg-[#12345A]"
                      }`}
                    >
                      {getBadge(index, service)}
                    </div>
                  ) : null}

                  <div className="relative z-10 flex h-full flex-col">
                    <div className="rounded-lg bg-white/[0.08] px-3 py-2 text-center shadow-sm ring-1 ring-white/18">
                      <h3 className="text-xs font-extrabold leading-tight text-white sm:text-sm">
                        {service.title}
                      </h3>
                    </div>

                    <p className="mt-3 text-center text-[0.7rem] font-semibold leading-relaxed text-white/72 sm:mt-4 sm:text-xs">
                      {service.description}
                    </p>

                    {service.compareAtPrice > service.price ? (
                      <p className="mt-4 text-center text-xs font-bold text-white/35 line-through sm:text-sm">
                        {formatMoney(service.compareAtPrice)}
                      </p>
                    ) : null}

                    <h2 className="mt-1 text-center text-xl font-black text-[#20C4E8] sm:text-2xl">
                      {formatMoney(service.price)}
                    </h2>

                    <ul className="mt-4 flex-1 space-y-1.5 text-[0.7rem] font-semibold leading-relaxed text-white/72 sm:mt-5 sm:text-xs">
                      {getFeatures(service).map((feature) => (
                        <li key={feature} className="rounded-lg border border-white/12 bg-white/[0.07] px-3 py-2">
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <p className="mt-4 text-center text-xs font-extrabold text-white/85">
                      Timeline menyesuaikan scope
                    </p>

                    <Link
                      href={`/checkout?service=${encodeURIComponent(service.title)}`}
                      className="mt-4 inline-flex min-h-9 w-full items-center justify-center rounded-full bg-[#20C4E8] py-2 text-xs font-extrabold text-[#041B38] shadow-md shadow-cyan-900/20 transition hover:bg-[#67E8F9] active:brightness-95"
                    >
                      Beli Sekarang
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => scrollByDirection("prev")}
          disabled={!canScrollPrev}
          className="slider-arrow"
          aria-label={`Geser paket ${category.title} sebelumnya`}
        >
          <HiChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <input
          type="range"
          min={0}
          max={scrollMax || 1}
          value={Math.min(scrollValue, scrollMax)}
          onChange={(event) => handleSliderChange(Number(event.target.value))}
          className="sebisa-scroll-slider w-full max-w-[22rem]"
          aria-label={`Geser paket ${category.title}`}
        />
        <button
          type="button"
          onClick={() => scrollByDirection("next")}
          disabled={!canScrollNext}
          className="slider-arrow"
          aria-label={`Geser paket ${category.title} berikutnya`}
        >
          <HiChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

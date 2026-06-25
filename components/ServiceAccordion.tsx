"use client";
import { useSafeReducedMotion } from "./useSafeReducedMotion";

import type { Service } from "@/data/services";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  HiArrowTopRightOnSquare,
  HiChevronDown,
  HiCheckCircle,
  HiClock,
  HiDocumentCheck,
} from "react-icons/hi2";

const serviceVisuals: Record<
  Service["icon"],
  { label: string; className: string; accent: string; border: string }
> = {
  ads: {
    label: "Ads",
    className: "bg-[#F97316] text-white",
    accent: "text-[#F97316]",
    border: "border-[#F97316]/35",
  },
  landing: {
    label: "LP",
    className: "bg-[#06B6D4] text-white",
    accent: "text-[#0891B2]",
    border: "border-[#06B6D4]/35",
  },
  social: {
    label: "Soc",
    className: "bg-[#8B5CF6] text-white",
    accent: "text-[#7C3AED]",
    border: "border-[#8B5CF6]/35",
  },
  store: {
    label: "Shop",
    className: "bg-[#22C55E] text-white",
    accent: "text-[#16A34A]",
    border: "border-[#22C55E]/35",
  },
  video: {
    label: "Vid",
    className: "bg-[#EF4444] text-white",
    accent: "text-[#DC2626]",
    border: "border-[#EF4444]/35",
  },
  website: {
    label: "Web",
    className: "bg-[#12345A] text-white",
    accent: "text-[#12345A]",
    border: "border-[#12345A]/30",
  },
};

const detailsByIcon: Record<
  Service["icon"],
  {
    bestFor: string;
    scope: string[];
    outputs: string[];
    timeline: string;
  }
> = {
  ads: {
    bestFor: "Brand yang ingin menjangkau audiens baru dan mengukur performa campaign secara lebih jelas.",
    scope: ["Riset objective campaign", "Arahan pesan iklan", "Setup materi dan targeting", "Monitoring performa dasar"],
    outputs: ["Konsep campaign", "Rekomendasi targeting", "Materi iklan siap tayang"],
    timeline: "Mulai 5-10 hari kerja",
  },
  landing: {
    bestFor: "Promosi produk, event, campaign, dan kebutuhan konversi yang perlu halaman fokus.",
    scope: ["Struktur halaman", "Copywriting section utama", "Desain responsif", "Integrasi CTA atau form"],
    outputs: ["Landing page responsif", "CTA terarah", "Asset publish siap digunakan"],
    timeline: "Mulai 7-14 hari kerja",
  },
  social: {
    bestFor: "Bisnis yang ingin akun social media terlihat konsisten, aktif, dan mudah dipercaya.",
    scope: ["Kalender konten", "Konsep visual", "Caption dan hashtag", "Arahan publikasi"],
    outputs: ["Konten bulanan", "Desain feed/story", "Report ringkas performa"],
    timeline: "Mulai 14-30 hari kerja",
  },
  store: {
    bestFor: "Toko online yang ingin katalog, visual, dan halaman produk terlihat lebih rapi.",
    scope: ["Audit toko/katalog", "Optimasi deskripsi", "Arahan visual produk", "Support campaign marketplace"],
    outputs: ["Katalog lebih rapi", "Template visual", "Rekomendasi optimasi toko"],
    timeline: "Mulai 7-14 hari kerja",
  },
  video: {
    bestFor: "Brand yang butuh konten audio visual untuk promosi, edukasi, campaign, atau dokumentasi.",
    scope: ["Konsep video", "Shot list sederhana", "Produksi atau arahan editing", "Finalisasi format publikasi"],
    outputs: ["Video siap publikasi", "Thumbnail/cover dasar", "Format sesuai channel"],
    timeline: "Mulai 7-21 hari kerja",
  },
  website: {
    bestFor: "Perusahaan, UMKM, dan personal brand yang butuh presence digital yang kredibel.",
    scope: ["Struktur website", "Desain UI responsif", "Pengembangan halaman", "Setup basic SEO dan deployment"],
    outputs: ["Website responsif", "Halaman company/profile", "Dokumentasi akses dasar"],
    timeline: "Mulai 14-30 hari kerja",
  },
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ServiceAccordion({ services }: { services: Service[] }) {
  const reduceMotion = useSafeReducedMotion();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mt-8 grid gap-4">
      {services.map((service, index) => {
        const visual = serviceVisuals[service.icon];
        const detail = detailsByIcon[service.icon];
        const scopeItems = service.features?.length ? service.features : detail.scope;
        const timeline = service.durationLabel ?? detail.timeline;
        const panelId = `service-panel-${index}`;
        const isOpen = openIndex === index;

        return (
          <article
            key={service.title}
            className={`overflow-hidden rounded-xl border bg-white text-[#0F172A] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-950/10 ${
              isOpen ? "border-[#12345A] shadow-xl shadow-sky-950/10" : visual.border
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="grid w-full cursor-pointer gap-4 p-4 text-left outline-none transition focus-visible:ring-4 focus-visible:ring-[#06B6D4]/25 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5"
              aria-controls={panelId}
              aria-expanded={isOpen}
            >
              <div className="flex min-w-0 gap-3">
                <span
                  className={`mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[0.68rem] font-black uppercase shadow-lg shadow-black/10 sm:h-12 sm:w-12 ${visual.className}`}
                  aria-hidden="true"
                >
                  {visual.label}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#0A0F1E] px-2.5 py-1 text-[0.56rem] font-extrabold uppercase tracking-[0.08em] text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={`text-[0.62rem] font-extrabold uppercase tracking-[0.08em] ${visual.accent}`}>
                      Managed {service.icon}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-black leading-tight text-[#263241] sm:text-lg">
                    {service.title}
                  </h3>
                  <p className="mt-1.5 max-w-3xl text-xs font-medium leading-5 text-[#6F7882] sm:text-sm">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <div className="rounded-lg bg-[#F8FBFF] px-3 py-2 text-left sm:min-w-36 sm:text-right">
                  <p className="text-[0.58rem] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                    Mulai dari
                  </p>
                  <p className="mt-1 text-lg font-black leading-none text-[#12345A]">
                    {formatMoney(service.price)}
                  </p>
                </div>
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#12345A]/15 bg-[#F8FBFF] text-[#12345A] transition ${
                    isOpen ? "rotate-180 bg-[#12345A] text-white" : ""
                  }`}
                >
                  <HiChevronDown className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="overflow-hidden border-t border-[#D7E8F3]"
                >
                  <div className="grid gap-4 bg-[#F8FBFF] p-4 sm:grid-cols-[1.25fr_0.75fr] sm:p-5">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="rounded-lg border border-[#D7E8F3] bg-white p-4">
                        <div className="flex items-center gap-2">
                          <HiDocumentCheck className="h-4 w-4 text-[#0879A8]" aria-hidden="true" />
                          <h4 className="text-xs font-black text-[#12345A]">Service brief</h4>
                        </div>
                        <p className="mt-3 text-xs font-semibold leading-5 text-[#4B6078]">
                          {detail.bestFor}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#E0F7FF] px-2.5 py-1 text-[0.62rem] font-extrabold text-[#0879A8]">
                            Scope jelas
                          </span>
                          <span className="rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[0.62rem] font-extrabold text-[#15803D]">
                            Revisi terarah
                          </span>
                          <span className="rounded-full bg-[#FFF7ED] px-2.5 py-1 text-[0.62rem] font-extrabold text-[#C2410C]">
                            Ready launch
                          </span>
                        </div>
                      </div>

                      <div className="rounded-lg border border-[#D7E8F3] bg-white p-4">
                        <h4 className="text-xs font-black text-[#12345A]">Cakupan kerja</h4>
                        <ul className="mt-3 space-y-2">
                          {scopeItems.map((item) => (
                            <li
                              key={item}
                              className="flex gap-2 text-[0.72rem] font-medium leading-5 text-[#596779]"
                            >
                              <HiCheckCircle
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#22C55E]"
                                aria-hidden="true"
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-lg border border-[#D7E8F3] bg-white p-4 lg:col-span-2">
                        <h4 className="text-xs font-black text-[#12345A]">Output yang diterima</h4>
                        <div className="mt-3 grid gap-2 sm:grid-cols-3">
                          {detail.outputs.map((item) => (
                            <div
                              key={item}
                              className="rounded-lg bg-[#F8FBFF] px-3 py-2 text-[0.7rem] font-bold leading-5 text-[#4B6078]"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <aside className="flex flex-col rounded-lg bg-[#0A0F1E] p-4 text-white">
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full bg-[#22C55E] px-2.5 py-1 text-[0.58rem] font-extrabold uppercase text-white">
                          {service.compareAtPrice > service.price ? "Promo" : "Harga"}
                        </span>
                        {service.compareAtPrice > service.price ? (
                          <span className="text-xs font-bold text-white/40 line-through">
                            {formatMoney(service.compareAtPrice)}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-5 text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-white/45">
                        Investment
                      </p>
                      <p className="mt-1 text-2xl font-black leading-none text-white">
                        {formatMoney(service.price)}
                      </p>
                      <div className="mt-5 flex items-start gap-2 rounded-lg bg-white/8 p-3">
                        <HiClock className="mt-0.5 h-4 w-4 shrink-0 text-[#06B6D4]" aria-hidden="true" />
                        <div>
                          <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.08em] text-white/45">
                            Estimasi
                          </p>
                          <p className="mt-1 text-sm font-black">{timeline}</p>
                        </div>
                      </div>
                      <p className="mt-4 text-[0.7rem] font-medium leading-5 text-white/55">
                        Final scope, timeline, dan revisi akan dikunci setelah konsultasi awal.
                      </p>
                      <Link
                        href={`/checkout?service=${encodeURIComponent(service.title)}`}
                        className="mt-auto inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#06B6D4] px-4 text-xs font-extrabold text-[#061845] transition hover:bg-[#67E8F9]"
                      >
                        Pilih layanan ini
                        <HiArrowTopRightOnSquare className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </aside>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </article>
        );
      })}
    </div>
  );
}


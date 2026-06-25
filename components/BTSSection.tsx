"use client";
import { useSafeReducedMotion } from "./useSafeReducedMotion";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HiPlay, HiArrowRight, HiXMark } from "react-icons/hi2";
import { useScrollSlider } from "./useScrollSlider";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import VideoThumbnail from "./VideoThumbnail";

export type BtsCardItem = {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string | null;
};

export default function BTSSection({ items }: { items: BtsCardItem[] }) {
  const reduceMotion = useSafeReducedMotion();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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

  const handleClose = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute("src");
      videoRef.current.load();
    }
    setActiveVideo(null);
  }, []);

  useEffect(() => {
    if (!activeVideo) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeVideo, handleClose]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section id="bts" className="relative overflow-hidden bg-[#141D38] py-12 text-white sm:py-14 md:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(6,182,212,0.18),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(34,197,94,0.14),transparent_28%),linear-gradient(135deg,#141D38_0%,#0A0F1E_100%)]" />
      <div className="absolute inset-0 opacity-25 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[44px_44px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#20C4E8]/45 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[0.68rem] font-extrabold uppercase leading-none text-cyan-100 ring-1 ring-white/10 sm:text-xs">
            Behind The Scenes
          </span>
          <h2 className="mt-4 text-[1.4rem] font-extrabold leading-tight text-white sm:text-[1.75rem] md:text-[2rem]">
            Lihat proses kerja kami dari balik layar
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
            Dokumentasi nyata bagaimana tim Sebisa Project mengeksekusi setiap project dari awal hingga selesai.
          </p>
        </motion.div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="sebisa-hidden-scrollbar -mx-4 mt-8 overflow-x-auto px-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-10 lg:overflow-visible lg:px-0"
        >
          <div className="flex min-w-max gap-4 sm:gap-5 lg:flex-wrap lg:justify-center lg:gap-6 lg:min-w-0">
            {items.map((item, index) => (
              <motion.article
                key={`${item.title}-${index}`}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group interactive-lift flex h-full w-[min(16.5rem,calc(100vw-2rem))] flex-col rounded-xl border border-[#20C4E8]/20 bg-white/[0.07] p-3.5 text-white shadow-2xl shadow-black/25 ring-1 ring-white/5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#49E681]/55 hover:shadow-[#20C4E8]/20 sm:w-[24rem] sm:p-4 lg:w-auto lg:basis-[calc((100%-1.5rem)/2)]"
                onClick={() => setActiveVideo(item.videoUrl)}
                onKeyDown={(e) => { if (e.key === "Enter") setActiveVideo(item.videoUrl); }}
                role="button"
                tabIndex={0}
                aria-label={`Putar video ${item.title}`}
              >
                <div className="relative aspect-[620/430] overflow-hidden bg-[#08111F]">
                  {item.thumbnailUrl ? (
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 50vw, (min-width: 640px) 24rem, calc(100vw - 2rem)"
                      className="object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <VideoThumbnail videoUrl={item.videoUrl}>
                      {(src) => (
                        <Image
                          src={src}
                          alt={item.title}
                          fill
                          sizes="(min-width: 1024px) 50vw, (min-width: 640px) 24rem, calc(100vw - 2rem)"
                          className="object-cover transition duration-300 group-hover:scale-105"
                          unoptimized
                        />
                      )}
                    </VideoThumbnail>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-[#041B38]/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#20C4E8] text-[#041B38] shadow-lg shadow-cyan-900/40 ring-4 ring-white/15 sm:h-16 sm:w-16">
                      <HiPlay className="ml-0.5 h-6 w-6" aria-hidden="true" />
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex flex-1 flex-col">
                  <h3 className="text-sm font-extrabold leading-tight text-white/80 sm:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[0.72rem] font-medium leading-5 text-slate-300 sm:text-xs">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 lg:hidden">
          <button type="button" onClick={() => scrollByDirection("prev")} disabled={!canScrollPrev} className="slider-arrow" suppressHydrationWarning aria-label="Geser BTS sebelumnya">
            <HiChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <input type="range" min={0} max={scrollMax || 1} value={Math.min(scrollValue, scrollMax)} onChange={(event) => handleSliderChange(Number(event.target.value))} className="sebisa-scroll-slider w-full max-w-[26rem]" suppressHydrationWarning aria-label="Geser BTS" />
          <button type="button" onClick={() => scrollByDirection("next")} disabled={!canScrollNext} className="slider-arrow" suppressHydrationWarning aria-label="Geser BTS berikutnya">
            <HiChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link
            href="/bts"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#20C4E8]/40 bg-white/[0.04] px-6 text-xs font-extrabold text-[#20C4E8] transition hover:border-[#49E681] hover:bg-[#20C4E8] hover:text-[#041B38] sm:text-sm"
          >
            Lihat Semua BTS
            <HiArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>

      {activeVideo ? createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label="Video player"
        >
          <div
            className="relative w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Tutup video"
            >
              <HiXMark className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="overflow-hidden rounded-xl bg-black shadow-2xl">
              <video
                ref={videoRef}
                src={activeVideo}
                controls
                preload="metadata"
                className="aspect-[620/430] w-full"
              >
                Browser tidak mendukung video.
              </video>
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </section>
  );
}


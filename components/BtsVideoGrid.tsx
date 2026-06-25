"use client";
import { useSafeReducedMotion } from "./useSafeReducedMotion";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HiPlay, HiXMark } from "react-icons/hi2";
import VideoThumbnail from "./VideoThumbnail";

export type BtsGridItem = {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string | null;
};

export default function BtsVideoGrid({ items }: { items: BtsGridItem[] }) {
  const reduceMotion = useSafeReducedMotion();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {items.map((item, index) => (
          <motion.article
            key={`${item.title}-${index}`}
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="group interactive-lift flex h-full flex-col rounded-lg border-2 border-[#49E681] bg-[#DFF3FF] p-3.5 text-[#12345A] shadow-lg shadow-black/25 transition duration-300 hover:shadow-[#49E681]/20 sm:p-4"
            onClick={() => setActiveVideo(item.videoUrl)}
            onKeyDown={(e) => { if (e.key === "Enter") setActiveVideo(item.videoUrl); }}
            role="button"
            tabIndex={0}
            aria-label={`Putar video ${item.title}`}
          >
            <div className="w-full overflow-hidden rounded-lg bg-white p-2">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-[#EAF8FF]">
                {item.thumbnailUrl ? (
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                ) : (
                  <VideoThumbnail videoUrl={item.videoUrl}>
                    {(src) => (
                      <Image
                        src={src}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, 50vw"
                        className="object-cover transition duration-300 group-hover:scale-[1.02]"
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
            </div>

            <div className="mt-3 flex flex-1 flex-col">
              <h3 className="text-sm font-extrabold leading-tight text-[#64748B] sm:text-base">
                {item.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-[0.72rem] font-medium leading-5 text-[#7B8894] sm:text-xs">
                {item.description}
              </p>
            </div>
          </motion.article>
        ))}
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
                className="aspect-video w-full"
              >
                Browser tidak mendukung video.
              </video>
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </>
  );
}


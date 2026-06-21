"use client";

import type { Service } from "@/data/services";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { HiArrowRight } from "react-icons/hi2";

export default function LayananCards({ services }: { services: Service[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-5">
      {services.map((service, index) => (
        <ServiceCard
          key={service.title}
          delay={index * 0.06}
          description={service.description}
          reduceMotion={Boolean(reduceMotion)}
          title={service.title}
        />
      ))}
    </div>
  );
}

function ServiceCard({
  delay,
  description,
  reduceMotion,
  title,
}: {
  delay: number;
  description: string;
  reduceMotion: boolean;
  title: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const mobilePreviewLimit = 78;
  const desktopPreviewLimit = 155;
  const shouldTruncate = description.length > mobilePreviewLimit;

  const getPreview = (limit: number) =>
    !expanded && description.length > limit
      ? `${description.slice(0, limit).trim()}...`
      : description;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -5 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="flex min-w-0 flex-col rounded-xl border border-sky-200 bg-[#E0F2FE] p-3 shadow-sm transition-shadow duration-300 hover:shadow-md sm:rounded-2xl sm:p-5"
    >
      <h3 className="text-sm font-extrabold leading-tight text-[#263241] sm:text-lg">
        {title}
      </h3>
      <p
        className={`mt-2 text-xs leading-relaxed text-[#5F6B7A] sm:text-sm ${
          expanded ? "" : "line-clamp-3 sm:line-clamp-none"
        }`}
      >
        <span className="sm:hidden">{getPreview(mobilePreviewLimit)}</span>
        <span className="hidden sm:inline">{getPreview(desktopPreviewLimit)}</span>
      </p>

      {shouldTruncate ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-3 inline-flex w-fit items-center gap-1 text-xs font-extrabold text-[#0879A8] transition hover:text-[#12345A]"
        >
          {expanded ? "Tutup" : "Pelajari lebih"}
          <HiArrowRight
            className={`h-3.5 w-3.5 transition ${expanded ? "-rotate-90" : ""}`}
            aria-hidden="true"
          />
        </button>
      ) : null}
    </motion.article>
  );
}

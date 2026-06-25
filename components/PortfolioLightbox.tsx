"use client";

import type { PortfolioItem } from "@/data/portfolio";
import Image from "next/image";
import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";

export default function PortfolioLightbox({
  item,
  onClose,
}: {
  item: PortfolioItem;
  onClose: () => void;
}) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#041B38]/95 p-4 backdrop-blur-sm sm:p-6"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview portfolio ${item.name}`}
    >
      <div
        className="relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-[#20C4E8]/25 bg-[#0A0F1E] shadow-2xl shadow-black/45 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-white transition hover:bg-[#20C4E8] hover:text-[#041B38]"
          aria-label="Tutup preview portfolio"
        >
          <HiXMark className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="relative min-h-0 flex-1 overflow-y-auto bg-black">
          {item.image ? (
            <div className="flex min-h-full w-full items-start justify-center">
              <Image
                src={item.image}
                alt={`${item.name} portfolio detail`}
                width={1200}
                height={800}
                unoptimized
                className="h-auto w-full object-contain"
                priority
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#12345A] via-[#0A829F] to-[#08111F] px-8 text-center text-lg font-black text-white/35">
              Gambar portfolio dari CMS
            </div>
          )}
        </div>

        <div className="flex min-h-0 flex-col gap-3 overflow-y-auto border-t border-[#20C4E8]/15 bg-[#0A0F1E] p-5 text-white sm:p-6 lg:border-t-0 lg:border-l">
          <span className="inline-flex w-fit rounded-full bg-[#22C55E]/15 px-3 py-1 text-xs font-extrabold text-[#49E681]">
            {item.category}
          </span>
          <h2 className="text-xl font-black leading-tight sm:text-2xl">
            {item.name}
          </h2>
          <p className="text-sm leading-6 text-slate-300">
            {item.description}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

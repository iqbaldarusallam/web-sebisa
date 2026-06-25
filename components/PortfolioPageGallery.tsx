"use client";

import type { PortfolioItem } from "@/data/portfolio";
import Image from "next/image";
import { useMemo, useState } from "react";
import { HiMagnifyingGlassPlus } from "react-icons/hi2";
import PortfolioLightbox from "./PortfolioLightbox";

const ALL_CATEGORY = "Semua";

function getItemCategory(item: PortfolioItem) {
  return item.filterCategory || item.category;
}

export default function PortfolioPageGallery({ items }: { items: PortfolioItem[] }) {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  const categories = useMemo(() => {
    const uniqueCategories = items
      .map(getItemCategory)
      .filter((category): category is string => Boolean(category));

    return [ALL_CATEGORY, ...Array.from(new Set(uniqueCategories))];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) {
      return items;
    }

    return items.filter((item) => getItemCategory(item) === activeCategory);
  }, [activeCategory, items]);

  return (
    <>
      <div className="mt-7 flex flex-wrap gap-2.5 sm:gap-3">
        {categories.map((category) => {
          const isActive = category === activeCategory;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`inline-flex min-h-8 items-center justify-center rounded-lg border px-3 text-[0.7rem] font-semibold leading-none transition sm:min-h-9 sm:px-4 sm:text-xs ${
                isActive
                  ? "border-[#20C4E8] bg-[#20C4E8] text-[#041B38] shadow-lg shadow-cyan-950/20"
                  : "border-white/70 text-white hover:border-[#49E681] hover:bg-white/10"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="relative mt-6 flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-5xl flex-wrap justify-center gap-3 lg:gap-4">
          {filteredItems.map((item) => (
            <article
              key={`${item.name}-${item.category}`}
              className="group interactive-lift flex h-full w-[min(16.5rem,calc(100vw-2rem))] flex-col rounded-lg border-2 border-[#49E681] bg-[#DFF3FF] p-3.5 text-[#12345A] shadow-lg shadow-black/25 transition duration-300 hover:shadow-[#49E681]/20 sm:w-[24rem] sm:p-4 lg:w-auto lg:basis-[calc((100%-2rem)/3)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex rounded-full bg-[#22C55E] px-2 py-1 text-[0.5rem] font-extrabold leading-none text-white sm:px-2.5 sm:text-[0.65rem]">
                  {item.isFeatured ? "Featured" : "Project"}
                </span>
                <span className="rounded-full bg-[#22C55E]/15 px-1.5 py-1 text-[0.48rem] font-extrabold leading-none text-[#22A755] sm:px-2 sm:text-[0.58rem]">
                  {item.category}
                </span>
              </div>

              <h2 className="mt-2 text-sm font-extrabold leading-none text-[#333333] sm:mt-2.5 sm:text-lg">
                Recent Work
              </h2>

              <div className="mt-2 w-full overflow-hidden rounded-md bg-white p-1 sm:mt-3 sm:p-1.5">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={`${item.name} portfolio preview`}
                    width={620}
                    height={430}
                    unoptimized
                    className="h-auto w-full object-contain transition duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex aspect-[620/430] w-full items-center justify-center rounded-sm bg-[#EAF8FF] px-3 text-center text-[0.6rem] font-extrabold leading-4 text-[#12345A]/55 sm:text-xs">
                    Gambar dari CMS
                  </div>
                )}
              </div>

              <div className="mt-2 flex flex-1 flex-col sm:mt-3">
                <h3 className="text-[0.68rem] font-extrabold leading-tight text-[#64748B] sm:text-sm">
                  {item.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-[0.56rem] font-medium leading-3 text-[#7B8894] sm:mt-1.5 sm:text-[0.7rem] sm:leading-4">
                  {item.description}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveItem(item)}
                  className="mt-auto inline-flex items-center justify-end gap-1 pt-2 text-[0.6rem] font-extrabold text-[#22A755] transition group-hover:translate-x-1 sm:pt-3 sm:text-xs"
                >
                  Lihat
                  <HiMagnifyingGlassPlus className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {activeItem ? (
        <PortfolioLightbox item={activeItem} onClose={() => setActiveItem(null)} />
      ) : null}
    </>
  );
}

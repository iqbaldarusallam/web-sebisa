"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa6";
import { HiBars3, HiXMark } from "react-icons/hi2";
import Link from "next/link";
import { useState } from "react";
import SebisaLogo from "./SebisaLogo";

const navItems = [
  { label: "Home", href: "/#home" },
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Kerjasama", href: "/kerjasama" },
  { label: "Layanan", href: "/layanan" },
  { label: "Portofolio", href: "/portofolio" },
  { label: "Testimoni", href: "/testimoni" },
  { label: "Tim", href: "/tim" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#141D38]/92 backdrop-blur-xl">
      <nav className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:h-22 sm:px-6 lg:h-24 lg:px-8">
        <Link href="/#home" className="shrink-0" aria-label="Sebisa Project home">
          <SebisaLogo priority />
        </Link>

        <div className="hidden items-center gap-4 text-sm xl:gap-6 xl:text-base lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-base font-medium text-white/80 transition after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-[#20C4E8] after:transition-all hover:text-white hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <a
          href="https://wa.me/6283170943758?text=Halo%20Sebisa%20Project,%20saya%20ingin%20konsultasi"
          className="hidden items-center gap-2 rounded-full bg-[#22C55E] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-950/30 transition hover:bg-[#16A34A] sm:inline-flex"
        >
          <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
          Konsultasi Gratis
        </a>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10 sm:h-11 sm:w-11 lg:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <HiXMark className="h-5 w-5" /> : <HiBars3 className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10 bg-[#141D38] px-4 pb-5 pt-3 lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="https://wa.me/6283170943758?text=Halo%20Sebisa%20Project,%20saya%20ingin%20konsultasi"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#22C55E] px-4 py-3 text-sm font-bold text-white"
              >
                <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
                Konsultasi Gratis
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

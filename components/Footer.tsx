import Link from "next/link";
import SebisaLogo from "./SebisaLogo";

const footerLinks = {
  Layanan: [
    { label: "Branding & Konten", href: "/layanan" },
    { label: "Social Media Management", href: "/layanan" },
    { label: "Digital Ads", href: "/layanan" },
    { label: "Website & Landing Page", href: "/layanan" },
  ],
  Perusahaan: [
    { label: "Tentang Kami", href: "/tentang-kami" },
    { label: "Kerjasama", href: "/kerjasama" },
    { label: "Portofolio", href: "/portofolio" },
    { label: "Testimoni", href: "/testimoni" },
    { label: "Tim", href: "/tim" },
  ],
  Dukungan: [
    { label: "Kontak", href: "/contact" },
    {
      label: "WhatsApp",
      href: "https://wa.me/6283170943758?text=Halo%20Sebisa%20Project,%20saya%20ingin%20konsultasi",
    },
    { label: "FAQ", href: "/faq" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0A0F1E] py-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-20">
        <div>
          <SebisaLogo />
          <p className="mt-4 max-w-sm text-xs leading-6 text-slate-300 sm:text-sm">
            Sebisa Project membantu bisnis membangun ekosistem digital yang
            profesional melalui branding, konten, social media, iklan, website,
            dan strategi pemasaran yang terarah.
          </p>
          <div className="mt-4 flex max-w-sm gap-2">
            <input
              aria-label="Email newsletter"
              placeholder="Email Anda"
              className="h-10 min-w-0 flex-1 rounded-full border border-white/15 bg-white/10 px-3.5 text-xs text-white outline-none placeholder:text-slate-400 focus:border-[#06B6D4] sm:text-sm"
            />
            <button
              type="button"
              className="rounded-full bg-[#06B6D4] px-3.5 text-xs font-bold text-[#0A0F1E] transition hover:bg-[#06B6D4]/90 sm:text-sm"
            >
              Ikuti
            </button>
          </div>
        </div>

        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h3 className="text-sm font-black sm:text-base">{title}</h3>
            <ul className="mt-3 space-y-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs text-slate-300 transition hover:text-white sm:text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-3 border-t border-white/10 px-4 pt-5 text-[0.7rem] text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:text-xs lg:px-20">
        <p>(C) 2026 Sebisa Project. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/layanan"
            className="inline-flex min-h-8 items-center justify-center rounded-md border border-white/80 px-3 text-[0.65rem] font-extrabold text-white transition hover:bg-white hover:text-[#0A0F1E]"
          >
            Lihat Semua Layanan
          </Link>
          <a
            href="https://wa.me/6283170943758?text=Halo%20Sebisa%20Project,%20saya%20ingin%20konsultasi"
            className="inline-flex min-h-8 items-center justify-center rounded-md bg-white px-3 text-[0.65rem] font-extrabold text-[#0879A8] transition hover:bg-[#EAF8FF]"
          >
            Konsultasi Gratis
          </a>
        </div>
      </div>
    </footer>
  );
}

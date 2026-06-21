export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#0879A8] py-14 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-35 [background:linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.24)_45%,transparent_72%)]" />
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center sm:px-8 lg:px-20">
        <h2 className="text-[1.75rem] font-extrabold leading-tight sm:text-[2rem] md:text-[2.25rem]">
          Siap Naik Level Secara Digital?
        </h2>
        <p className="mt-4 max-w-3xl text-xs font-medium leading-relaxed text-white/70 sm:text-sm">
          Tim kreatif kami siap membantu dari ide, strategi, produksi konten,
          sampai aset digital Anda siap dipublikasikan.
        </p>
        <div className="mt-4 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <a
            href="#contact"
            className="interactive-lift inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-white px-6 py-2 text-sm font-extrabold text-[#0879A8] shadow-lg shadow-sky-950/20 transition hover:bg-[#EAF8FF] sm:w-auto"
          >
            Konsultasi Sekarang
          </a>
          <a
            href="#layanan"
            className="interactive-lift inline-flex min-h-10 w-full items-center justify-center rounded-lg border-2 border-white px-6 py-2 text-sm font-bold text-white transition hover:bg-white/10 sm:w-auto"
          >
            Lihat Semua Layanan
          </a>
        </div>
      </div>
    </section>
  );
}

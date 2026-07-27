import CountUpValue from "@/components/CountUpValue";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PricingCards from "@/components/PricingCards";
import { getPublicCmsContent } from "@/lib/public/cms";
import type { Metadata } from "next";
import Link from "next/link";
import {
  HiCheckBadge,
  HiCheckCircle,
  HiShieldCheck,
  HiChartBarSquare,
  HiCog6Tooth,
  HiDocumentText,
} from "react-icons/hi2";

const highlights = [
  "Strategi disesuaikan dengan tujuan brand",
  "Estimasi biaya jelas sejak awal",
  "Tim siap membantu dari brief sampai eksekusi",
];

const whyChooseUs = [
  {
    icon: HiChartBarSquare,
    title: "Strategi Berbasis Data",
    description: "Setiap keputusan didasarkan pada analisis data dan insight pasar yang akurat.",
  },
  {
    icon: HiCog6Tooth,
    title: "Konsisten & Menarik",
    description: "Konten yang terencana dan konsisten untuk membangun brand awareness yang kuat.",
  },
  {
    icon: HiShieldCheck,
    title: "Optimasi Marketplace",
    description: "Optimasi menyeluruh di social media dan marketplace untuk hasil maksimal.",
  },
  {
    icon: HiDocumentText,
    title: "Laporan Transparan",
    description: "Laporan performa bulanan yang jelas dan mudah dipahami untuk evaluasi strategi.",
  },
];

const terms = [
  "Maksimal 1 kali revisi minor per konten.",
  "Creative brief diberikan minimal 3 hari sebelum produksi.",
  "Produk untuk kebutuhan shooting disediakan oleh klien.",
  "File yang diberikan berupa hasil final (source file tidak termasuk).",
  "Budget iklan ditanggung oleh klien.",
  "Harga Digital Ads belum termasuk PPN 11%.",
];

export const metadata: Metadata = {
  title: "Layanan | Sebisa Project",
  description:
    "Daftar layanan Sebisa Project untuk social media, website, landing page, marketplace, digital ads, konten video, dan kebutuhan digital bisnis.",
};

export default async function LayananPage() {
  const cms = await getPublicCmsContent();
  const services = cms.services;

  return (
    <>
      <Navbar />
      <main className="bg-[#0A0F1E] pt-24 text-white sm:pt-28">
        <section className="bg-[#0A0F1E]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14 lg:px-20">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div>
                <span className="inline-flex rounded-md bg-[#12345A] px-3 py-1.5 text-[0.68rem] font-extrabold uppercase leading-none text-white ring-1 ring-white/15 sm:text-xs">
                  Layanan Sebisa Project
                </span>
                <h1 className="mt-5 max-w-3xl text-[2.1rem] font-black leading-[1.04] text-white sm:text-[2.85rem] md:text-[3.5rem]">
                Paket layanan digital untuk brand yang ingin tampil lebih profesional
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
                Pilih kebutuhan Anda mulai dari social media, konten visual,
                digital ads, website, landing page, marketplace, hingga paket
                campaign yang siap membantu bisnis bertumbuh lebih terarah.
              </p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <Link
                    href="#daftar-layanan"
                    className="inline-flex min-h-9 items-center justify-center rounded-full bg-[#06B6D4] px-4 text-xs font-extrabold text-[#061845] transition hover:bg-[#67E8F9]"
                  >
                  Lihat daftar harga
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-black/20 sm:gap-3 sm:p-4">
                <div className="col-span-3 rounded-lg bg-[#DFF3FF] px-4 py-4 text-[#12345A]">
                  <p className="text-[1.8rem] font-black leading-none sm:text-[2.2rem]">
                    <CountUpValue value={`${services.length}+`} duration={900} />
                  </p>
                  <p className="mt-1 text-xs font-bold text-[#4B6078]">
                    pilihan layanan aktif
                  </p>
                </div>
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-white/10 bg-white/[0.06] px-2.5 py-3 text-center"
                  >
                    <HiCheckBadge className="mx-auto h-4 w-4 text-[#22C55E]" aria-hidden="true" />
                    <p className="mt-1.5 text-[0.58rem] font-bold leading-tight text-white/70 sm:text-[0.68rem]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mengapa Memilih Sebisa Project? */}
        <section className="bg-[#0A0F1E] py-12 text-white sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-20">
            <div className="mb-8 text-center">
              <span className="inline-flex rounded-md bg-[#12345A] px-3 py-1.5 text-[0.68rem] font-extrabold uppercase leading-none text-white ring-1 ring-white/15 sm:text-xs">
                Keunggulan Kami
              </span>
              <h2 className="mt-4 text-2xl font-black leading-tight text-white sm:text-3xl">
                Mengapa Memilih Sebisa Project?
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-white/58 sm:text-base">
                Kami hadir untuk membantu bisnis Anda tumbuh dengan strategi digital yang tepat sasaran.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {whyChooseUs.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-white/10 bg-white/[0.04] p-5 transition hover:bg-white/[0.08]"
                  >
                    <Icon className="h-8 w-8 text-[#20C4E8]" aria-hidden="true" />
                    <h3 className="mt-3 text-sm font-black text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/60">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="daftar-layanan" className="bg-[#0A0F1E] py-12 text-white sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-20">
            <div className="mb-8 flex justify-center">
              <span className="inline-flex rounded-md bg-[#12345A] px-3 py-1.5 text-[0.68rem] font-extrabold uppercase leading-none text-white sm:text-xs">
                Layanan Kami
              </span>
            </div>

            <PricingCards services={services} />

            <div className="mt-12 rounded-2xl border border-[#20C4E8]/35 bg-[#12345A] px-4 py-6 text-white shadow-xl shadow-black/25 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:px-6">
              <div>
                <p className="text-xl font-black leading-tight sm:text-2xl">
                  Belum menemukan layanan yang pas?
                </p>
                <p className="mt-2 max-w-2xl text-xs font-medium leading-5 text-white/75 sm:text-sm">
                  Ceritakan kebutuhan brand Anda, nanti tim Sebisa bantu arahkan
                  layanan paling sesuai.
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#20C4E8] px-4 text-xs font-extrabold text-[#041B38] transition hover:bg-[#67E8F9] sm:mt-0"
              >
                Konsultasi Gratis
              </Link>
            </div>
          </div>
        </section>

        {/* Syarat & Ketentuan */}
        <section className="bg-[#0A0F1E] pb-16 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-20">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <HiDocumentText className="h-6 w-6 text-[#20C4E8]" aria-hidden="true" />
                <h2 className="text-xl font-black text-white sm:text-2xl">
                  Syarat & Ketentuan
                </h2>
              </div>
              <ul className="space-y-3">
                {terms.map((term, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <HiCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#22C55E]" aria-hidden="true" />
                    <span className="text-sm leading-relaxed text-white/70">
                      {term}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

import CountUpValue from "@/components/CountUpValue";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PricingCards from "@/components/PricingCards";
import { getPublicCmsContent } from "@/lib/public/cms";
import type { Metadata } from "next";
import Link from "next/link";
import { HiCheckBadge } from "react-icons/hi2";

const highlights = [
  "Strategi disesuaikan dengan tujuan brand",
  "Estimasi biaya jelas sejak awal",
  "Tim siap membantu dari brief sampai eksekusi",
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

      </main>
      <Footer />
    </>
  );
}

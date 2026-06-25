import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getPublicCmsContent } from "@/lib/public/cms";
import type { Metadata } from "next";
import BtsVideoGrid from "@/components/BtsVideoGrid";

export const metadata: Metadata = {
  title: "Behind The Scenes | Sebisa Project",
  description:
    "Lihat proses kerja tim Sebisa Project dari balik layar. Dokumentasi nyata produksi konten, foto, video, dan strategi digital.",
};

export default async function BtsPage() {
  const cms = await getPublicCmsContent();
  const bts = cms.bts;

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-[#141D38] pt-24 text-white sm:pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(6,182,212,0.18),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(34,197,94,0.14),transparent_28%),linear-gradient(135deg,#141D38_0%,#0A0F1E_100%)]" />
        <div className="absolute inset-0 opacity-25 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[44px_44px]" />

        <section className="relative">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14 lg:px-20">
            <div className="text-center">
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[0.68rem] font-extrabold uppercase leading-none text-cyan-100 ring-1 ring-white/10 sm:text-xs">
                Behind The Scenes
              </span>
              <h1 className="mt-5 text-[2.1rem] font-black leading-[1.04] text-white sm:text-[2.85rem] md:text-[3.5rem]">
                Proses kerja kami dari balik layar
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
                Dokumentasi nyata bagaimana tim Sebisa Project mengeksekusi setiap project
                dari brief, produksi, editing, sampai serah terima hasil.
              </p>
            </div>
          </div>
        </section>

        <section className="relative pb-16 sm:pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-20">
            {bts.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-16 text-center">
                <p className="text-lg font-bold text-white/45">
                  Konten BTS belum tersedia.
                </p>
                <p className="mt-2 text-sm text-white/30">
                  Silakan tambahkan data BTS dari panel admin.
                </p>
              </div>
            ) : (
              <BtsVideoGrid items={bts} />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

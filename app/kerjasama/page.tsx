import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { clientLogos } from "@/data/clientLogos";
import { getPublicCmsContent } from "@/lib/public/cms";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Kerjasama | Sebisa Project",
  description:
    "Berkolaborasi bersama Sebisa Project untuk menciptakan dampak digital yang berkelanjutan.",
};

export default async function KerjasamaPage() {
  const cms = await getPublicCmsContent();
  const partnerItems = (cms.clients.length > 0 ? cms.clients : clientLogos).slice(0, 24);

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-[#18233F] pt-32 text-white">
        <div className="absolute inset-0 bg-[#18233F]" />

        <section className="relative z-10 mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-[1780px] flex-col px-6 py-16 sm:px-10 lg:px-20 xl:px-28">
          <div className="max-w-[680px]">
            <p className="text-[clamp(2.3rem,3vw,3.4rem)] font-light leading-none text-[#F43FE3]">
              Kemitraan
            </p>

            <h1 className="mt-7 text-[clamp(3.1rem,4.55vw,5.65rem)] font-semibold leading-[1.12] tracking-tight text-white">
              Berkolaborasi untuk
              <span className="block">Menciptakan Dampak</span>
              <span className="block">yang Berkelanjutan</span>
            </h1>

            <p className="mt-5 max-w-[650px] text-[clamp(1.05rem,1.2vw,1.45rem)] font-light leading-[1.18] text-white/65">
              Kami bekerja bersama mitra terbaik dari berbagai industri untuk
              mendorong inovasi, pertumbuhan, dan masa depan yang lebih baik.
            </p>
          </div>

          <div className="relative mt-8 flex flex-1 items-center justify-center pb-8">
            <div className="relative w-full max-w-[74rem] overflow-hidden border border-white/70 bg-[#172542]/82 px-4 py-5 shadow-2xl shadow-black/25 sm:px-6 sm:py-6 lg:px-8">
              <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_18%_28%,rgba(244,63,227,0.34),transparent_18%),radial-gradient(circle_at_78%_68%,rgba(32,196,232,0.18),transparent_20%)]" />
              <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.13)_1px,transparent_1px)] [background-size:58px_58px]" />

              <div className="relative grid grid-cols-3 justify-items-center gap-x-4 gap-y-5 sm:grid-cols-4 sm:gap-x-5 md:grid-cols-5 lg:grid-cols-8 lg:gap-x-6 lg:gap-y-6">
                {partnerItems.map((partner, index) => (
                  <article
                    key={`${partner.name}-${index}`}
                    className="flex h-14 w-full max-w-[6.8rem] items-center justify-center rounded-lg bg-white px-2 text-center text-[0.55rem] font-extrabold leading-tight text-[#12345A] shadow-[0_7px_0_rgba(0,0,0,0.18)] ring-1 ring-slate-200/80 transition hover:-translate-y-1 hover:shadow-[0_10px_0_rgba(0,0,0,0.14)] sm:h-16 sm:max-w-[7.5rem] sm:text-[0.65rem] lg:h-[4.35rem] lg:max-w-[7.6rem] lg:text-xs"
                  >
                    {partner.logoUrl ? (
                      <Image
                        src={partner.logoUrl}
                        alt={`${partner.name} logo`}
                        width={92}
                        height={48}
                        className="max-h-12 w-auto max-w-full object-contain"
                      />
                    ) : (
                      <span>{partner.name}</span>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

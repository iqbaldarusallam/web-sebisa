import CountUpValue from "@/components/CountUpValue";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getPublicCmsContent } from "@/lib/public/cms";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";

const filterButtons = [
  "Semua",
  "Social Media",
  "Graphic Design",
  "Digital Ads",
  "Website & Landing Page",
  "Branding",
];

const stats = [
  { value: "100+", label: "Project digital diluncurkan" },
  { value: "80+", label: "Klien Puas" },
  { value: "91%", label: "Repeat Order" },
];

export const metadata: Metadata = {
  title: "Portofolio | Sebisa Project",
  description:
    "Portofolio project Sebisa Project yang telah membantu bisnis meluncurkan branding, konten, social media, website, dan campaign digital profesional.",
};

export default async function PortofolioPage() {
  const cms = await getPublicCmsContent();
  const portfolioItems = cms.portfolio;

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-[#18233F] pt-24 text-white sm:pt-28">
        <Image
          src="/background/bg-portfolio.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#18233F]/30" />

        <section className="relative z-10 mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-7xl flex-col px-4 py-10 sm:px-8 lg:px-20">
          <div className="grid gap-7 lg:grid-cols-[1fr_0.72fr] lg:items-start">
            <div>
              <p className="text-[clamp(1.5rem,2.2vw,2.6rem)] font-light leading-none text-white/95">
                Portofolio Kami
              </p>
              <h1 className="mt-5 max-w-[720px] text-[clamp(2.05rem,3.8vw,4.5rem)] font-semibold leading-[1.12] tracking-tight text-white">
                Project yang telah
                <span className="block">kami bantu &amp; luncurkan</span>
              </h1>
              <p className="mt-5 max-w-[620px] text-[clamp(0.85rem,1.05vw,1.15rem)] font-light leading-relaxed text-white/65">
                Setiap project dikerjakan dengan strategi yang jelas, visual
                modern, konten yang relevan, dan fokus pada pertumbuhan bisnis
                klien.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 text-left lg:gap-5 lg:pt-9">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-[clamp(1.5rem,2.35vw,3rem)] font-light leading-none text-white">
                    <CountUpValue value={stat.value} duration={1100} />
                  </p>
                  <p className="mt-1.5 text-[clamp(0.62rem,0.85vw,0.9rem)] font-light leading-tight text-white/55">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-2.5 sm:gap-3">
            {filterButtons.map((button) => (
              <button
                key={button}
                type="button"
                className="inline-flex min-h-8 items-center justify-center rounded-lg border border-white/85 px-3 text-[0.7rem] font-light leading-none text-white transition hover:bg-white/10 sm:min-h-9 sm:px-4 sm:text-xs"
              >
                {button}
              </button>
            ))}
          </div>

          <div className="relative mt-6 flex flex-1 items-center justify-center">
            <div className="flex w-full max-w-5xl flex-wrap justify-center gap-3 lg:gap-4">
              {portfolioItems.map((item) => (
                <article
                  key={item.name}
                  className="group flex h-full basis-[calc((100%-0.75rem)/2)] flex-col rounded-lg border-2 border-[#49E681] bg-[#DFF3FF] p-2 text-[#12345A] shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:shadow-[#49E681]/20 sm:p-3 lg:basis-[calc((100%-2rem)/3)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex rounded-full bg-[#22C55E] px-2 py-1 text-[0.5rem] font-extrabold leading-none text-white sm:px-2.5 sm:text-[0.65rem]">
                      Featured
                    </span>
                    <span className="rounded-full bg-[#22C55E]/15 px-1.5 py-1 text-[0.48rem] font-extrabold leading-none text-[#22A755] sm:px-2 sm:text-[0.58rem]">
                      {item.category}
                    </span>
                  </div>

                  <h2 className="mt-2 text-sm font-extrabold leading-none text-[#333333] sm:mt-2.5 sm:text-lg">
                    Recent Work
                  </h2>

                  <div className="mt-2 aspect-[1.34/1] w-full overflow-hidden rounded-md bg-white p-1 sm:mt-3 sm:p-1.5">
                    <Image
                      src={item.image}
                      alt={`${item.name} portfolio preview`}
                      width={620}
                      height={430}
                      unoptimized
                      className="h-full w-full object-contain transition duration-300"
                    />
                  </div>

                  <div className="mt-2 flex flex-1 flex-col sm:mt-3">
                    <h3 className="text-[0.68rem] font-extrabold leading-tight text-[#64748B] sm:text-sm">
                      {item.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[0.56rem] font-medium leading-3 text-[#7B8894] sm:mt-1.5 sm:text-[0.7rem] sm:leading-4">
                      {item.description}
                    </p>
                    <Link
                      href="/#contact"
                      className="mt-auto inline-flex items-center justify-end gap-1 pt-2 text-[0.6rem] font-extrabold text-[#22A755] transition group-hover:translate-x-1 sm:pt-3 sm:text-xs"
                    >
                      Lihat
                      <HiArrowTopRightOnSquare className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

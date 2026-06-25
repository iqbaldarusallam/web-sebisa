import CountUpValue from "@/components/CountUpValue";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PortfolioPageGallery from "@/components/PortfolioPageGallery";
import { getPublicCmsContent } from "@/lib/public/cms";
import type { Metadata } from "next";

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
        <div className="absolute inset-0 bg-[#18233F]" />

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

          <PortfolioPageGallery items={portfolioItems} />
        </section>
      </main>
      <Footer />
    </>
  );
}

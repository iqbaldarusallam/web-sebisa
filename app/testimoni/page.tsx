import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TestimonialSlider, {
  type SliderTestimonial,
} from "@/components/TestimonialSlider";
import { testimonials } from "@/data/testimonials";
import { getPublicCmsContent } from "@/lib/public/cms";
import type { Metadata } from "next";

const fallbackSliderItems: SliderTestimonial[] = [
  {
    ...testimonials[0],
    category: "Website",
  },
  {
    ...testimonials[1],
    category: "Landing Page",
  },
  {
    ...testimonials[2],
    category: "Branding",
  },
  {
    name: "Ayu Larasati",
    role: "Founder skincare lokal",
    comment:
      "Tim Sebisa membantu kami merapikan brand, konten, dan landing page. Alurnya jelas, komunikasinya cepat, dan hasilnya terasa profesional.",
    initials: "AL",
    category: "Campaign",
  },
  {
    name: "Bima Prakasa",
    role: "Owner jasa konstruksi",
    comment:
      "Company profile kami jadi lebih meyakinkan untuk calon klien. Proses brief sampai revisi terasa rapi, terarah, dan tidak membuang waktu.",
    initials: "BP",
    category: "Company Profile",
  },
  {
    name: "Citra Maharani",
    role: "Marketing lead F&B",
    comment:
      "Landing page campaign membantu tim sales menjelaskan promo dengan lebih mudah. Desainnya ringan, jelas, dan langsung siap dipakai iklan.",
    initials: "CM",
    category: "Digital Ads",
  },
];

const proofStats = [
  { value: "100+", label: "Project digital ditangani" },
  { value: "80+", label: "Klien puas" },
  { value: "4.9/5", label: "Rating rata-rata" },
];

export const metadata: Metadata = {
  title: "Testimoni Klien | Sebisa Project",
  description:
    "Cerita klien Sebisa Project tentang pengalaman membangun website, landing page, branding, dan strategi digital profesional.",
};

export default async function TestimoniPage() {
  const cms = await getPublicCmsContent();
  const sliderItems: SliderTestimonial[] =
    cms.testimonials.length > 0
      ? cms.testimonials.map((item) => ({
          ...item,
          category: "Client",
        }))
      : fallbackSliderItems;

  return (
    <>
      <Navbar />
      <main className="bg-[#DFF3FF] pt-28 text-[#12345A]">
        <section className="px-6 pb-14 pt-8 sm:px-8 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <span className="inline-flex rounded-lg bg-[#12345A] px-5 py-2 text-xs font-extrabold text-white">
                TESTIMONI KLIEN
              </span>
              <h1 className="mx-auto mt-5 max-w-4xl text-3xl font-extrabold leading-tight text-[#303744] sm:text-4xl lg:text-5xl">
                Ini kata mereka tentang Sebisa Project
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-[#6A7280] sm:text-base">
                Cerita singkat dari klien yang sudah bekerja sama bersama kami
                dalam membangun website, landing page, dan kebutuhan digital.
              </p>
            </div>

            <div className="mx-auto mt-9 max-w-6xl">
              <TestimonialSlider items={sliderItems} />
            </div>

            <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              {proofStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-white px-5 py-4 text-center shadow-sm"
                >
                  <p className="text-3xl font-extrabold text-[#0879A8]">{stat.value}</p>
                  <p className="mt-1 text-xs font-bold text-[#6A7280]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

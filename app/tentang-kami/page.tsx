import CountUpValue from "@/components/CountUpValue";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const projectPreviews = ["/Ellipse 1.png", "/Ellipse 2.png", "/Ellipse 3.png"];

export const metadata: Metadata = {
  title: "Tentang Kami | Sebisa Project",
  description:
    "Sebisa Project adalah partner kreatif dan strategis untuk kebutuhan branding, konten, social media, website, digital marketing, dan solusi digital profesional.",
};

export default function TentangKamiPage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-[#061845] pt-32 text-white">
        <Image
          src="/background/bg-tentangkami.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#03194D]/35" />

        <section className="relative z-10 mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-[1780px] flex-col justify-center px-6 py-16 sm:px-10 lg:px-20 xl:px-28">
          <div className="max-w-[1500px]">
            <p className="text-[clamp(2.8rem,4vw,4.5rem)] font-light leading-none text-white/95">
              Tentang Kami
            </p>

            <h1 className="mt-9 max-w-[1060px] text-[clamp(2.4rem,4.1vw,4.9rem)] font-extrabold leading-[1.12] tracking-tight">
              Perusahaan Penyedia Jasa
              <span className="block">
                <span className="text-[#08BBD8]">Digital</span> Profesional{" "}
                <span className="text-[#08BBD8]">Bergaransi</span>
              </span>
            </h1>

            <div className="mt-10 max-w-[1480px] space-y-8 text-[clamp(1.15rem,1.45vw,1.85rem)] font-light leading-[1.08] text-white/90">
              <p>
                Sebisa Project hadir sebagai partner kreatif dan strategis untuk
                membantu bisnis, brand, maupun personal brand berkembang lebih
                cepat di era digital. Kami percaya setiap ide besar layak
                diwujudkan dengan eksekusi yang tepat, desain yang menarik, serta
                strategi yang menghasilkan dampak nyata.
              </p>
              <p>
                Kami melayani kebutuhan B2B maupun B2C, mulai dari pengembangan
                branding, desain kreatif, produksi konten, pengelolaan social
                media, iklan digital, pembuatan website, hingga solusi bisnis
                yang disesuaikan dengan kebutuhan Anda. Baik Anda perusahaan
                yang ingin meningkatkan kredibilitas, maupun individu yang ingin
                membangun citra profesional, Sebisa Project siap menjadi tim
                pendukung terbaik Anda.
              </p>
              <p>
                Dengan pendekatan profesional, fleksibel, dan berorientasi hasil,
                kami tidak hanya mengerjakan proyek, tetapi membangun hubungan
                kerja sama jangka panjang yang saling menguntungkan. Karena bagi
                kami, kesuksesan klien adalah bagian dari kesuksesan Sebisa
                Project.
              </p>
            </div>

            <p className="mt-20 text-[clamp(1.25rem,1.5vw,1.85rem)] font-extrabold leading-tight">
              Sebisa Project - Dari Ide Menjadi Realita, Dari Strategi Menjadi Hasil.
            </p>

            <div className="mt-16 grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-center">
              <div className="flex items-center gap-8">
                <div className="flex -space-x-5">
                  {projectPreviews.map((preview, index) => (
                    <Image
                      key={preview}
                      src={preview}
                      alt={`Preview project Sebisa ${index + 1}`}
                      width={88}
                      height={88}
                      priority
                      className="h-18 w-18 rounded-full border-3 border-white object-cover shadow-xl shadow-black/25 sm:h-22 sm:w-22"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-[clamp(2.5rem,3.1vw,4rem)] font-extrabold leading-none text-[#08BBD8]">
                    <CountUpValue
                      value="100+"
                      accentClassName="text-[#08BBD8]"
                      duration={1100}
                    />
                  </p>
                  <p className="mt-2 text-[clamp(1rem,1.15vw,1.45rem)] font-light leading-tight text-white/80">
                    Project Digital Telah Dikerjakan
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-5 sm:flex-row lg:justify-end">
                <Link
                  href="/contact"
                  className="inline-flex min-h-16 items-center justify-center rounded-xl bg-[#0879A8] px-10 text-[clamp(1.1rem,1.3vw,1.65rem)] font-extrabold text-white shadow-xl shadow-black/20 transition hover:bg-[#0B8FC7]"
                >
                  Konsultasi Sekarang
                </Link>
                <Link
                  href="/#layanan"
                  className="inline-flex min-h-16 items-center justify-center rounded-xl border-3 border-white px-10 text-[clamp(1.1rem,1.3vw,1.65rem)] font-extrabold text-white transition hover:bg-white hover:text-[#061845]"
                >
                  Lihat Layanan Kami
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

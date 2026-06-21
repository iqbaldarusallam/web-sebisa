import Image from "next/image";
import MotionReveal from "./MotionReveal";

const projectPreviews = ["/Ellipse 1.png", "/Ellipse 2.png", "/Ellipse 3.png"];

export default function About() {
  return (
    <section id="tentang-kami" className="bg-white py-14 text-[#303030] md:py-16">
      <div className="mx-auto max-w-7xl px-6 sm:px-[4.5rem] lg:px-20">
        <MotionReveal className="w-full max-w-2xl">
          <h2 className="max-w-[40rem] text-[1.65rem] font-extrabold leading-[1.12] text-[#333333] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.15rem]">
            Digital Agency untuk
            <span className="block">
              <span className="text-[#07B6D5]">Brand</span> Profesional{" "}
              <span className="text-[#07B6D5]">Bergaransi</span>
            </span>
          </h2>

          <p className="mt-5 max-w-[36rem] text-[0.82rem] leading-snug text-[#8b8b8b] sm:text-sm">
            Solusi digital lengkap untuk bisnis dan personal brand, mulai dari
            branding, konten, social media, iklan, website, hingga strategi
            marketing yang membuat Anda tampil lebih profesional.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#contact"
              className="inline-flex min-h-8 w-full items-center justify-center rounded-md bg-[#0077B6] px-4 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#006DA8] sm:w-auto"
            >
              Konsultasi Sekarang
            </a>
            <a
              href="#layanan"
              className="inline-flex min-h-8 w-full items-center justify-center rounded-md border-2 border-[#4b4b4b] px-4 py-1.5 text-xs font-bold text-[#333333] transition hover:border-[#0077B6] hover:text-[#0077B6] sm:w-auto"
            >
              Lihat Layanan Kami
            </a>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {projectPreviews.map((preview, index) => (
                <Image
                  key={preview}
                  src={preview}
                  alt={`Preview project Sebisa ${index + 1}`}
                  width={52}
                  height={52}
                  className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-md shadow-black/15 sm:h-[3.25rem] sm:w-[3.25rem]"
                />
              ))}
            </div>
            <div>
              <p className="text-2xl font-extrabold leading-none text-[#07B6D5]">
                100+
              </p>
              <p className="mt-1 text-xs font-medium text-[#9b9b9b]">
                Project Digital Telah Dikerjakan
              </p>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}

import { FaWhatsapp } from "react-icons/fa6";
import { HiArrowRight } from "react-icons/hi2";
import ButtonLink from "./ButtonLink";
import HeroDeviceOrbit from "./HeroDeviceOrbit";
import MotionReveal from "./MotionReveal";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#141D38] pt-24 text-white sm:pt-28 md:pt-32"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(6,182,212,0.18),transparent_28%),linear-gradient(135deg,#141D38_0%,#0A0F1E_100%)]" />
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[44px_44px]" />
      <div className="pointer-events-none absolute inset-x-0 top-24 h-px bg-linear-to-r from-transparent via-[#20C4E8]/45 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8">
        <div className="grid min-w-0 items-center gap-6 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
          <MotionReveal className="min-w-0">
            <div className="w-full max-w-[23rem] sm:max-w-3xl">
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-cyan-100 ring-1 ring-white/10 sm:px-4 sm:py-2 sm:text-sm">
                100+ Project Digital Telah Dikerjakan
              </span>
              <h1 className="mt-5 max-w-full text-[2.15rem] font-extrabold leading-tight sm:mt-6 sm:text-4xl md:max-w-2xl md:text-6xl">
                Bisnis Bagus Butuh{" "}
                <span className="block text-[#06B6D4] sm:inline">
                  Tampilan Digital
                </span>{" "}
                yang Kuat
              </h1>
              <p className="mt-4 max-w-full text-sm leading-7 text-slate-300 sm:mt-5 sm:text-base sm:leading-8 md:max-w-2xl md:text-lg">
                Kami membantu UMKM, brand, dan perusahaan mengembangkan
                branding, konten, social media, iklan digital, website, dan
                strategi pemasaran yang meningkatkan kredibilitas serta
                konversi bisnis.
              </p>
              <div className="mt-6 flex w-full max-w-[23rem] flex-col gap-2.5 sm:mt-8 sm:max-w-none sm:flex-row sm:gap-3">
                <ButtonLink href="#contact">
                  <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
                  Mulai Gratis Sekarang
                </ButtonLink>
                <ButtonLink href="#layanan" variant="secondary">
                  Lihat Layanan Kami
                  <HiArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.1} className="min-w-0">
            <HeroDeviceOrbit />
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}

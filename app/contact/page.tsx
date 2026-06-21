import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import type { IconType } from "react-icons";
import {
  FaEnvelope,
  FaInstagram,
  FaLocationDot,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";

const contactItems: {
  title: string;
  value: string;
  href: string;
  icon: IconType;
}[] = [
  {
    title: "Email",
    value: "sebisaprojectsuccess@gmail.com",
    href: "mailto:sebisaprojectsuccess@gmail.com",
    icon: FaEnvelope,
  },
  {
    title: "WhatsApp",
    value: "+62 831-7094-3758",
    href: "https://wa.me/6283170943758",
    icon: FaWhatsapp,
  },
  {
    title: "Alamat",
    value: "Grand Duta City Cluster Cascada Blok H11 No. 10 Kab. Bogor",
    href: "https://www.google.com/maps/search/?api=1&query=Grand%20Duta%20City%20Cluster%20Cascada%20Blok%20H11%20No.%2010%20Kab.%20Bogor",
    icon: FaLocationDot,
  },
];

const socialItems: {
  title: string;
  value: string;
  href: string;
  icon: IconType;
}[] = [
  {
    title: "Instagram",
    value: "@sebisa.project.id",
    href: "https://instagram.com/sebisa.project.id",
    icon: FaInstagram,
  },
  {
    title: "TikTok",
    value: "@sebisaproject.id",
    href: "https://www.tiktok.com/@sebisaproject.id?_r=1&_t=ZS-97AfJvf3cKD",
    icon: FaTiktok,
  },
  {
    title: "YouTube",
    value: "Sebisa Project",
    href: "https://youtube.com/@sebisaproject?si=RMLFz7XYKkiPSjai",
    icon: FaYoutube,
  },
];

export const metadata: Metadata = {
  title: "Contact | Sebisa Project",
  description:
    "Hubungi Sebisa Project untuk konsultasi branding, konten, social media, iklan digital, website, dan strategi pemasaran.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-hidden bg-[#0A1020] pt-28 text-white">
        <section className="relative px-6 pb-12 pt-7 sm:px-8 lg:px-20">
          <div className="absolute inset-0 opacity-55 [background:linear-gradient(120deg,#0A1020_0%,#132A4B_48%,#0879A8_140%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-white/15" />
          <div className="relative mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl gap-7 lg:grid-cols-[0.68fr_1.32fr] lg:items-start lg:pt-10">
            <div>
              <span className="inline-flex rounded-full border border-[#20C4E8]/40 bg-[#20C4E8]/12 px-4 py-2 text-xs font-extrabold text-[#20C4E8]">
                KONTAK KAMI
              </span>
              <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Terhubung langsung dengan tim Sebisa Project.
              </h1>
              <p className="mt-5 max-w-xl text-base font-medium leading-7 text-white/72 sm:text-lg">
                Konsultasikan kebutuhan branding, konten, social media, iklan
                digital, website, atau strategi pemasaran Anda melalui kanal
                resmi kami.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/[0.08] p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-7">
              <div className="grid gap-4 md:grid-cols-2">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  const isAddress = item.title === "Alamat";

                  return (
                    <a
                      key={item.title}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                      className={`group flex min-w-0 gap-4 rounded-xl border border-white/12 bg-white/[0.1] p-4 transition hover:-translate-y-1 hover:bg-white/[0.16] ${
                        isAddress ? "min-h-24 md:col-span-2" : "min-h-28"
                      }`}
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#08BBD8] text-[#041B38]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-extrabold text-white">
                          {item.title}
                        </span>
                        <span className="mt-2 block break-words text-sm font-medium leading-6 text-white/72 group-hover:text-white">
                          {item.value}
                        </span>
                      </span>
                    </a>
                  );
                })}

                <div className="rounded-xl border border-white/12 bg-white/[0.1] p-4 md:col-span-2">
                  <p className="text-sm font-extrabold text-white">Media Sosial</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {socialItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <a
                          key={item.title}
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-[#041B38]/40 p-3 transition hover:bg-[#08BBD8] hover:text-[#041B38]"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#041B38]">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-extrabold">
                              {item.title}
                            </span>
                            <span className="mt-1 block truncate text-xs font-semibold text-white/65 group-hover:text-[#041B38]/80">
                              {item.value}
                            </span>
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

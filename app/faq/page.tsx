import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import Link from "next/link";
import {
  HiArrowRight,
  HiBriefcase,
  HiChatBubbleLeftRight,
  HiChevronDown,
  HiCreditCard,
  HiMegaphone,
  HiSparkles,
} from "react-icons/hi2";
import type { IconType } from "react-icons";

type FaqItem = {
  answer: string;
  question: string;
};

type FaqGroup = {
  accent: string;
  description: string;
  icon: IconType;
  items: FaqItem[];
  title: string;
};

const faqGroups: FaqGroup[] = [
  {
    title: "Layanan",
    description: "Pilihan layanan digital yang dapat disesuaikan dengan kebutuhan bisnis.",
    accent: "#20C4E8",
    icon: HiSparkles,
    items: [
      {
        question: "Apa saja layanan yang disediakan?",
        answer:
          "Kami menyediakan Social Media Management, Content Production, Branding, Digital Marketing, Website & Landing Page Development, Personal Branding, hingga konsultasi digitalisasi bisnis.",
      },
      {
        question: "Apakah bisa memilih hanya satu layanan saja?",
        answer:
          "Tentu. Klien dapat memilih layanan sesuai kebutuhan bisnis tanpa harus mengambil seluruh paket layanan.",
      },
      {
        question: "Apakah layanan dapat disesuaikan dengan kebutuhan bisnis?",
        answer:
          "Ya. Solusi dapat disesuaikan dengan tujuan, target pasar, prioritas, dan anggaran bisnis.",
      },
      {
        question: "Bagaimana jika saya belum memiliki branding?",
        answer:
          "Kami dapat membantu membangun branding mulai dari logo, identitas visual, hingga strategi komunikasi brand.",
      },
    ],
  },
  {
    title: "Bisnis & Pemasaran",
    description: "Dukungan untuk UMKM, startup, personal brand, dan perusahaan.",
    accent: "#22C55E",
    icon: HiMegaphone,
    items: [
      {
        question: "Apakah melayani bisnis yang baru mulai atau UMKM?",
        answer:
          "Ya. Kami melayani UMKM, startup, personal brand, hingga perusahaan yang ingin meningkatkan kehadiran digital dan performa pemasarannya.",
      },
      {
        question: "Apakah bisa membantu meningkatkan penjualan bisnis?",
        answer:
          "Kami membantu meningkatkan visibilitas, branding, dan efektivitas pemasaran digital agar bisnis lebih mudah ditemukan dan dipercaya calon pelanggan.",
      },
      {
        question: "Apakah bisa membantu mengelola akun Instagram dari nol?",
        answer:
          "Tentu. Kami dapat membantu mulai dari strategi konten, arahan visual, kalender posting, hingga pengelolaan akun secara rutin.",
      },
    ],
  },
  {
    title: "Proses Kerja Sama",
    description: "Alur kerja dibuat jelas sejak awal agar eksekusi lebih terarah.",
    accent: "#A78BFA",
    icon: HiBriefcase,
    items: [
      {
        question: "Bagaimana proses kerja sama dimulai?",
        answer:
          "Proses dimulai dengan sesi konsultasi, pemetaan kebutuhan, penyusunan strategi, penawaran, lalu pelaksanaan proyek setelah kesepakatan dibuat.",
      },
      {
        question: "Berapa lama pengerjaan proyek?",
        answer:
          "Durasi pengerjaan bergantung pada jenis layanan, cakupan pekerjaan, dan kebutuhan revisi yang disepakati di awal.",
      },
      {
        question: "Apakah ada kontrak kerja sama?",
        answer:
          "Ya. Setiap kerja sama akan disertai proposal dan perjanjian kerja agar ruang lingkup, jadwal, dan tanggung jawab lebih jelas.",
      },
      {
        question: "Apakah saya akan mendapatkan laporan hasil pekerjaan?",
        answer:
          "Ya. Untuk layanan berkala, kami menyediakan laporan performa secara periodik sesuai kebutuhan layanan yang berjalan.",
      },
    ],
  },
  {
    title: "Administrasi & Kontak",
    description: "Informasi pembayaran, konsultasi, dan cara menghubungi tim.",
    accent: "#F59E0B",
    icon: HiCreditCard,
    items: [
      {
        question: "Bagaimana sistem pembayaran?",
        answer:
          "Sistem pembayaran akan dijelaskan dalam proposal kerja sama sesuai layanan, durasi, dan kesepakatan bersama.",
      },
      {
        question: "Apakah melayani klien di luar kota?",
        answer:
          "Ya. Seluruh proses dapat dilakukan secara online, mulai dari konsultasi, koordinasi, revisi, hingga pelaporan.",
      },
      {
        question: "Apakah bisa konsultasi terlebih dahulu?",
        answer:
          "Tentu. Kami menyediakan sesi konsultasi awal untuk memahami kebutuhan, target, dan kondisi bisnis Anda.",
      },
      {
        question: "Bagaimana cara menghubungi tim?",
        answer:
          "Anda dapat menghubungi kami melalui WhatsApp, email, atau formulir konsultasi di website.",
      },
    ],
  },
];

const totalFaqs = faqGroups.reduce((total, group) => total + group.items.length, 0);

export const metadata: Metadata = {
  title: "FAQ | Sebisa Project",
  description:
    "Pertanyaan umum seputar layanan, proses kerja sama, pembayaran, konsultasi, dan dukungan digital Sebisa Project.",
};

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-[#0A1020] pt-28 text-white">
        <section className="relative px-6 pb-14 pt-7 sm:px-8 lg:px-20">
          <div className="absolute inset-0 opacity-55 [background:linear-gradient(120deg,#0A1020_0%,#132A4B_48%,#0879A8_140%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-white/15" />

          <div className="relative mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl gap-8 py-10 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
            <div className="lg:sticky lg:top-32">
              <span className="inline-flex rounded-full border border-[#20C4E8]/40 bg-[#20C4E8]/12 px-4 py-2 text-xs font-extrabold text-[#20C4E8]">
                FAQ
              </span>
              <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Pertanyaan yang paling sering ditanyakan.
              </h1>
              <p className="mt-5 max-w-xl text-base font-medium leading-8 text-white/72 sm:text-lg">
                Temukan jawaban seputar layanan, proses kerja sama, sistem
                pembayaran, hingga cara memulai konsultasi bersama Sebisa
                Project.
              </p>

              <div className="mt-8 grid max-w-xl grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/12 bg-white/[0.08] p-4">
                  <p className="text-3xl font-extrabold text-[#20C4E8]">
                    {totalFaqs}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                    Jawaban
                  </p>
                </div>
                <div className="rounded-xl border border-white/12 bg-white/[0.08] p-4">
                  <p className="text-3xl font-extrabold text-[#22C55E]">
                    Online
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                    Proses kerja
                  </p>
                </div>
              </div>

              <Link
                href="/contact"
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#0879A8] px-6 text-sm font-extrabold text-white transition hover:bg-[#16A9D8]"
              >
                Konsultasi Sekarang
                <HiArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>

            <div className="space-y-5">
              {faqGroups.map((group) => {
                const Icon = group.icon;

                return (
                  <section
                    key={group.title}
                    className="rounded-2xl border border-white/12 bg-white/[0.08] p-4 shadow-xl shadow-black/10 backdrop-blur sm:p-5"
                  >
                    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.06] p-4 sm:flex-row sm:items-center">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-[#041B38]"
                        style={{ backgroundColor: group.accent }}
                      >
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold leading-tight text-white">
                          {group.title}
                        </h2>
                        <p className="mt-2 text-sm font-medium leading-6 text-white/65">
                          {group.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {group.items.map((item, index) => (
                        <details
                          key={item.question}
                          open={index === 0}
                          className="group rounded-xl border border-white/10 bg-[#07172E]/70 p-0 transition open:border-white/20 open:bg-[#0D1C35]"
                        >
                          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-4 py-4 marker:hidden [&::-webkit-details-marker]:hidden">
                            <span className="text-sm font-extrabold leading-6 text-white sm:text-base">
                              {item.question}
                            </span>
                            <span
                              className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#041B38] transition group-open:rotate-180"
                              style={{ backgroundColor: group.accent }}
                            >
                              <HiChevronDown className="h-4 w-4" aria-hidden="true" />
                            </span>
                          </summary>
                          <p className="px-4 pb-5 text-sm font-medium leading-7 text-white/68">
                            {item.answer}
                          </p>
                        </details>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#DFF3FF] px-6 py-16 text-[#12345A] sm:px-8 lg:px-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-2xl bg-white p-6 shadow-xl shadow-sky-950/8 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#12345A] text-white">
                <HiChatBubbleLeftRight className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-3xl font-extrabold leading-tight">
                Masih ada pertanyaan lain?
              </h2>
              <p className="mt-3 text-sm font-medium leading-7 text-[#536577]">
                Ceritakan kebutuhan bisnis Anda, lalu tim kami akan membantu
                memberi arahan layanan yang paling sesuai.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#0879A8] px-6 text-sm font-extrabold text-white transition hover:bg-[#16A9D8]"
            >
              Hubungi Tim
              <HiArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

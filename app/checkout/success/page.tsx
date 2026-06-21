import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SuccessCheckIcon from "@/components/checkout/SuccessCheckIcon";
import type { Metadata } from "next";
import Link from "next/link";
import { HiArrowPath, HiChatBubbleLeftRight, HiHome, HiSquares2X2 } from "react-icons/hi2";

export const metadata: Metadata = {
  title: "Order Berhasil | Sebisa Project",
};

const statusContent = {
  created: {
    label: "Order berhasil dibuat",
    title: "Order Anda berhasil dibuat.",
    description:
      "Tim Sebisa Project akan mengecek detail kebutuhan Anda dan menghubungi lewat WhatsApp untuk langkah berikutnya.",
  },
  manual: {
    label: "Menunggu follow-up tim",
    title: "Order berhasil masuk.",
    description:
      "Payment gateway belum aktif, jadi tim Sebisa Project akan menghubungi Anda untuk instruksi pembayaran dan konfirmasi project.",
  },
  paid: {
    label: "Pembayaran diterima",
    title: "Pembayaran berhasil diterima.",
    description:
      "Terima kasih. Status final tetap akan dicocokkan otomatis melalui Midtrans sebelum project diproses tim.",
  },
  pending: {
    label: "Menunggu pembayaran",
    title: "Order berhasil dibuat.",
    description:
      "Pembayaran masih pending. Anda bisa menyelesaikan pembayaran melalui halaman Midtrans, lalu tim kami akan melakukan follow-up.",
  },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string; status?: string }>;
}) {
  const params = await searchParams;
  const statusKey =
    params.status && params.status in statusContent
      ? (params.status as keyof typeof statusContent)
      : "created";
  const content = statusContent[statusKey];

  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-hidden bg-[#08111F] px-4 pt-24 text-white sm:px-8 sm:pt-28 lg:px-20">
        <section className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl items-center justify-center py-8 text-center sm:min-h-[calc(100vh-7rem)] sm:py-12">
          <div className="absolute inset-0 opacity-80 [background:radial-gradient(circle_at_50%_22%,rgba(34,197,94,0.24),transparent_28%),radial-gradient(circle_at_15%_75%,rgba(32,196,232,0.16),transparent_25%)]" />
          <div className="relative w-full rounded-2xl border border-white/12 bg-white/[0.07] p-4 shadow-2xl shadow-black/25 backdrop-blur-xl sm:rounded-3xl sm:p-10">
            <SuccessCheckIcon />
            <span className="mt-5 inline-flex rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.08em] text-[#86EFAC] sm:mt-7 sm:px-4 sm:py-2 sm:text-xs">
              {content.label}
            </span>
            <h1 className="mx-auto mt-4 max-w-2xl text-[2rem] font-black leading-tight sm:mt-5 sm:text-5xl">
              {content.title}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-xs font-medium leading-6 text-white/64 sm:mt-4 sm:text-base sm:leading-7">
              {content.description}
            </p>

            <div className="mx-auto mt-5 grid max-w-2xl gap-3 sm:mt-7 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-[#08111F]/58 p-3 text-left sm:rounded-2xl sm:p-4">
                <p className="text-xs font-black uppercase tracking-[0.08em] text-white/42">
                  Kode order
                </p>
                <p className="mt-2 break-words text-sm font-black text-white">
                  {params.order_id ?? "Belum tersedia"}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#08111F]/58 p-3 text-left sm:rounded-2xl sm:p-4">
                <p className="text-xs font-black uppercase tracking-[0.08em] text-white/42">
                  Langkah berikutnya
                </p>
                <p className="mt-2 text-sm font-bold leading-6 text-white/72">
                  Tim kami akan follow-up detail project melalui WhatsApp.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:mt-8 sm:flex-row sm:gap-3">
              <Link
                href="/"
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-[#20C4E8] px-5 text-xs font-black text-[#041B38] transition hover:bg-[#67E8F9] sm:min-h-12 sm:w-auto sm:px-6 sm:text-sm"
              >
                <HiHome className="h-5 w-5" aria-hidden="true" />
                Kembali ke Home
              </Link>
              <Link
                href="/#layanan"
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-white/16 px-5 text-xs font-black text-white/78 transition hover:bg-white/10 hover:text-white sm:min-h-12 sm:w-auto sm:px-6 sm:text-sm"
              >
                <HiSquares2X2 className="h-5 w-5" aria-hidden="true" />
                Lihat layanan
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-white/44">
              <span className="inline-flex items-center gap-1.5">
                <HiChatBubbleLeftRight className="h-4 w-4" aria-hidden="true" />
                Follow-up via WhatsApp
              </span>
              <span className="inline-flex items-center gap-1.5">
                <HiArrowPath className="h-4 w-4" aria-hidden="true" />
                Status pembayaran diperbarui otomatis
              </span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

"use client";

import type { Service } from "@/data/services";
import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import {
  HiArrowPath,
  HiCheckCircle,
  HiCreditCard,
  HiExclamationTriangle,
} from "react-icons/hi2";
import type { MidtransClientConfig } from "@/lib/commerce/midtrans";

import { IoIosPricetags } from "react-icons/io";
type CheckoutResponse = {
  ok: boolean;
  message?: string;
  orderCode?: string;
  amount?: number;
  paymentConfigured?: boolean;
  snapToken?: string | null;
  snap_token?: string | null;
  token?: string | null;
  redirectUrl?: string | null;
};

type SnapCallbacks = {
  onSuccess?: (result: unknown) => void;
  onPending?: (result: unknown) => void;
  onError?: (result: unknown) => void;
  onClose?: () => void;
};

declare global {
  interface Window {
    snap?: {
      pay: (token: string, callbacks?: SnapCallbacks) => void;
    };
  }
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

const fieldShellClass =
  "rounded-xl border border-white/10 bg-[#08111F]/58 p-2.5 transition focus-within:border-[#20C4E8]/80 focus-within:bg-[#08111F]/82 sm:rounded-2xl sm:p-3";
const labelClass = "block text-xs font-black uppercase tracking-[0.08em] text-white/58";
const fieldClass =
  "mt-1.5 w-full border-0 bg-transparent text-xs font-bold text-white outline-none placeholder:text-white/30 sm:mt-2 sm:text-sm";
const helperClass = "mt-1.5 text-[0.68rem] font-semibold leading-5 text-white/42 sm:mt-2 sm:text-xs";

export default function CheckoutForm({
  initialService,
  midtransConfig,
  services,
}: {
  initialService?: string;
  midtransConfig: MidtransClientConfig;
  services: Service[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [snapReady, setSnapReady] = useState(false);
  const serviceVariants = useMemo(
    () => services.map((service) => service.title),
    [services],
  );
  const defaultService = useMemo(
    () =>
      initialService && serviceVariants.includes(initialService)
        ? initialService
        : serviceVariants[0] ?? "",
    [initialService, serviceVariants],
  );
  const [selectedService, setSelectedService] = useState(defaultService);
  const selectedServiceData =
    services.find((service) => service.title === selectedService) ??
    services[0];

  function goToSuccess(orderId: string, paymentStatus: string) {
    const params = new URLSearchParams({
      order_id: orderId,
      status: paymentStatus,
    });

    router.replace(`/checkout/success?${params.toString()}`);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as CheckoutResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Checkout gagal diproses.");
      }

      setOrderCode(data.orderCode ?? "");
      const currentOrderCode = data.orderCode ?? "";
      const snapToken = data.snapToken ?? data.snap_token ?? data.token ?? null;

      if (snapToken) {
        if (!snapReady || !window.snap) {
          if (data.redirectUrl) {
            setMessage("Mengalihkan ke halaman pembayaran Midtrans.");
            window.location.assign(data.redirectUrl);
            return;
          }

          setStatus("error");
          setMessage(
            "Payment gateway belum siap dimuat. Coba ulangi beberapa detik lagi.",
          );
          return;
        }

        setMessage("Membuka Midtrans Snap.");
        window.snap.pay(snapToken, {
          onSuccess: () => {
            setStatus("success");
            setMessage(
              `Pembayaran untuk order ${currentOrderCode} diterima Midtrans. Status final akan dikonfirmasi melalui webhook.`,
            );
            form.reset();
            goToSuccess(currentOrderCode, "paid");
          },
          onPending: () => {
            setStatus("success");
            setMessage(
              `Order ${currentOrderCode} sedang menunggu pembayaran. Status final akan diperbarui otomatis oleh Midtrans.`,
            );
            form.reset();
            goToSuccess(currentOrderCode, "pending");
          },
          onError: () => {
            setStatus("error");
            setMessage(
              `Pembayaran order ${currentOrderCode} gagal diproses Midtrans. Silakan coba lagi atau hubungi admin.`,
            );
          },
          onClose: () => {
            setStatus("success");
            setMessage(
              `Order ${currentOrderCode} sudah dibuat dan masih pending. Silakan lanjutkan pembayaran saat siap.`,
            );
            goToSuccess(currentOrderCode, "pending");
          },
        });
        return;
      }

      setStatus("success");
      setMessage(
        data.paymentConfigured === false
          ? `Order ${data.orderCode} berhasil dibuat. Tim Sebisa Project akan menghubungi Anda untuk langkah pembayaran. Total pembayaran: ${formatMoney(data.amount ?? 0)}.`
          : `Order ${data.orderCode} berhasil dibuat.`,
      );
      form.reset();
      goToSuccess(data.orderCode ?? "", data.paymentConfigured === false ? "manual" : "created");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Checkout gagal diproses.",
      );
    }
  }

  return (
    <>
      {midtransConfig.clientKey ? (
        <Script
          id="midtrans-snap"
          src={midtransConfig.snapScriptUrl}
          strategy="afterInteractive"
          data-client-key={midtransConfig.clientKey}
          onReady={() => setSnapReady(true)}
          onError={() => setSnapReady(false)}
        />
      ) : null}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/12 bg-white/8 p-4 shadow-2xl shadow-black/25 backdrop-blur-xl sm:rounded-3xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full bg-[#20C4E8] px-3 py-1.5 text-[0.68rem] font-black text-[#041B38] sm:px-4 sm:py-2 sm:text-xs">
              FORM PROJECT
            </span>
            <h2 className="mt-3 text-xl font-black sm:mt-4 sm:text-2xl">Mulai transaksi</h2>
            <p className="mt-2 text-xs font-medium leading-5 text-white/58 sm:text-sm sm:leading-6">
              Isi form sesuai kebutuhanmu, lalu lanjutkan pembayaran.
            </p>
          </div>
          <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#20C4E8] text-[#041B38] sm:flex">
            <HiCreditCard className="h-6 w-6" aria-hidden="true" />
          </span>
        </div>

      {selectedServiceData ? (
          <div className="mt-5 overflow-hidden rounded-xl border border-[#20C4E8]/20 bg-[#08111F]/75 sm:mt-6 sm:rounded-2xl">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#20C4E8]/12 px-3 py-1 text-xs font-black text-[#20C4E8]">
              <IoIosPricetags className="h-4 w-4" aria-hidden="true" />
              Harga Promo
            </span>
            <span className="rounded-full bg-[#22C55E] px-3 py-1 text-[0.68rem] font-black text-white">
              Hemat{" "}
              {formatMoney(
                selectedServiceData.compareAtPrice - selectedServiceData.price,
              )}
            </span>
          </div>
            <div className="grid gap-3 px-3 py-3 sm:grid-cols-[1fr_auto] sm:items-end sm:px-4 sm:py-4">
            <div className="min-w-0">
              <p className="text-sm font-black leading-6 text-white">
                {selectedServiceData.title}
              </p>
              <p className="mt-2 text-xs font-semibold leading-5 text-white/52">
                Harga dapat disesuaikan jika scope project berubah setelah
                diskusi.
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm font-bold text-white/42 line-through">
                {formatMoney(selectedServiceData.compareAtPrice)}
              </p>
              <p className="mt-1 text-2xl font-black leading-none text-[#20C4E8] sm:text-3xl">
                {formatMoney(selectedServiceData.price)}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 sm:mt-6 sm:rounded-3xl sm:p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={fieldShellClass}>
            <span className={labelClass}>Nama lengkap</span>
            <input
              name="name"
              required
              autoComplete="name"
              placeholder="Masukkan nama Anda"
              className={`${fieldClass} h-8`}
            />
          </label>
          <label className={fieldShellClass}>
            <span className={labelClass}>Brand / bisnis</span>
            <input
              name="brand"
              required
              autoComplete="organization"
              placeholder="Nama brand atau bisnis"
              className={`${fieldClass} h-8`}
            />
          </label>
          <label className={`${fieldShellClass} sm:col-span-2`}>
            <span className={labelClass}>Pilih layanan</span>
            <select
              name="serviceName"
              required
              value={selectedService}
              onChange={(event) => setSelectedService(event.target.value)}
              className={`${fieldClass} h-9 cursor-pointer pr-8`}
            >
              {serviceVariants.map((service) => (
                <option key={service} value={service} className="bg-[#08111F]">
                  {service}
                </option>
              ))}
            </select>
            <p className={helperClass}>
              Harga di atas otomatis mengikuti layanan yang dipilih.
            </p>
          </label>
          <label className={fieldShellClass}>
            <span className={labelClass}>Nomor WhatsApp</span>
            <input
              name="whatsapp"
              required
              autoComplete="tel"
              inputMode="tel"
              placeholder="+62 812 3456 7890"
              className={`${fieldClass} h-8`}
            />
          </label>
          <label className={fieldShellClass}>
            <span className={labelClass}>Email aktif</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="nama@email.com"
              className={`${fieldClass} h-8`}
            />
          </label>
          <label className={`${fieldShellClass} sm:col-span-2`}>
            <span className={labelClass}>Catatan project</span>
            <textarea
              name="notes"
              rows={5}
              placeholder="Ceritakan kebutuhan, target, deadline, atau referensi project Anda"
              className={`${fieldClass} min-h-28 resize-y py-1 leading-6`}
            />
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[#22C55E] px-6 text-sm font-black text-white transition hover:bg-[#16A34A] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? (
          <>
            <HiArrowPath className="h-5 w-5 animate-spin" aria-hidden="true" />
            Memproses order
          </>
        ) : (
          <>
            Lanjut Pembayaran
            <HiCreditCard className="h-5 w-5" aria-hidden="true" />
          </>
        )}
      </button>

      {status === "success" || status === "error" ? (
        <div
          className={`mt-5 flex gap-3 rounded-2xl border px-4 py-3 text-sm font-bold leading-6 ${
            status === "success"
              ? "border-[#22C55E]/25 bg-[#22C55E]/10 text-[#86EFAC]"
              : "border-red-400/25 bg-red-500/10 text-red-200"
          }`}
        >
          {status === "success" ? (
            <HiCheckCircle
              className="mt-0.5 h-5 w-5 shrink-0"
              aria-hidden="true"
            />
          ) : (
            <HiExclamationTriangle
              className="mt-0.5 h-5 w-5 shrink-0"
              aria-hidden="true"
            />
          )}
          <span>
            {message}
            {orderCode ? (
              <span className="block text-white/60">
                Kode order: {orderCode}
              </span>
            ) : null}
          </span>
        </div>
      ) : null}
      </form>
    </>
  );
}

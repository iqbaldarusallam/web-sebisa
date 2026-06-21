"use client";

import { useState, type FormEvent } from "react";

const whatsappLink =
  "https://wa.me/6283170943758?text=Halo%20Sebisa%20Project,%20saya%20ingin%20konsultasi";

const fields = [
  { label: "Nama", name: "name", placeholder: "Masukan nama anda" },
  { label: "Brand", name: "brand", placeholder: "Masukan nama brand" },
  { label: "Produk", name: "product", placeholder: "Kebutuhan layanan" },
  { label: "WhatsApp", name: "whatsapp", placeholder: "+62 8..." },
];

type SubmitState = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("loading");
    setMessage("");

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { ok: boolean; persisted?: boolean; message?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Pesan gagal dikirim.");
      }

      setSubmitState("success");
      setMessage(
        data.persisted
          ? "Pesan masuk ke dashboard admin. Tim Sebisa akan follow-up."
          : "Pesan diproses mode demo. Hubungi WhatsApp untuk follow-up cepat.",
      );
      form.reset();
    } catch (error) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : "Pesan gagal dikirim.");
    }
  }

  return (
    <section id="contact" className="bg-white py-10 text-[#0879A8] sm:py-12 md:py-14">
      <div className="mx-auto grid max-w-7xl items-center gap-7 px-4 sm:gap-9 sm:px-8 lg:grid-cols-[1.12fr_0.88fr] lg:px-20">
        <div>
          <h2 className="text-[2.1rem] font-black uppercase leading-[1.02] text-[#0879A8] sm:text-[3.6rem] md:text-[4.5rem] lg:text-[5rem]">
            <span className="block">Siap Maju</span>
            <span className="block">Bareng</span>
            <span className="block">Sebisa?</span>
          </h2>

          <div className="mt-5 flex flex-wrap items-center gap-2.5 text-[0.7rem] font-extrabold text-[#0879A8] sm:mt-7 sm:gap-3 sm:text-xs">
            <a
              href={whatsappLink}
              className="inline-flex min-h-8 items-center justify-center rounded-md border border-[#0879A8] px-3.5 py-1.5 text-[0.7rem] font-extrabold transition hover:bg-[#EAF8FF] sm:min-h-9 sm:px-4 sm:text-xs"
            >
              Konsultasi Gratis
            </a>
            <span>24/7 Admin Active</span>
            <span>Free Consult</span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-[23rem] rounded-xl border border-[#1ABBD2] bg-[#274D78] px-4 py-5 text-white shadow-sm sm:px-8 sm:py-7"
        >
          <div className="space-y-3.5 sm:space-y-4">
            {fields.map((field) => (
              <label key={field.name} className="block">
                <span className="text-sm font-extrabold leading-none text-white sm:text-base">
                  {field.label}
                </span>
                <input
                  type={field.name === "whatsapp" ? "tel" : "text"}
                  name={field.name}
                  required
                  placeholder={field.placeholder}
                  className="mt-2 h-8 w-full rounded-md border border-white/70 bg-transparent px-3 text-xs font-medium text-white outline-none transition placeholder:text-white/35 focus:border-white"
                />
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitState === "loading"}
            className="mt-6 inline-flex min-h-9 w-full items-center justify-center rounded-full bg-[#45BF2E] px-5 py-2 text-xs font-extrabold text-white transition hover:bg-[#38A925] sm:mt-8 sm:min-h-10 sm:py-2.5 sm:text-sm"
          >
            {submitState === "loading" ? "Mengirim..." : "Kirim Ke Admin"}
          </button>
          {submitState === "success" || submitState === "error" ? (
            <p
              className={`mt-4 rounded-lg px-3 py-2 text-xs font-bold leading-5 ${
                submitState === "success"
                  ? "bg-emerald-400/15 text-emerald-100"
                  : "bg-red-400/15 text-red-100"
              }`}
            >
              {message}
            </p>
          ) : null}
          <a
            href={whatsappLink}
            className="mt-3 inline-flex w-full justify-center text-xs font-extrabold text-white/80 underline-offset-4 hover:underline"
          >
            Atau lanjut via WhatsApp
          </a>
        </form>
      </div>
    </section>
  );
}

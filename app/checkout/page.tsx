import CheckoutForm from "@/components/checkout/CheckoutForm";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getMidtransClientConfig } from "@/lib/commerce/midtrans";
import { getPublicCmsContent } from "@/lib/public/cms";
import type { Metadata } from "next";
import Link from "next/link";
import { HiChatBubbleLeftRight, HiCreditCard, HiShieldCheck } from "react-icons/hi2";

export const metadata: Metadata = {
  title: "Checkout Project | Sebisa Project",
  description:
    "Mulai transaksi project digital bersama Sebisa Project melalui pilihan layanan, harga promo, form order, dan payment gateway.",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;
  const midtransConfig = getMidtransClientConfig();
  const cms = await getPublicCmsContent();

  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-hidden bg-[#08111F] pt-24 text-white sm:pt-28">
        <section className="relative px-4 py-10 sm:px-8 sm:py-12 lg:px-20">
          <div className="absolute inset-0 opacity-80 [background:radial-gradient(circle_at_20%_15%,rgba(32,196,232,0.22),transparent_30%),linear-gradient(125deg,#08111F_0%,#142A4C_55%,#061021_100%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-6 sm:gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div>
              <span className="inline-flex rounded-full border border-[#20C4E8]/35 bg-[#20C4E8]/12 px-3 py-1.5 text-[0.68rem] font-black text-[#20C4E8] sm:px-4 sm:py-2 sm:text-xs">
                CHECKOUT PROJECT
              </span>
              <h1 className="mt-5 max-w-2xl text-[2.2rem] font-black leading-tight tracking-tight sm:mt-6 sm:text-5xl lg:text-6xl">
                Mulai project digital dengan alur yang jelas.
              </h1>
              <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-white/64 sm:mt-5 sm:text-base sm:leading-7">
                Form ini membantu tim kami menerima detail kebutuhan, mencatat
                order, dan memproses pembayaran layanan dengan alur yang lebih rapi.
              </p>

              <div className="mt-6 grid max-w-xl gap-2.5 sm:mt-8 sm:grid-cols-3 sm:gap-3">
                {[
                  { icon: HiChatBubbleLeftRight, label: "Detail project tercatat" },
                  { icon: HiCreditCard, label: "Pembayaran awal lebih mudah" },
                  { icon: HiShieldCheck, label: "Follow-up lebih terarah" },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.06] p-3 sm:rounded-2xl sm:p-4">
                      <Icon className="h-5 w-5 text-[#20C4E8] sm:h-6 sm:w-6" aria-hidden="true" />
                      <p className="mt-2 text-[0.68rem] font-black leading-5 text-white/78 sm:mt-3 sm:text-xs">{item.label}</p>
                    </div>
                  );
                })}
              </div>

              <Link
                href="/#layanan"
                className="mt-6 inline-flex min-h-10 items-center justify-center rounded-full border border-white/20 px-4 text-xs font-black text-white/78 transition hover:bg-white/10 hover:text-white sm:mt-8 sm:min-h-11 sm:px-5 sm:text-sm"
              >
                Lihat layanan dulu
              </Link>
            </div>

            <CheckoutForm
              initialService={params.service}
              midtransConfig={midtransConfig}
              services={cms.services}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

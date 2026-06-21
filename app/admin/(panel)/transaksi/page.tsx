import { getAdminSnapshot } from "@/lib/admin/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Transaksi | Sebisa Project",
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AdminTransaksiPage() {
  const snapshot = await getAdminSnapshot();

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#20C4E8]">
            TRANSAKSI
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
            Order dan Pembayaran
          </h1>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2">
          <span className="text-xl font-black text-white">
            {snapshot.orders.length}
          </span>
          <span className="ml-2 text-xs font-bold text-white/48">order</span>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl bg-white text-slate-900 shadow-xl shadow-black/15">
        <div className="flex flex-col gap-1 border-b border-slate-200 px-5 py-4">
          <h2 className="text-xl font-black">Data Transaksi</h2>
          <p className="text-sm font-semibold text-slate-500">
            Status order dan payment gateway.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-500">
              <tr>
                {[
                  "Order ID",
                  "Nama Customer",
                  "Paket Layanan",
                  "Nominal",
                  "Order Status",
                  "Status Pembayaran",
                  "Tanggal Transaksi",
                ].map((column) => (
                  <th key={column} className="px-5 py-3.5 font-black">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {snapshot.orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center font-semibold text-slate-500"
                  >
                    Belum ada transaksi.
                  </td>
                </tr>
              ) : (
                snapshot.orders.map((order) => (
                  <tr key={order.id} className="transition hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <p className="font-black text-slate-900">
                        {order.orderCode}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {order.brand}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">
                        {order.customerName}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {order.whatsapp}
                      </p>
                    </td>
                    <td className="max-w-[18rem] px-5 py-4 font-semibold leading-6 text-slate-700">
                      {order.serviceName}
                    </td>
                    <td className="px-5 py-4 font-black text-emerald-700">
                      {formatMoney(order.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700">
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-500">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

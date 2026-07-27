import { getAdminSnapshot } from "@/lib/admin/data";
import { updateOrderStatusAction } from "@/app/admin/actions";
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

const orderStatuses = [
  { value: "pending_payment", label: "Menunggu Pembayaran" },
  { value: "processing", label: "Diproses" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

const paymentStatuses = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Lunas" },
  { value: "failed", label: "Gagal" },
  { value: "refunded", label: "Refund" },
];

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
            Kelola status order dan pembayaran.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
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
                  "Aksi",
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
                    colSpan={8}
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
                      <form action={updateOrderStatusAction}>
                        <input type="hidden" name="orderCode" value={order.orderCode} />
                        <input type="hidden" name="paymentStatus" value={order.paymentStatus} />
                        <select
                          name="status"
                          defaultValue={order.status}
                          onChange={(e) => e.currentTarget.form?.requestSubmit()}
                          className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700 border-0 cursor-pointer"
                        >
                          {orderStatuses.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </form>
                    </td>
                    <td className="px-5 py-4">
                      <form action={updateOrderStatusAction}>
                        <input type="hidden" name="orderCode" value={order.orderCode} />
                        <input type="hidden" name="status" value={order.status} />
                        <select
                          name="paymentStatus"
                          defaultValue={order.paymentStatus}
                          onChange={(e) => e.currentTarget.form?.requestSubmit()}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 border-0 cursor-pointer"
                        >
                          {paymentStatuses.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </form>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={`https://wa.me/${order.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-xs font-black text-white hover:bg-green-600"
                      >
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Hubungi
                      </a>
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

import AdminMetricCard from "@/components/admin/AdminMetricCard";
import AdminDashboardCharts, {
  type ActivityPoint,
  type ContentPoint,
} from "@/components/admin/AdminDashboardCharts";
import { getAdminSnapshot } from "@/lib/admin/data";
import type { AdminSnapshot } from "@/lib/admin/types";
import type { Metadata } from "next";
import Link from "next/link";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";

export const metadata: Metadata = {
  title: "Dashboard Admin | Sebisa Project",
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
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatStatus(value: string) {
  return value
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function statusClass(value: string) {
  if (value === "paid" || value === "settlement" || value === "capture") {
    return "bg-emerald-400/10 text-emerald-200";
  }

  if (value === "failed" || value === "cancelled" || value === "deny" || value === "failure") {
    return "bg-red-400/10 text-red-200";
  }

  if (value === "expired" || value === "expire") {
    return "bg-amber-400/10 text-amber-200";
  }

  return "bg-[#20C4E8]/12 text-[#67E8F9]";
}

function jakartaDateKey(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "00";
  const day = parts.find((part) => part.type === "day")?.value ?? "00";

  return `${year}-${month}-${day}`;
}

function jakartaLabel(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "short",
  }).format(value);
}

function buildActivityData(snapshot: AdminSnapshot): ActivityPoint[] {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    return {
      date,
      key: jakartaDateKey(date),
      label: jakartaLabel(date),
      leads: 0,
      orders: 0,
      revenue: 0,
    };
  });
  const byKey = new Map(days.map((day) => [day.key, day]));

  for (const message of snapshot.messages) {
    const row = byKey.get(jakartaDateKey(message.createdAt));
    if (row) {
      row.leads += 1;
    }
  }

  for (const order of snapshot.orders) {
    const row = byKey.get(jakartaDateKey(order.createdAt));
    if (row) {
      row.orders += 1;
      row.revenue += order.status === "paid" ? order.amount : 0;
    }
  }

  return days.map(({ label, leads, orders, revenue }) => ({
    label,
    leads,
    orders,
    revenue,
  }));
}

function buildContentData(snapshot: AdminSnapshot): ContentPoint[] {
  return [
    {
      label: "Layanan",
      value: snapshot.services.length,
    },
    {
      label: "Porto",
      value: snapshot.portfolio.length,
    },
    {
      label: "Review",
      value: snapshot.testimonials.length,
    },
    {
      label: "Tim",
      value: snapshot.team.length,
    },
    {
      label: "Client",
      value: snapshot.clients.length,
    },
  ];
}

export default async function AdminDashboardPage() {
  const snapshot = await getAdminSnapshot();
  const paidOrders = snapshot.orders.filter((order) => order.status === "paid");
  const revenue = paidOrders.reduce((total, order) => total + order.amount, 0);
  const activeContent =
    snapshot.services.length +
    snapshot.portfolio.length +
    snapshot.testimonials.length +
    snapshot.team.length +
    snapshot.clients.length;
  const activityData = buildActivityData(snapshot);
  const contentData = buildContentData(snapshot);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1224] p-6 shadow-2xl shadow-black/25">
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_0.62fr] lg:items-end">
          <div>
            <span className="inline-flex rounded-full bg-[#20C4E8] px-3 py-1.5 text-xs font-black text-[#041B38]">
              DASHBOARD
            </span>
            <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              Ringkasan CMS Sebisa Project
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-white/6 p-4">
            <div>
              <p className="text-2xl font-black">{snapshot.orders.length}</p>
              <p className="mt-1 text-xs font-bold text-white/45">Transaksi</p>
            </div>
            <div>
              <p className="text-2xl font-black">{snapshot.messages.length}</p>
              <p className="mt-1 text-xs font-bold text-white/45">Leads</p>
            </div>
            <div>
              <p className="text-2xl font-black">{activeContent}</p>
              <p className="mt-1 text-xs font-bold text-white/45">Konten</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard
          label="Revenue"
          value={formatMoney(revenue)}
          description="Transaksi paid."
          tone="green"
        />
        <AdminMetricCard
          label="Layanan"
          value={String(snapshot.services.length)}
          description="Data layanan."
          tone="cyan"
        />
        <AdminMetricCard
          label="Portfolio"
          value={String(snapshot.portfolio.length)}
          description="Project tersimpan."
          tone="violet"
        />
        <AdminMetricCard
          label="Client Logo"
          value={String(snapshot.clients.length)}
          description="Home dan Kerjasama."
          tone="amber"
        />
      </section>

      <section>
        <AdminDashboardCharts activity={activityData} content={contentData} />
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-xl shadow-black/20">
        <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-[#20C4E8]">Transaksi Terbaru</p>
            <h2 className="mt-1 text-2xl font-black">Order yang perlu dipantau</h2>
          </div>
          <Link
            href="/admin/transaksi"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-xs font-black text-white/70 transition hover:bg-white/[0.08] hover:text-white"
          >
            Lihat semua
            <HiArrowTopRightOnSquare className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-[#08111F]/70 text-xs uppercase tracking-[0.08em] text-white/45">
              <tr>
                <th className="px-5 py-3.5 font-black">Kode</th>
                <th className="px-5 py-3.5 font-black">Customer</th>
                <th className="px-5 py-3.5 font-black">Layanan</th>
                <th className="px-5 py-3.5 font-black">Total</th>
                <th className="px-5 py-3.5 font-black">Status</th>
                <th className="px-5 py-3.5 font-black">Pembayaran</th>
                <th className="px-5 py-3.5 font-black">Masuk</th>
                <th className="px-5 py-3.5 font-black">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {snapshot.orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-sm font-semibold text-white/45"
                  >
                    Belum ada transaksi.
                  </td>
                </tr>
              ) : (
                snapshot.orders.slice(0, 8).map((order) => (
                  <tr key={order.id} className="transition hover:bg-white/[0.04]">
                    <td className="px-5 py-4 font-black text-white">
                      {order.orderCode}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-black text-white">{order.customerName}</p>
                      <p className="mt-1 text-xs font-semibold text-white/45">
                        {order.brand}
                      </p>
                    </td>
                    <td className="max-w-[18rem] px-5 py-4 font-semibold text-white/70">
                      <span className="line-clamp-2">{order.serviceName}</span>
                    </td>
                    <td className="px-5 py-4 font-black text-white">
                      {formatMoney(order.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${statusClass(
                          order.status,
                        )}`}
                      >
                        {formatStatus(order.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${statusClass(
                          order.paymentStatus,
                        )}`}
                      >
                        {formatStatus(order.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-white/55">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href="/admin/transaksi"
                        className="inline-flex min-h-9 items-center rounded-lg px-2.5 text-xs font-black text-[#67E8F9] transition hover:bg-[#20C4E8]/10"
                      >
                        Detail
                      </Link>
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

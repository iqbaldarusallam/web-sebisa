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

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <AdminDashboardCharts activity={activityData} content={contentData} />
        <div className="rounded-3xl border border-white/10 bg-white/6 p-5 shadow-xl shadow-black/20">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black text-[#20C4E8]">
                Transaksi Terbaru
              </p>
              <h2 className="mt-2 text-2xl font-black">
                Order yang perlu dipantau
              </h2>
            </div>
            <Link
              href="/admin/transaksi"
              className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-2 text-xs font-black text-white/70 transition hover:bg-white/8 hover:text-white"
            >
              Lihat semua
              <HiArrowTopRightOnSquare className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {snapshot.orders.slice(0, 4).map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-white/10 bg-[#08111F]/65 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-black">{order.customerName}</p>
                    <p className="mt-1 text-xs font-semibold text-white/48">
                      {order.serviceName}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#20C4E8]/12 px-3 py-1 text-xs font-black text-[#67E8F9]">
                    {order.status.replace("_", " ")}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-4 text-xs font-bold text-white/45">
                  <span>{order.orderCode}</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ActivityPoint = {
  label: string;
  leads: number;
  orders: number;
  revenue: number;
};

export type ContentPoint = {
  label: string;
  value: number;
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    color?: string;
    name?: string;
    value?: number;
    dataKey?: string;
  }>;
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-xl shadow-black/10">
      <p className="mb-1 font-black text-slate-900">{label}</p>
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={item.dataKey} className="flex items-center justify-between gap-5">
            <span className="font-semibold text-slate-500" style={{ color: item.color }}>
              {item.name}
            </span>
            <span className="font-black text-slate-900">
              {item.dataKey === "revenue"
                ? `Rp${formatMoney(item.value ?? 0)}`
                : item.value ?? 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardCharts({
  activity,
  content,
}: {
  activity: ActivityPoint[];
  content: ContentPoint[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/20">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black text-[#20C4E8]">Analitik</p>
          <h2 className="mt-1 text-2xl font-black">Aktivitas website</h2>
        </div>
        <span className="w-fit rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-black text-white/58">
          7 hari terakhir
        </span>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="min-w-0 rounded-2xl border border-white/10 bg-[#08111F]/45 p-4">
          <div className="h-64 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activity} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="leadsGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#20C4E8" stopOpacity={0.34} />
                  <stop offset="100%" stopColor="#20C4E8" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="ordersGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity={0.26} />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700 }}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.42)", fontSize: 12, fontWeight: 700 }}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.18)" }} />
              <Area
                type="monotone"
                dataKey="leads"
                name="Leads"
                stroke="#20C4E8"
                strokeWidth={3}
                fill="url(#leadsGradient)"
                activeDot={{ r: 5 }}
              />
              <Area
                type="monotone"
                dataKey="orders"
                name="Order"
                stroke="#22C55E"
                strokeWidth={3}
                fill="url(#ordersGradient)"
                activeDot={{ r: 5 }}
              />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-white/10 bg-[#08111F]/45 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-black text-white">Total Konten</p>
            <p className="text-xs font-bold text-white/45">
              {content.reduce((total, item) => total + item.value, 0)} item
            </p>
          </div>
          <div className="h-56 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={content} layout="vertical" margin={{ left: 8, right: 12, top: 4, bottom: 4 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.07)" horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.38)", fontSize: 12, fontWeight: 700 }}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={76}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.58)", fontSize: 12, fontWeight: 800 }}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Bar dataKey="value" name="Data" fill="#20C4E8" radius={[0, 8, 8, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

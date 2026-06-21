import { HiArrowTrendingUp } from "react-icons/hi2";

export default function AdminMetricCard({
  label,
  value,
  description,
  tone = "cyan",
}: {
  label: string;
  value: string;
  description: string;
  tone?: "cyan" | "green" | "violet" | "amber";
}) {
  const tones = {
    cyan: "from-[#08BBD8]/28 to-[#08BBD8]/4 text-[#20C4E8]",
    green: "from-[#22C55E]/28 to-[#22C55E]/4 text-[#86EFAC]",
    violet: "from-[#A78BFA]/28 to-[#A78BFA]/4 text-[#C4B5FD]",
    amber: "from-[#F59E0B]/28 to-[#F59E0B]/4 text-[#FCD34D]",
  };

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/15">
      <div className={`inline-flex rounded-full bg-linear-to-r px-3 py-1 text-xs font-black ${tones[tone]}`}>
        {label}
      </div>
      <div className="mt-5 flex items-end justify-between gap-4">
        <p className="text-3xl font-black leading-none text-white">{value}</p>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08] text-[#20C4E8]">
          <HiArrowTrendingUp className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-sm font-medium leading-6 text-white/58">{description}</p>
    </article>
  );
}

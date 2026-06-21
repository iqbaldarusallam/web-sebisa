import CountUpValue from "./CountUpValue";
import MotionReveal from "./MotionReveal";

const reasons = [
  {
    title: "Bergaransi & Revisi Cepat Tanggap",
    description: "Setiap project yang datang dengan garansi kepuasan penuh.",
  },
  {
    title: "Fast Response & Support Aktif",
    description: "Tim merespon cepat di setiap tahap project anda.",
  },
  {
    title: "Desain Modern & Strategi Tepat",
    description: "Dioptimasi untuk branding, campaign, dan pengalaman audiens.",
  },
];

const stats = [
  {
    value: "100+",
    label: "Project digital berhasil dikerjakan dan diluncurkan",
    wide: true,
  },
  { value: "80+", label: "Klien puas dari berbagai industri" },
  { value: "4.9/5", label: "Rating rata-rata klien" },
  { value: "91%", label: "Repeat order dari klien lama" },
  { value: "24/7", label: "Fast response & Support" },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-12 text-[#333333] md:py-14">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-8 lg:grid-cols-[1.25fr_0.95fr] lg:px-20">
        <MotionReveal className="min-w-0">
          <span className="inline-flex rounded-md bg-[#12345A] px-3 py-1.5 text-[0.65rem] font-extrabold uppercase leading-none text-white">
            Mengapa Memilih Kami
          </span>

          <h2 className="mt-5 max-w-136 text-[1.45rem] font-extrabold leading-[1.08] text-[#3a3a3a] sm:text-[1.75rem] md:text-[2rem]">
            Kami bukan sekadar vendor.
            <span className="block">
              <span className="text-[#153A66]">kami mitra</span> Anda
            </span>
          </h2>

          <div className="mt-5 space-y-4">
            {reasons.map((reason, index) => (
              <article key={reason.title} className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#12345A] text-[1.25rem] font-extrabold leading-none text-white sm:h-12 sm:w-12 sm:text-[1.45rem]">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold leading-tight text-[#3a3a3a] sm:text-base">
                    {reason.title}
                  </h3>
                  <p className="mt-0.5 text-[0.7rem] font-semibold leading-snug text-[#153A66] sm:text-xs">
                    {reason.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </MotionReveal>

        <MotionReveal delay={0.1} className="min-w-0">
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {stats.map((stat) => (
              <article
                key={stat.label}
                className={`flex min-h-16 flex-col items-center justify-center rounded-lg border-2 border-[#85E9FF] px-2 py-3 text-center shadow-sm sm:min-h-20 sm:px-3 sm:py-4 ${
                  stat.wide ? "col-span-2 bg-[#12345A]" : "bg-[#0B1722]"
                }`}
              >
                <p className="text-[1.2rem] font-extrabold leading-none text-white sm:text-[1.55rem] md:text-[1.9rem]">
                  <CountUpValue value={stat.value} accentClassName="text-[#09C4E8]" />
                </p>
                <p
                  className={`mt-1.5 text-[0.55rem] font-medium leading-snug sm:mt-2 sm:text-[0.62rem] ${
                    stat.wide ? "text-slate-300" : "text-slate-400"
                  }`}
                >
                  {stat.label}
                </p>
              </article>
            ))}
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}

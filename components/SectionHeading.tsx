type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
};

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "left",
  dark = false,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`max-w-3xl ${alignment}`}>
      <span
        className={`inline-flex rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase sm:text-xs ${
          dark ? "bg-white/10 text-cyan-100" : "bg-[#141D38] text-white"
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`mt-3 text-[1.75rem] font-black leading-tight sm:mt-4 sm:text-3xl md:text-5xl ${
          dark ? "text-white" : "text-[#0F172A]"
        }`}
      >
        {title}
        {highlight ? <span className="text-[#06B6D4]"> {highlight}</span> : null}
      </h2>
      {description ? (
        <p className={`mt-3 text-sm leading-6 sm:mt-4 sm:text-base sm:leading-7 ${dark ? "text-slate-300" : "text-slate-600"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

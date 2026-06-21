import { clientLogos, type ClientLogo } from "@/data/clientLogos";
import Image from "next/image";

export default function ClientLogos({ items = clientLogos }: { items?: ClientLogo[] }) {
  const logos = [...items, ...items];

  return (
    <section className="overflow-hidden bg-[#CFE6F2] py-6" aria-label="Client Sebisa Project">
      <p className="text-center text-sm font-extrabold text-[#12345A] md:text-base">
        Dipercaya Oleh 100+ Client Dari Berbagai Industri
      </p>
      <div className="mt-5 flex marquee-track gap-4">
        {logos.map((logo, index) => (
          <div
            key={`${logo.name}-${index}`}
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-white/90 bg-white p-3 text-center text-[0.62rem] font-extrabold leading-tight text-[#12345A] shadow-lg shadow-sky-950/10 ring-1 ring-[#12345A]/8 sm:h-24 sm:w-24 sm:text-xs"
          >
            {logo.logoUrl ? (
              <Image
                src={logo.logoUrl}
                alt={`${logo.name} logo`}
                width={72}
                height={72}
                className="max-h-14 w-auto max-w-14 object-contain sm:max-h-16 sm:max-w-16"
              />
            ) : (
              <span className="line-clamp-2">{logo.name}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

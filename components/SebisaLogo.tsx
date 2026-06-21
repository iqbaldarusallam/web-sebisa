import Image from "next/image";

type SebisaLogoProps = {
  className?: string;
  markOnly?: boolean;
  priority?: boolean;
};

export default function SebisaLogo({
  className = "",
  markOnly = false,
  priority = false,
}: SebisaLogoProps) {
  return (
    <div
      className={`relative block shrink-0 overflow-hidden ${
        markOnly ? "h-18 w-18 sm:h-24 sm:w-24" : "h-14 w-24 sm:h-20 sm:w-32 md:h-24 md:w-36"
      } ${className}`}
      aria-label="Sebisa Project"
    >
      <Image
        src="/logo-sebisa.png"
        alt="Sebisa Project"
        fill
        priority={priority}
        sizes={markOnly ? "96px" : "(min-width: 768px) 144px, 128px"}
        className="object-contain object-center"
      />
    </div>
  );
}

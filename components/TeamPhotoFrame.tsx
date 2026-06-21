"use client";

import Image from "next/image";

export default function TeamPhotoFrame({
  alt,
  src,
}: {
  alt: string;
  src: string;
}) {
  return (
    <div className="relative mx-auto aspect-[2/3] w-full max-w-[18.5rem] overflow-hidden rounded-xl bg-[#E6F7FF]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 90vw"
        className="object-cover object-top transition duration-300 group-hover:scale-[1.015]"
      />
    </div>
  );
}

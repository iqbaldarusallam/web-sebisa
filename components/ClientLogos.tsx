"use client";

import { useRef, useEffect } from "react";
import { clientLogos, type ClientLogo } from "@/data/clientLogos";
import Image from "next/image";

export default function ClientLogos({ items = clientLogos }: { items?: ClientLogo[] }) {
  const logos = [...items, ...items];
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    let isDragging = false;
    let isHovered = false;
    let startX = 0;
    let position = 0;
    let animationFrameId: number;
    const speed = 0.5; // pixels per frame

    const animate = () => {
      if (!isDragging && !isHovered) {
        position -= speed;
        // Reset position to create infinite loop effect
        if (position <= -track.scrollWidth / 2) {
          position += track.scrollWidth / 2;
        }
      }
      track.style.transform = `translateX(${position}px)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Mouse events on wrapper for hover detection
    const handleWrapperMouseEnter = () => {
      isHovered = true;
      wrapper.style.cursor = "grab";
    };

    const handleWrapperMouseLeave = () => {
      isHovered = false;
      isDragging = false;
      wrapper.style.cursor = "grab";
    };

    // Drag events on track
    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.pageX;
      wrapper.style.cursor = "grabbing";
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX;
      const walk = x - startX;
      position += walk;
      startX = x;
    };

    const handleMouseUp = () => {
      isDragging = false;
      wrapper.style.cursor = "grab";
    };

    // Touch support on track
    const handleTouchStart = (e: TouchEvent) => {
      isDragging = true;
      startX = e.touches[0].pageX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX;
      const walk = x - startX;
      position += walk;
      startX = x;
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    // Wrapper hover
    wrapper.addEventListener("mouseenter", handleWrapperMouseEnter);
    wrapper.addEventListener("mouseleave", handleWrapperMouseLeave);

    // Track drag
    track.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    track.addEventListener("touchstart", handleTouchStart, { passive: true });
    track.addEventListener("touchmove", handleTouchMove, { passive: true });
    track.addEventListener("touchend", handleTouchEnd);

    return () => {
      cancelAnimationFrame(animationFrameId);
      wrapper.removeEventListener("mouseenter", handleWrapperMouseEnter);
      wrapper.removeEventListener("mouseleave", handleWrapperMouseLeave);
      track.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      track.removeEventListener("touchstart", handleTouchStart);
      track.removeEventListener("touchmove", handleTouchMove);
      track.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <section className="overflow-hidden bg-[#CFE6F2] py-6" aria-label="Client Sebisa Project">
      <p className="text-center text-sm font-extrabold text-[#12345A] md:text-base">
        Dipercaya Oleh 100+ Client Dari Berbagai Industri
      </p>
      <div ref={wrapperRef} className="mt-5 marquee-track-wrapper" style={{ cursor: "grab" }}>
        <div ref={trackRef} className="flex marquee-track gap-4">
          {logos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-white/90 bg-white p-3 text-center text-[0.62rem] font-extrabold leading-tight text-[#12345A] shadow-lg shadow-sky-950/10 ring-1 ring-[#12345A]/8 sm:h-24 sm:w-24 sm:text-xs select-none"
            >
              {logo.logoUrl ? (
                <Image
                  src={logo.logoUrl}
                  alt={`${logo.name} logo`}
                  width={72}
                  height={72}
                  className="h-auto max-h-14 w-auto max-w-14 object-contain sm:max-h-16 sm:max-w-16 pointer-events-none"
                />
              ) : (
                <span className="line-clamp-2 pointer-events-none">{logo.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

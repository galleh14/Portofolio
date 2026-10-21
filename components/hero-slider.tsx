"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { HeroSlide } from "@/lib/slide-types";

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || slides.length < 2) return;
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % slides.length), 4000);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, slides.length]);

  function move(direction: number) {
    setActiveIndex((index) => (index + direction + slides.length) % slides.length);
  }

  function handleTouchStart(event: React.TouchEvent) {
    touchStart.current = event.touches[0]?.clientX ?? null;
    setPaused(true);
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStart.current !== null) {
      const distance = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
      if (Math.abs(distance) > 45) move(distance < 0 ? 1 : -1);
    }
    touchStart.current = null;
    setPaused(false);
  }

  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28" aria-label="Featured slides" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--dark)] sm:aspect-video">
        {slides.map((slide, index) => {
          const content = <div className={`absolute inset-0 transition-opacity duration-700 ${index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={index !== activeIndex}><Image src={slide.image_url} alt={slide.caption || "Featured work"} fill priority={index === 0} loading={index === 0 ? undefined : "lazy"} sizes="(max-width: 640px) 100vw, 1152px" className="object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-5 pt-20 sm:p-8 sm:pt-28">{slide.caption && <p className="text-sm font-semibold text-white sm:text-base">{slide.caption}</p>}</div></div>;
          return slide.link_url ? <a key={slide.id} href={slide.link_url} target="_blank" rel="noopener noreferrer" className="absolute inset-0" tabIndex={index === activeIndex ? 0 : -1}>{content}</a> : <div key={slide.id} className="absolute inset-0">{content}</div>;
        })}
        {slides.length > 1 && <><button type="button" onClick={() => move(-1)} aria-label="Previous slide" className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-xl text-white backdrop-blur transition hover:bg-black/60">←</button><button type="button" onClick={() => move(1)} aria-label="Next slide" className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-xl text-white backdrop-blur transition hover:bg-black/60">→</button><div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">{slides.map((slide, index) => <button key={slide.id} type="button" onClick={() => setActiveIndex(index)} aria-label={`Go to slide ${index + 1}`} aria-current={index === activeIndex} className={`h-2 rounded-full transition-all ${index === activeIndex ? "w-6 bg-white" : "w-2 bg-white/50"}`} />)}</div></>}
      </div>
    </section>
  );
}

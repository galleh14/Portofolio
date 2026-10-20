"use client";

import Image from "next/image";
import type { Testimonial } from "@/lib/testimonial-types";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;
  return <section className="bg-[var(--dark)] px-5 py-20 text-white sm:px-8 sm:py-28"><div className="mx-auto max-w-6xl"><p className="eyebrow text-[#d8ff62]">Testimonials</p><div className="mt-8 grid snap-x auto-cols-[88%] grid-flow-col gap-5 overflow-x-auto pb-3 md:grid-flow-row md:grid-cols-3 md:overflow-visible">{testimonials.slice(0, 3).map((item) => <article key={item.id} className="snap-start rounded-2xl border border-white/15 bg-white/5 p-6 sm:p-8"><p className="text-lg leading-8 text-white/85">“{item.quote}”</p><div className="mt-8 flex items-center gap-3">{item.photo_url ? <Image src={item.photo_url} alt={item.name} width={48} height={48} className="h-12 w-12 rounded-full object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d8ff62] font-bold text-[var(--dark)]">{item.name.charAt(0).toUpperCase()}</div>}<div><p className="font-semibold">{item.name}</p>{(item.position || item.organization) && <p className="text-sm text-white/60">{[item.position, item.organization].filter(Boolean).join(" · ")}</p>}</div></div></article>)}</div></div></section>;
}

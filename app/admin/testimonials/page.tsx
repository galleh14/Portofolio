import Link from "next/link";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";
import { getAllTestimonials } from "@/lib/testimonials";

export const metadata = { title: "Testimonials" };
export const instant = false;

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonials();
  return <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24"><div className="flex items-end justify-between gap-4 border-b border-[var(--line)] pb-8"><div><p className="eyebrow">Admin workspace</p><h1 className="display-font mt-3 text-5xl font-bold">Testimonials.</h1></div><Link href="/admin/dashboard" className="text-sm text-[var(--muted)]">← Dashboard</Link></div><div className="mt-8"><TestimonialsManager testimonials={testimonials} /></div></div>;
}

import Link from "next/link";
import { SlidesManager } from "@/components/admin/slides-manager";
import { getAllSlides } from "@/lib/slides";

export const metadata = { title: "Slides" };
export const instant = false;

export default async function AdminSlidesPage() {
  const slides = await getAllSlides();
  return <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24"><div className="flex items-end justify-between gap-4 border-b border-[var(--line)] pb-8"><div><p className="eyebrow">Admin workspace</p><h1 className="display-font mt-3 text-5xl font-bold">Slides.</h1></div><Link href="/admin/dashboard" className="text-sm text-[var(--muted)]">← Dashboard</Link></div><div className="mt-8"><SlidesManager slides={slides} /></div></div>;
}

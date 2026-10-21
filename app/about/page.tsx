import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { getResumeItems } from "@/lib/resume";
import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return createPageMetadata(settings, "About", settings.about_body);
}

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const resumeItems = await getResumeItems();
  const highlights = resumeItems.filter((item) => item.category === "skill" || item.category === "achievement").slice(0, 3);
  return (
    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <p className="eyebrow">{settings.about_label}</p>
      <h1 className="display-font mt-5 max-w-4xl whitespace-pre-line text-6xl font-bold leading-[0.9] sm:text-8xl">{settings.about_heading}</h1>
      <div className="mt-16 grid gap-12 border-t border-[var(--line)] pt-10 md:grid-cols-[0.7fr_1.3fr]">
        <p className="eyebrow">{settings.about_label}</p>
        <p className="max-w-2xl whitespace-pre-line text-lg leading-8 text-[var(--muted)]">{settings.about_body}</p>
      </div>
      <div className="mt-20 border-t border-[var(--line)] pt-10"><p className="eyebrow">{settings.role_title} · {settings.location}</p></div>
      {highlights.length > 0 && <div className="mt-16 border-t border-[var(--line)] pt-10"><p className="eyebrow">Highlights</p><div className="mt-5 grid gap-4 sm:grid-cols-3">{highlights.map((item) => <div key={item.id} className="rounded-2xl bg-white p-5"><p className="font-semibold">{item.title}</p>{item.organization && <p className="mt-1 text-sm text-[var(--muted)]">{item.organization}</p>}</div>)}</div><Link href="/resume" className="mt-7 inline-block rounded-full bg-[var(--dark)] px-6 py-3 text-sm font-semibold text-white">View full resume ↗</Link></div>}
      <Link href="/contact" className="mt-16 inline-block rounded-full bg-[var(--dark)] px-6 py-3 text-sm font-semibold text-white">Let&apos;s work together ↗</Link>
    </div>
  );
}

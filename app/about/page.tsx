import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = { title: "About" };
export const instant = false;

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <p className="eyebrow">{settings.about_label}</p>
      <h1 className="display-font mt-5 max-w-4xl whitespace-pre-line text-6xl font-bold leading-[0.9] sm:text-8xl">{settings.about_heading}</h1>
      <div className="mt-16 grid gap-12 border-t border-[var(--line)] pt-10 md:grid-cols-[0.7fr_1.3fr]">
        <p className="eyebrow">{settings.about_label}</p>
        <p className="max-w-2xl whitespace-pre-line text-lg leading-8 text-[var(--muted)]">{settings.about_body}</p>
      </div>
      <div className="mt-20 border-t border-[var(--line)] pt-10"><p className="eyebrow">{settings.role_title} · {settings.location}</p></div>
      <Link href="/contact" className="mt-16 inline-block rounded-full bg-[var(--dark)] px-6 py-3 text-sm font-semibold text-white">Let&apos;s work together ↗</Link>
    </div>
  );
}

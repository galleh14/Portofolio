import Link from "next/link";
import { socialLinks } from "@/lib/dummy-data";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--dark)] px-5 py-12 text-white sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-10 border-b border-white/15 pb-12 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-white/50">Have a good idea?</p>
            <h2 className="display-font mt-3 max-w-lg text-4xl font-bold leading-[0.95] sm:text-6xl">Let&apos;s make it real.</h2>
          </div>
          <Link href="/contact" className="w-fit rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-bold text-[var(--dark)] transition hover:bg-white">
            Start a conversation <span className="ml-1">↗</span>
          </Link>
        </div>
        <div className="flex flex-col justify-between gap-6 pt-7 text-sm text-white/55 sm:flex-row">
          <p>© 2024 Raka Aditya. Built with intention.</p>
          <div className="flex gap-5">
            {socialLinks.map((social) => <a key={social.label} href={social.href} className="transition hover:text-white">{social.label}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}

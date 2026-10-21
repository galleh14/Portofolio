import Link from "next/link";
import type { SiteSettings } from "@/lib/site-settings";
import { SocialLinks } from "@/components/social-links";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-[var(--dark)] px-5 py-12 text-white sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-10 border-b border-white/15 pb-12 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-white/50">Have a good idea?</p>
            <h2 className="display-font mt-3 max-w-lg text-4xl font-bold leading-[0.95] sm:text-6xl">Let&apos;s make it real.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="w-fit rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-bold text-[var(--dark)] transition hover:bg-white">Start a conversation <span className="ml-1">↗</span></Link>
            <Link href="/resume" className="w-fit rounded-full border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[var(--dark)]">Resume <span className="ml-1">↗</span></Link>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-6 pt-7 text-sm text-white/55 sm:flex-row">
          <p>{settings.footer_text}</p>
          <SocialLinks settings={settings} />
        </div>
      </div>
    </footer>
  );
}

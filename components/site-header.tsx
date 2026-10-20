"use client";

import Link from "next/link";
import { useState } from "react";
import type { SiteSettings } from "@/lib/site-settings";
import { AvailabilityBadge } from "@/components/availability-badge";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-20 border-b border-[var(--line)] bg-[var(--background)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="display-font text-xl font-bold tracking-tight" onClick={() => setOpen(false)}>
          {settings.site_name}<span className="text-[#829e52]">.</span>
        </Link>
        <div className="hidden lg:block"><AvailabilityBadge settings={settings} /></div>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigasi utama">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]">
              {link.label}
            </Link>
          ))}
          {settings.cv_url && <a href={settings.cv_url} target="_blank" rel="noopener noreferrer" download className="text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)]">Download CV</a>}
        </nav>
        <Link href="/contact" className="hidden rounded-full bg-[var(--dark)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#35443a] sm:block">
          Contact <span className="ml-1">↗</span>
        </Link>
        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          className="rounded-full border border-[var(--line)] p-2.5 md:hidden"
          onClick={() => setOpen(!open)}
        >
          <span className="block h-px w-5 bg-[var(--foreground)]" />
          <span className="mt-1.5 block h-px w-5 bg-[var(--foreground)]" />
        </button>
      </div>
      {open && (
        <nav className="border-t border-[var(--line)] px-5 py-4 md:hidden" aria-label="Navigasi mobile">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block border-b border-[var(--line)] py-3 text-sm last:border-0">
              {link.label}
            </Link>
          ))}
          {settings.cv_url && <a href={settings.cv_url} target="_blank" rel="noopener noreferrer" download onClick={() => setOpen(false)} className="block border-b border-[var(--line)] py-3 text-sm font-semibold last:border-0">Download CV ↗</a>}
        </nav>
      )}
    </header>
  );
}

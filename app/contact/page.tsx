import { ContactForm } from "@/components/contact-form";
import { socialLinks } from "@/lib/dummy-data";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.8fr_1.2fr]">
      <div><p className="eyebrow">Contact</p><h1 className="display-font mt-4 text-6xl font-bold leading-[0.9] sm:text-8xl">Let&apos;s make something <span className="text-[#829e52]">useful.</span></h1><p className="mt-8 max-w-sm leading-7 text-[var(--muted)]">Ceritakan sedikit tentang tantangan atau ide yang sedang kamu kerjakan. Saya akan membalas secepatnya.</p><div className="mt-10 space-y-3 text-sm text-[var(--muted)]"><p>hello@rakaaditya.com</p><p>Jakarta, Indonesia · GMT+7</p></div><div className="mt-7 flex gap-5 text-sm font-semibold">{socialLinks.map((social) => <a key={social.label} href={social.href} className="hover:text-[#829e52]">{social.label}</a>)}</div></div>
      <div className="rounded-2xl bg-white p-6 sm:p-10"><ContactForm /></div>
    </div>
  );
}

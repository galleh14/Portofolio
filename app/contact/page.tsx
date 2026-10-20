import { ContactForm } from "@/components/contact-form";
import { getSiteSettings } from "@/lib/site-settings";
import { SocialLinks } from "@/components/social-links";

export const metadata = { title: "Contact" };

export const instant = false;

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.8fr_1.2fr]">
      <div><p className="eyebrow">{settings.role_title}</p><h1 className="display-font mt-4 text-6xl font-bold leading-[0.9] sm:text-8xl">{settings.about_heading}</h1><p className="mt-8 max-w-sm whitespace-pre-line leading-7 text-[var(--muted)]">{settings.hero_subheading}</p><div className="mt-10 space-y-3 text-sm text-[var(--muted)]"><p><a href={`mailto:${settings.email}`} target="_blank" rel="noopener noreferrer">{settings.email}</a></p><p>{settings.location}</p></div><div className="mt-7"><SocialLinks settings={settings} /></div></div>
      <div className="rounded-2xl bg-white p-6 sm:p-10"><ContactForm /></div>
    </div>
  );
}

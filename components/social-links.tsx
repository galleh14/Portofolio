import type { SiteSettings } from "@/lib/site-settings";

function ExternalLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="transition hover:text-[#829e52]">
      {children}
    </a>
  );
}

function Icon({ name }: { name: "linkedin" | "instagram" | "github" | "mail" | "whatsapp" | "cv" }) {
  const paths = {
    linkedin: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 11v5M8 8v.01M12 16v-5m0 0a3 3 0 0 1 3-3 3 3 0 0 1 3 3v5" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>,
    github: <><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.3 4 5 5 0 0 0 19.2.5S18 .1 15 2a13.4 13.4 0 0 0-6 0C6 0 4.8.5 4.8.5A5 5 0 0 0 4.7 4 5.4 5.4 0 0 0 3.2 7.5c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 9 18v4" /><path d="M9 18c-4.5 2-5-2-7-2" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    whatsapp: <><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z" /><path d="M8.5 8.5c.3-.5.6-.5.9-.5l.7 1.7c.1.3.1.5-.1.7l-.5.6c.7 1.2 1.7 2.1 3 2.7l.5-.5c.2-.2.4-.2.7-.1l1.7.8c.3.1.3.4.2.7-.3 1-1.1 1.4-2 1.3-3.4-.4-6.1-3.1-6.5-6.5-.1-.8.3-1.6 1.4-1.9Z" /></>,
    cv: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
  };

  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">{paths[name]}</svg>;
}

export function SocialLinks({ settings }: { settings: SiteSettings }) {
  const whatsapp = settings.whatsapp?.replace(/[^\d+]/g, "").replace(/^\+/, "");
  return (
    <div className="flex items-center gap-5 text-sm font-semibold">
      {settings.linkedin_url && <ExternalLink href={settings.linkedin_url} label="LinkedIn"><Icon name="linkedin" /></ExternalLink>}
      {settings.instagram_url && <ExternalLink href={settings.instagram_url} label="Instagram"><Icon name="instagram" /></ExternalLink>}
      {settings.github_url && <ExternalLink href={settings.github_url} label="GitHub"><Icon name="github" /></ExternalLink>}
      {settings.email && <ExternalLink href={`mailto:${settings.email}`} label={`Email ${settings.email}`}><Icon name="mail" /></ExternalLink>}
      {whatsapp && <ExternalLink href={`https://wa.me/${whatsapp}`} label="WhatsApp"><Icon name="whatsapp" /></ExternalLink>}
      {settings.cv_url && <ExternalLink href={settings.cv_url} label="Download CV"><Icon name="cv" /></ExternalLink>}
    </div>
  );
}

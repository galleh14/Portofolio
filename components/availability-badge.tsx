import type { SiteSettings } from "@/lib/site-settings";

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

export function AvailabilityBadge({ settings, compact = false }: { settings: SiteSettings; compact?: boolean }) {
  if (settings.availability_status === "closed") return null;
  const isOpen = settings.availability_status === "open";
  const details = [settings.available_from ? `Available ${formatDate(settings.available_from)}` : null, settings.location_preference].filter(Boolean).join(" · ");
  return <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${isOpen ? "bg-[#eff9d7] text-[#627a34]" : "bg-[#fff3c4] text-[#8b6b00]"}`}><span className={`h-2 w-2 rounded-full ${isOpen ? "bg-[#829e52]" : "bg-[#d1a500]"}`} />{isOpen ? "Open to work" : "Limited"}{!compact && details && <span className="font-normal opacity-80">· {details}</span>}</span>;
}

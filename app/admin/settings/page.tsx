import Link from "next/link";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = { title: "Settings Situs" };
export const instant = false;

export default async function SettingsPage() {
  const settings = await getSiteSettings();
  return <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24"><div className="flex items-end justify-between gap-4 border-b border-[var(--line)] pb-8"><div><p className="eyebrow">Admin workspace</p><h1 className="display-font mt-3 text-5xl font-bold">Settings.</h1></div><Link href="/admin/dashboard" className="text-sm text-[var(--muted)]">← Dashboard</Link></div><div className="mt-8"><SettingsForm settings={settings} /></div></div>;
}

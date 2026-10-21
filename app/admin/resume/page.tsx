import Link from "next/link";
import { ResumeManager } from "@/components/admin/resume-manager";
import { getResumeItems } from "@/lib/resume";

export const metadata = { title: "Resume" };
export const instant = false;

export default async function AdminResumePage() {
  const items = await getResumeItems(false);
  return <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24"><div className="flex items-end justify-between gap-4 border-b border-[var(--line)] pb-8"><div><p className="eyebrow">Admin workspace</p><h1 className="display-font mt-3 text-5xl font-bold">Resume.</h1></div><Link href="/admin/dashboard" className="text-sm text-[var(--muted)]">← Dashboard</Link></div><div className="mt-8"><ResumeManager items={items} /></div></div>;
}

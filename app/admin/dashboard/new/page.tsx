import Link from "next/link";
import { ProjectForm } from "@/components/admin/project-form";

export const metadata = { title: "New Project" };

export default function NewProjectPage() {
  return <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24"><Link href="/admin/dashboard" className="text-sm text-[var(--muted)]">← Dashboard</Link><h1 className="display-font mt-8 text-5xl font-bold">New project.</h1><div className="mt-8"><ProjectForm /></div></div>;
}

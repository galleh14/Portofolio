import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Edit Project" };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
  if (error || !data) notFound();

  const project = {
    ...data,
    stack: data.tech_stack ?? [],
    accent: "green" as const,
    category: "",
    year: "",
    longDescription: data.description,
    result: "",
    role: "",
    imageLabel: "",
    demoUrl: data.demo_url ?? "",
    repoUrl: data.repo_url ?? "",
  };

  return <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24"><Link href="/admin/dashboard" className="text-sm text-[var(--muted)]">← Dashboard</Link><h1 className="display-font mt-8 text-5xl font-bold">Edit project.</h1><div className="mt-8"><ProjectForm project={project} /></div></div>;
}

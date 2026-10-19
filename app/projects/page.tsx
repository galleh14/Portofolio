import { ProjectCard } from "@/components/project-card";
import { mapSupabaseProject, type SupabaseProject } from "@/lib/dummy-data";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Projects" };
export const instant = false;

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("title,slug,description,tech_stack,image_url,demo_url,repo_url,featured,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Gagal memuat project: ${error.message}`);
  }

  const projects = (data as SupabaseProject[]).map(mapSupabaseProject);

  return (
    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <p className="eyebrow">Selected projects</p>
      <div className="mt-5 flex flex-col justify-between gap-6 border-b border-[var(--line)] pb-12 md:flex-row md:items-end"><h1 className="display-font max-w-3xl text-6xl font-bold leading-[0.9] sm:text-8xl">Work that makes a difference.</h1><p className="max-w-xs text-sm leading-6 text-[var(--muted)]">Eksplorasi beberapa produk dan identitas yang saya bantu bangun bersama klien dan tim.</p></div>
      {projects.length === 0 ? <p className="pt-12 text-[var(--muted)]">Belum ada project yang dipublikasikan.</p> : <div className="grid gap-x-8 gap-y-16 pt-12 md:grid-cols-2">{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>}
    </div>
  );
}

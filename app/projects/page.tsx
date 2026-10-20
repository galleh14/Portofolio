import { ProjectFilters } from "@/components/project-filters";
import { mapSupabaseProject, type SupabaseProject } from "@/lib/dummy-data";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/site-settings";
import { getProjectImageMap } from "@/lib/project-images";

export const metadata = { title: "Projects" };
export const instant = false;

export default async function ProjectsPage() {
  const settings = await getSiteSettings();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id,title,slug,description,tech_stack,image_url,demo_url,repo_url,doc_url,doc_name,featured,created_at,role,duration,study_area,domain,data_type,methods,software,objective,workflow,result,conclusion")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Gagal memuat project: ${error.message}`);
  }

  const rows = (data ?? []) as (SupabaseProject & { id: string })[];
  const imageMap = await getProjectImageMap(rows.map((project) => project.id));
  const projects = rows.map((project) => ({
    ...mapSupabaseProject(project),
    galleryImages: imageMap.get(project.id) ?? [],
  }));

  return (
    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <p className="eyebrow">{settings.about_label}</p>
      <div className="mt-5 flex flex-col justify-between gap-6 border-b border-[var(--line)] pb-12 md:flex-row md:items-end"><h1 className="display-font max-w-3xl whitespace-pre-line text-6xl font-bold leading-[0.9] sm:text-8xl">{settings.hero_heading}</h1><p className="max-w-xs whitespace-pre-line text-sm leading-6 text-[var(--muted)]">{settings.hero_subheading}</p></div>
      {projects.length === 0 ? <p className="pt-12 text-[var(--muted)]">Belum ada project yang dipublikasikan.</p> : <ProjectFilters projects={projects} />}
    </div>
  );
}

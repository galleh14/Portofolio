import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/project-card";
import { mapSupabaseProject, type SupabaseProject } from "@/lib/dummy-data";
import { createClient } from "@/lib/supabase/server";
import { getProjectImages } from "@/lib/project-images";
import { ProjectLightbox } from "@/components/project-lightbox";

export const instant = false;

async function getProject(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id,title,slug,description,tech_stack,image_url,demo_url,repo_url,doc_url,doc_name,featured,created_at,role,duration,study_area,domain,data_type,methods,software,objective,workflow,result,conclusion")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") notFound();
    throw new Error(`Gagal memuat project: ${error.message}`);
  }

  return { ...mapSupabaseProject(data as SupabaseProject), id: data.id, gallery: await getProjectImages(data.id) };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  return { title: project.title };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  const supabase = await createClient();
  const { data: nextData } = await supabase
    .from("projects")
    .select("title,slug,description,tech_stack,image_url,demo_url,repo_url,doc_url,doc_name,featured,created_at,role,duration,study_area,domain,data_type,methods,software,objective,workflow,result,conclusion")
    .neq("slug", project.slug)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextProject = nextData ? mapSupabaseProject(nextData as SupabaseProject) : null;

  return (
    <article>
      <div className="mx-auto max-w-6xl px-5 pt-16 sm:px-8 sm:pt-24"><Link href="/projects" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">← All projects</Link><div className="mt-12 flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="eyebrow">{project.domain ?? "Project"}</p><h1 className="display-font mt-4 text-6xl font-bold leading-[0.9] sm:text-8xl">{project.title}</h1></div><p className="max-w-xs text-sm leading-6 text-[var(--muted)]">{project.description}</p></div><div className="mt-8 flex flex-wrap gap-3 text-sm text-[var(--muted)]">{[project.studyArea, project.role, project.duration].filter(Boolean).map((item) => <span key={item} className="rounded-full border border-[var(--line)] px-3 py-1.5">{item}</span>)}</div></div>
      <div className="project-art mx-auto mt-16 flex aspect-[2/1] max-w-6xl items-end rounded-2xl p-6 sm:p-12"><span className="text-sm font-semibold tracking-[0.18em] text-white/80">{project.imageLabel}</span></div>
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        {(project.methods.length > 0 || project.software.length > 0) && <div className="mb-16 flex flex-wrap gap-2">{[...project.methods, ...project.software].map((item) => <span key={item} className="rounded-full border border-[var(--line)] px-3 py-1.5 text-sm">{item}</span>)}</div>}
        {project.objective && <section className="mb-16"><p className="eyebrow">Objective</p><p className="mt-5 max-w-3xl whitespace-pre-line text-2xl leading-relaxed">{project.objective}</p></section>}
        {(project.dataType || project.workflow) && <section className="mb-16"><p className="eyebrow">Data & Workflow</p>{project.dataType && <p className="mt-5 font-semibold">{project.dataType}</p>}{project.workflow && <p className="mt-4 max-w-3xl whitespace-pre-line leading-7 text-[var(--muted)]">{project.workflow}</p>}</section>}
        {project.result && <section className="mb-16"><p className="eyebrow">Results</p><p className="mt-5 max-w-3xl whitespace-pre-line leading-7 text-[var(--muted)]">{project.result}</p></section>}
        {project.gallery.length > 0 && <section className="mb-16"><p className="eyebrow">Gallery</p><ProjectLightbox images={project.gallery} /></section>}
        {project.conclusion && <section className="mb-16"><p className="eyebrow">Conclusion</p><p className="mt-5 max-w-3xl whitespace-pre-line text-2xl leading-relaxed">{project.conclusion}</p></section>}
        <div className="flex flex-wrap gap-4 text-sm font-bold">{project.demoUrl !== "#" && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">Demo ↗</a>}{project.repoUrl !== "#" && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">Repo ↗</a>}{project.docUrl && <a href={project.docUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[var(--dark)] px-5 py-3 text-white">Lihat Dokumen{project.docName ? ` · ${project.docName}` : ""} ↗</a>}</div>
      </div>
      {nextProject && <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28"><p className="eyebrow">Keep exploring</p><div className="mt-8 max-w-md"><ProjectCard project={nextProject} /></div></div>}
    </article>
  );
}

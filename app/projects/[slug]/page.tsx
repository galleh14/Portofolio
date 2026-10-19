import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/dummy-data";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return { title: project?.title ?? "Project" };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const artClass = project.accent === "blue" ? "project-art-alt" : project.accent === "warm" ? "project-art-warm" : "project-art";
  const nextProject = projects[(projects.indexOf(project) + 1) % projects.length];

  return (
    <article>
      <div className="mx-auto max-w-6xl px-5 pt-16 sm:px-8 sm:pt-24"><Link href="/projects" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">← All projects</Link><div className="mt-12 flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="eyebrow">{project.category}</p><h1 className="display-font mt-4 text-6xl font-bold leading-[0.9] sm:text-8xl">{project.title}</h1></div><p className="max-w-xs text-sm leading-6 text-[var(--muted)]">{project.description}</p></div></div>
      <div className={`mx-auto mt-16 flex aspect-[2/1] max-w-6xl items-end rounded-2xl p-6 sm:p-12 ${artClass}`}><span className="text-sm font-semibold tracking-[0.18em] text-white/80">{project.imageLabel}</span></div>
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-24 md:grid-cols-[0.8fr_1.2fr]"><div className="grid grid-cols-2 gap-8"><div><p className="eyebrow">Role</p><p className="mt-3 text-sm">{project.role}</p></div><div><p className="eyebrow">Year</p><p className="mt-3 text-sm">{project.year}</p></div><div className="col-span-2"><p className="eyebrow">Built with</p><div className="mt-3 flex flex-wrap gap-2">{project.stack.map((item) => <span key={item} className="rounded-full border border-[var(--line)] px-3 py-1.5 text-xs">{item}</span>)}</div></div></div><div><p className="display-font text-3xl font-bold leading-tight sm:text-5xl">{project.longDescription}</p><div className="mt-10 flex gap-6 text-sm font-bold"><a href={project.demoUrl}>Live demo ↗</a><a href={project.repoUrl} className="text-[var(--muted)]">View code ↗</a></div></div></div>
      <div className="bg-white px-5 py-16 sm:px-8 sm:py-24"><div className="mx-auto max-w-6xl"><p className="eyebrow">The outcome</p><div className="mt-6 flex flex-col justify-between gap-8 md:flex-row md:items-end"><p className="display-font text-6xl font-bold sm:text-8xl">{project.result}</p><p className="max-w-sm text-sm leading-6 text-[var(--muted)]">Dampak utama setelah solusi ini diluncurkan dan mulai digunakan oleh penggunanya.</p></div></div></div>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28"><p className="eyebrow">Keep exploring</p><div className="mt-8 max-w-md"><ProjectCard project={nextProject} /></div></div>
    </article>
  );
}

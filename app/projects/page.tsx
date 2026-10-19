import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/dummy-data";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <p className="eyebrow">Selected projects</p>
      <div className="mt-5 flex flex-col justify-between gap-6 border-b border-[var(--line)] pb-12 md:flex-row md:items-end"><h1 className="display-font max-w-3xl text-6xl font-bold leading-[0.9] sm:text-8xl">Work that makes a difference.</h1><p className="max-w-xs text-sm leading-6 text-[var(--muted)]">Eksplorasi beberapa produk dan identitas yang saya bantu bangun bersama klien dan tim.</p></div>
      <div className="grid gap-x-8 gap-y-16 pt-12 md:grid-cols-2">{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
    </div>
  );
}

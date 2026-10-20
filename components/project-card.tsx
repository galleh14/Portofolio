import Link from "next/link";
import type { Project } from "@/lib/dummy-data";

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const artClass = project.accent === "blue" ? "project-art-alt" : project.accent === "warm" ? "project-art-warm" : "project-art";
  return (
    <Link href={`/projects/${project.slug}`} className={featured ? "group block" : "group block"}>
      <div className={`relative flex aspect-[1.18] items-end overflow-hidden rounded-2xl p-5 sm:p-7 ${artClass}`}>
        <div className="absolute inset-0 opacity-20 transition duration-500 group-hover:scale-105" style={{ backgroundImage: "linear-gradient(120deg, transparent 30%, rgba(255,255,255,.28) 30%, transparent 60%)" }} />
        <span className="relative z-10 text-xs font-semibold tracking-[0.15em] text-white/80">{project.imageLabel}</span>
        <span className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl text-white backdrop-blur transition group-hover:bg-[var(--accent)] group-hover:text-[var(--dark)]">↗</span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="display-font text-2xl font-bold">{project.title}</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">{project.category}</p>
          {project.methods.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{project.methods.slice(0, 3).map((method) => <span key={method} className="rounded-full border border-[var(--line)] px-2 py-1 text-[10px] text-[var(--muted)]">{method}</span>)}</div>}
        </div>
        <span className="pt-1 text-sm text-[var(--muted)]">{project.year}</span>
      </div>
    </Link>
  );
}

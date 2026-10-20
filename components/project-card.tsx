import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/dummy-data";

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const imageUrl = project.imageUrl || project.galleryImages?.[0];
  const placeholderClass = project.domain === "Oil & Gas"
    ? "bg-gradient-to-br from-[#13291d] via-[#31553c] to-[#637d61]"
    : project.domain === "Geothermal"
      ? "bg-gradient-to-br from-[#7c2d12] via-[#c65f2b] to-[#f2b27d]"
      : project.domain === "Mining"
        ? "bg-gradient-to-br from-[#3d261b] via-[#765039] to-[#b18a65]"
        : project.domain === "Hydrogeology"
          ? "bg-gradient-to-br from-[#123b5d] via-[#28739a] to-[#8cc8d8]"
          : project.domain === "Engineering Geophysics"
            ? "bg-gradient-to-br from-[#35205c] via-[#66439a] to-[#b296d2]"
            : "bg-gradient-to-br from-[#374151] via-[#6b7280] to-[#d1d5db]";

  return (
    <Link href={`/projects/${project.slug}`} className={featured ? "group block" : "group block"}>
      <div className={`relative aspect-[1.18] overflow-hidden rounded-2xl ${imageUrl ? "bg-[var(--line)]" : placeholderClass}`}>
        {imageUrl ? <Image src={imageUrl} alt={project.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" /> : <div className="absolute inset-0 opacity-20 transition duration-500 group-hover:scale-105" style={{ backgroundImage: "linear-gradient(120deg, transparent 30%, rgba(255,255,255,.28) 30%, transparent 60%)" }} />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
        <span className="relative z-10 text-xs font-semibold tracking-[0.15em] text-white/80">{project.imageLabel}</span>
        </div>
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

"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/dummy-data";
import { LazyMap } from "@/components/lazy-map";

export function ProjectFilters({ projects }: { projects: Project[] }) {
  const [domain, setDomain] = useState("all");
  const [method, setMethod] = useState("all");
  const [view, setView] = useState<"list" | "map">("list");
  const domains = [...new Set(projects.map((project) => project.domain).filter(Boolean))] as string[];
  const methods = [...new Set(projects.flatMap((project) => project.methods))];
  const filtered = useMemo(() => projects.filter((project) => (domain === "all" || project.domain === domain) && (method === "all" || project.methods.includes(method))), [domain, method, projects]);
  const mappedProjects = filtered.filter((project): project is Project & { latitude: number; longitude: number } => project.latitude != null && project.longitude != null).map((project) => ({ slug: project.slug, title: project.title, domain: project.domain, latitude: project.latitude, longitude: project.longitude }));
  return <div><div className="flex flex-col gap-3 border-b border-[var(--line)] pb-6 sm:flex-row sm:items-center"><select value={domain} onChange={(event) => setDomain(event.target.value)} className="rounded-full border border-[var(--line)] bg-transparent px-4 py-2 text-sm"><option value="all">Semua domain</option>{domains.map((item) => <option key={item}>{item}</option>)}</select><select value={method} onChange={(event) => setMethod(event.target.value)} className="rounded-full border border-[var(--line)] bg-transparent px-4 py-2 text-sm"><option value="all">Semua metode</option>{methods.map((item) => <option key={item}>{item}</option>)}</select><div className="flex rounded-full border border-[var(--line)] p-1 text-sm"><button type="button" onClick={() => setView("list")} className={`rounded-full px-3 py-1 ${view === "list" ? "bg-[var(--dark)] text-white" : ""}`}>Daftar</button><button type="button" onClick={() => setView("map")} className={`rounded-full px-3 py-1 ${view === "map" ? "bg-[var(--dark)] text-white" : ""}`}>Peta</button></div></div>{view === "map" ? <div className="pt-8">{mappedProjects.length > 0 ? <LazyMap projects={mappedProjects} /> : <p className="text-[var(--muted)]">Belum ada project dengan koordinat.</p>}</div> : filtered.length === 0 ? <p className="pt-12 text-[var(--muted)]">Tidak ada project yang sesuai filter.</p> : <div className="grid gap-x-8 gap-y-16 pt-12 md:grid-cols-2">{filtered.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>}</div>;
}

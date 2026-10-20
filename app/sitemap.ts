import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("slug,created_at").order("created_at", { ascending: false });
  if (error) throw new Error(`Gagal memuat sitemap project: ${error.message}`);
  const base = getSiteUrl();
  const staticPages = ["/", "/about", "/projects", "/resume", "/contact"].map((path) => ({
    url: new URL(path, base).toString(),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));
  const projectPages = (data ?? []).map((project) => ({
    url: new URL(`/projects/${project.slug}`, base).toString(),
    lastModified: project.created_at,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [...staticPages, ...projectPages];
}

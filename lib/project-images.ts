import { createClient } from "@/lib/supabase/server";
import type { ProjectImage } from "@/lib/project-types";

export async function getProjectImages(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("project_images").select("id,project_id,image_url,image_path,caption,sort_order").eq("project_id", projectId).order("sort_order", { ascending: true });
  if (error) throw new Error(`Failed to load project gallery: ${error.message}`);
  return (data ?? []) as ProjectImage[];
}

export async function getProjectImageMap(projectIds: string[]) {
  if (projectIds.length === 0) return new Map<string, string[]>();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_images")
    .select("project_id,image_url,sort_order")
    .in("project_id", projectIds)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Failed to load project images: ${error.message}`);

  const imageMap = new Map<string, string[]>();
  for (const image of data ?? []) {
    const images = imageMap.get(image.project_id) ?? [];
    images.push(image.image_url);
    imageMap.set(image.project_id, images);
  }
  return imageMap;
}

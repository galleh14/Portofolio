import { createClient } from "@/lib/supabase/server";
import type { ProjectImage } from "@/lib/project-types";

export async function getProjectImages(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("project_images").select("id,project_id,image_url,image_path,caption,sort_order").eq("project_id", projectId).order("sort_order", { ascending: true });
  if (error) throw new Error(`Gagal memuat galeri project: ${error.message}`);
  return (data ?? []) as ProjectImage[];
}

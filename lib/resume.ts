import { createClient } from "@/lib/supabase/server";
import type { ResumeItem } from "@/lib/resume-types";
export * from "@/lib/resume-types";

const RESUME_SELECT = "id,category,title,organization,location,start_date,end_date,is_current,description,url,file_url,file_path,credential_id,sort_order,is_visible,created_at";

export async function getResumeItems(visibleOnly = true) {
  const supabase = await createClient();
  let query = supabase.from("resume_items").select(RESUME_SELECT).order("sort_order", { ascending: true }).order("start_date", { ascending: false, nullsFirst: false });
  if (visibleOnly) query = query.eq("is_visible", true);
  const { data, error } = await query;
  if (error) throw new Error(`Gagal memuat resume: ${error.message}`);
  return (data ?? []) as ResumeItem[];
}

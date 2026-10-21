"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RESUME_CATEGORIES, SOFTWARE_LEVELS, type ResumeCategory, type SoftwareLevel } from "@/lib/resume-types";

export type ResumeActionState = { error: string; success: boolean };
const emptyState: ResumeActionState = { error: "", success: false };
type ResumePayload = {
  category: ResumeCategory;
  title: string;
  organization: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  level: SoftwareLevel | null;
  url: string | null;
  credential_id: string | null;
  sort_order: number;
  is_visible: boolean;
  existing_file_url: string | null;
  existing_file_path: string | null;
  existing_file_name: string | null;
};
type ResumeReadResult = { error: string } | { value: ResumePayload };

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function readText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function readCategory(value: string): ResumeCategory | null {
  return RESUME_CATEGORIES.includes(value as ResumeCategory) ? value as ResumeCategory : null;
}

function readItem(formData: FormData): ResumeReadResult {
  const category = readCategory(readText(formData, "category"));
  const title = readText(formData, "title");
  const url = readText(formData, "url");
  const level = readText(formData, "level");
  if (!category || !title) return { error: "Category and title are required." };
  if (url && !url.startsWith("https://")) return { error: "URL must start with https://." };
  if (category === "software" && !SOFTWARE_LEVELS.includes(level as SoftwareLevel)) return { error: "Select a valid software proficiency level." };
  return {
    value: {
      category,
      title,
      organization: readText(formData, "organization") || null,
      location: readText(formData, "location") || null,
      start_date: readText(formData, "start_date") || null,
      end_date: formData.get("is_current") === "on" ? null : readText(formData, "end_date") || null,
      is_current: formData.get("is_current") === "on",
      description: readText(formData, "description") || null,
      level: category === "software" ? level as SoftwareLevel : null,
      url: url || null,
      credential_id: readText(formData, "credential_id") || null,
      sort_order: Number.parseInt(readText(formData, "sort_order") || "0", 10) || 0,
      is_visible: formData.get("is_visible") === "on",
      existing_file_url: readText(formData, "existing_file_url") || null,
      existing_file_path: readText(formData, "existing_file_path") || null,
      existing_file_name: readText(formData, "existing_file_name") || null,
    },
  };
}

async function removeFile(supabase: Awaited<ReturnType<typeof createClient>>, path: string | null) {
  if (!path) return;
  const { error } = await supabase.storage.from("portfolio").remove([path]);
  if (error) throw new Error(`File deletion failed: ${error.message}`);
}

function revalidateResume() {
  revalidatePath("/admin/resume", "page");
  revalidatePath("/resume", "page");
  revalidatePath("/about", "page");
}

export async function saveResumeItem(previousState: ResumeActionState = emptyState, formData: FormData): Promise<ResumeActionState> {
  void previousState;
  const parsed = readItem(formData);
  if ("error" in parsed) return { error: parsed.error, success: false };
  const id = readText(formData, "id");
  const supabase = await requireUser();
  const uploaded = formData.get("uploaded_file_url") ? { path: String(formData.get("uploaded_file_path") ?? ""), url: String(formData.get("uploaded_file_url")), name: String(formData.get("uploaded_file_name") ?? "") } : undefined;

  const payload = {
    ...parsed.value,
    file_url: uploaded?.url ?? parsed.value.existing_file_url,
    file_path: uploaded?.path ?? parsed.value.existing_file_path,
  };
  delete (payload as { existing_file_url?: string | null }).existing_file_url;
  delete (payload as { existing_file_path?: string | null }).existing_file_path;
  delete (payload as { existing_file_name?: string | null }).existing_file_name;
  const result = id
    ? await supabase.from("resume_items").update(payload).eq("id", id).select("id").single()
    : await supabase.from("resume_items").insert(payload).select("id").single();

  if (result.error) {
    if (uploaded) await removeFile(supabase, uploaded.path);
    return { error: `Resume could not be saved: ${result.error.message}`, success: false };
  }
  if (uploaded && parsed.value.existing_file_path) {
    try {
      await removeFile(supabase, parsed.value.existing_file_path);
    } catch (error) {
      return { error: error instanceof Error ? `Saved, but ${error.message.toLowerCase()}` : "Saved, but file lama could not be deleted.", success: false };
    }
  }
  revalidateResume();
  return { error: "", success: true };
}

export async function deleteResumeItem(formData: FormData) {
  const id = readText(formData, "id");
  if (!id) throw new Error("Item resume not found.");
  const supabase = await requireUser();
  const { data, error: readError } = await supabase.from("resume_items").select("file_path").eq("id", id).single();
  if (readError) throw new Error(`Failed to read item: ${readError.message}`);
  const { error } = await supabase.from("resume_items").delete().eq("id", id);
  if (error) throw new Error(`Item resume could not be deleted: ${error.message}`);
  await removeFile(supabase, data.file_path);
  revalidateResume();
}

export async function toggleResumeItem(formData: FormData) {
  const id = readText(formData, "id");
  const isVisible = formData.get("is_visible") === "true";
  const supabase = await requireUser();
  const { error } = await supabase.from("resume_items").update({ is_visible: !isVisible }).eq("id", id);
  if (error) throw new Error(`Visibility could not be changed: ${error.message}`);
  revalidateResume();
}

export async function moveResumeItem(formData: FormData) {
  const id = readText(formData, "id");
  const direction = formData.get("direction") === "up" ? "up" : "down";
  const category = readCategory(readText(formData, "category"));
  if (!id || !category) throw new Error("Item resume is invalid.");
  const supabase = await requireUser();
  const { data, error } = await supabase.from("resume_items").select("id,sort_order").eq("category", category).order("sort_order", { ascending: true }).order("start_date", { ascending: false, nullsFirst: false });
  if (error) throw new Error(`Order resume could not be loaded: ${error.message}`);
  const index = data.findIndex((item) => item.id === id);
  const otherIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || !data[otherIndex]) return;
  const current = data[index];
  const other = data[otherIndex];
  const first = await supabase.from("resume_items").update({ sort_order: other.sort_order }).eq("id", current.id);
  if (first.error) throw new Error(`Order resume could not be changed: ${first.error.message}`);
  const second = await supabase.from("resume_items").update({ sort_order: current.sort_order }).eq("id", other.id);
  if (second.error) throw new Error(`Order resume could not be changed: ${second.error.message}`);
  revalidateResume();
}

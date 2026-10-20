"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RESUME_CATEGORIES, type ResumeCategory } from "@/lib/resume-types";

export type ResumeActionState = { error: string; success: boolean };
const emptyState: ResumeActionState = { error: "", success: false };
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const FILE_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);
type ResumePayload = {
  category: ResumeCategory;
  title: string;
  organization: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
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
  if (!category || !title) return { error: "Kategori dan judul wajib diisi." };
  if (url && !url.startsWith("https://")) return { error: "URL harus diawali https://." };
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

function readFile(formData: FormData) {
  const value = formData.get("file");
  if (!(value instanceof File) || value.size === 0) return {};
  if (!FILE_TYPES.has(value.type)) return { error: "File harus PDF, JPG, PNG, atau WebP." };
  if (value.size > MAX_FILE_SIZE) return { error: "Ukuran file maksimal 5MB." };
  return { file: value };
}

async function uploadFile(supabase: Awaited<ReturnType<typeof createClient>>, file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `resume/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("portfolio").upload(path, await file.arrayBuffer(), {
    contentType: file.type,
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(`Upload file gagal: ${error.message}`);
  return { path, url: supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl, name: file.name };
}

async function removeFile(supabase: Awaited<ReturnType<typeof createClient>>, path: string | null) {
  if (!path) return;
  const { error } = await supabase.storage.from("portfolio").remove([path]);
  if (error) throw new Error(`Penghapusan file gagal: ${error.message}`);
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
  const file = readFile(formData);
  if (file.error) return { error: file.error, success: false };
  const id = readText(formData, "id");
  const supabase = await requireUser();
  let uploaded: { path: string; url: string; name: string } | undefined;

  if (file.file) {
    try {
      uploaded = await uploadFile(supabase, file.file);
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Upload file gagal.", success: false };
    }
  }

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
    return { error: `Resume gagal disimpan: ${result.error.message}`, success: false };
  }
  if (uploaded && parsed.value.existing_file_path) {
    try {
      await removeFile(supabase, parsed.value.existing_file_path);
    } catch (error) {
      return { error: error instanceof Error ? `Tersimpan, tetapi ${error.message.toLowerCase()}` : "Tersimpan, tetapi file lama gagal dihapus.", success: false };
    }
  }
  revalidateResume();
  return { error: "", success: true };
}

export async function deleteResumeItem(formData: FormData) {
  const id = readText(formData, "id");
  if (!id) throw new Error("Item resume tidak ditemukan.");
  const supabase = await requireUser();
  const { data, error: readError } = await supabase.from("resume_items").select("file_path").eq("id", id).single();
  if (readError) throw new Error(`Gagal membaca item: ${readError.message}`);
  const { error } = await supabase.from("resume_items").delete().eq("id", id);
  if (error) throw new Error(`Item resume gagal dihapus: ${error.message}`);
  await removeFile(supabase, data.file_path);
  revalidateResume();
}

export async function toggleResumeItem(formData: FormData) {
  const id = readText(formData, "id");
  const isVisible = formData.get("is_visible") === "true";
  const supabase = await requireUser();
  const { error } = await supabase.from("resume_items").update({ is_visible: !isVisible }).eq("id", id);
  if (error) throw new Error(`Visibility gagal diubah: ${error.message}`);
  revalidateResume();
}

export async function moveResumeItem(formData: FormData) {
  const id = readText(formData, "id");
  const direction = formData.get("direction") === "up" ? "up" : "down";
  const category = readCategory(readText(formData, "category"));
  if (!id || !category) throw new Error("Item resume tidak valid.");
  const supabase = await requireUser();
  const { data, error } = await supabase.from("resume_items").select("id,sort_order").eq("category", category).order("sort_order", { ascending: true }).order("start_date", { ascending: false, nullsFirst: false });
  if (error) throw new Error(`Urutan resume gagal dimuat: ${error.message}`);
  const index = data.findIndex((item) => item.id === id);
  const otherIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || !data[otherIndex]) return;
  const current = data[index];
  const other = data[otherIndex];
  const first = await supabase.from("resume_items").update({ sort_order: other.sort_order }).eq("id", current.id);
  if (first.error) throw new Error(`Urutan resume gagal diubah: ${first.error.message}`);
  const second = await supabase.from("resume_items").update({ sort_order: current.sort_order }).eq("id", other.id);
  if (second.error) throw new Error(`Urutan resume gagal diubah: ${second.error.message}`);
  revalidateResume();
}

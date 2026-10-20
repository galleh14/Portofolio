"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SlidesActionState = { error: string; success: string };
const emptyState: SlidesActionState = { error: "", success: "" };
const MAX_FILE_SIZE = 3 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
type UrlResult = { error: string } | { value: string | null };
type ImageFilesResult = { error: string } | { files: File[] };

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function readUrl(value: FormDataEntryValue | null): UrlResult {
  const url = String(value ?? "").trim();
  if (url && !url.startsWith("https://")) return { error: "Link slide harus diawali https://." };
  return { value: url || null };
}

function readImageFiles(formData: FormData): ImageFilesResult {
  const files = formData.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
  if (files.length === 0) return { error: "Pilih minimal satu gambar." };
  for (const file of files) {
    if (!IMAGE_TYPES.has(file.type)) return { error: `${file.name}: hanya JPG, PNG, atau WebP yang diperbolehkan.` };
    if (file.size > MAX_FILE_SIZE) return { error: `${file.name}: ukuran maksimal 3MB.` };
  }
  return { files };
}

async function uploadSlideImage(supabase: Awaited<ReturnType<typeof createClient>>, file: File) {
  const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
  const path = `hero/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("portfolio").upload(path, await file.arrayBuffer(), {
    contentType: file.type,
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(`Upload ${file.name} gagal: ${error.message}`);
  return { path, url: supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl };
}

async function removeStorageFile(supabase: Awaited<ReturnType<typeof createClient>>, path: string) {
  const { error } = await supabase.storage.from("portfolio").remove([path]);
  if (error) throw new Error(`File Storage gagal dihapus: ${error.message}`);
}

function revalidateSlides() {
  revalidatePath("/", "page");
  revalidatePath("/admin/slides", "page");
}

export async function uploadSlides(previousState: SlidesActionState = emptyState, formData: FormData): Promise<SlidesActionState> {
  void previousState;
  const files = readImageFiles(formData);
  if ("error" in files) return { error: files.error, success: "" };
  const supabase = await requireUser();
  const uploaded: { path: string; url: string }[] = [];

  try {
    for (const file of files.files) uploaded.push(await uploadSlideImage(supabase, file));
    const { data: lastSlide, error: lastSlideError } = await supabase.from("hero_slides").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
    if (lastSlideError) throw new Error(`Urutan slide gagal dibaca: ${lastSlideError.message}`);
    const startOrder = (lastSlide?.sort_order ?? -1) + 1;
    const { error } = await supabase.from("hero_slides").insert(uploaded.map((slide, index) => ({
      image_url: slide.url,
      image_path: slide.path,
      caption: null,
      link_url: null,
      sort_order: startOrder + index,
      is_active: true,
    })));
    if (error) throw new Error(`Slide gagal disimpan: ${error.message}`);
  } catch (error) {
    for (const slide of uploaded) await supabase.storage.from("portfolio").remove([slide.path]);
    return { error: error instanceof Error ? error.message : "Upload slide gagal.", success: "" };
  }

  revalidateSlides();
  return { error: "", success: `${files.files.length} slide berhasil ditambahkan.` };
}

export async function updateSlide(previousState: SlidesActionState = emptyState, formData: FormData): Promise<SlidesActionState> {
  void previousState;
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Slide tidak ditemukan.", success: "" };
  const link = readUrl(formData.get("link_url"));
  if ("error" in link) return { error: link.error, success: "" };
  const supabase = await requireUser();
  const { error } = await supabase.from("hero_slides").update({
    caption: String(formData.get("caption") ?? "").trim() || null,
    link_url: link.value,
    is_active: formData.get("is_active") === "on",
  }).eq("id", id);
  if (error) return { error: `Slide gagal diperbarui: ${error.message}`, success: "" };
  revalidateSlides();
  return { error: "", success: "Slide berhasil diperbarui." };
}

export async function deleteSlide(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const path = String(formData.get("image_path") ?? "");
  if (!id || !path) throw new Error("Data slide tidak lengkap.");
  const supabase = await requireUser();
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) throw new Error(`Slide gagal dihapus: ${error.message}`);
  await removeStorageFile(supabase, path);
  revalidateSlides();
}

export async function moveSlide(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const direction = formData.get("direction") === "up" ? "up" : "down";
  if (!id) throw new Error("Slide tidak ditemukan.");
  const supabase = await requireUser();
  const { data, error } = await supabase.from("hero_slides").select("id,sort_order").order("sort_order", { ascending: true }).order("created_at", { ascending: true });
  if (error) throw new Error(`Urutan slide gagal dimuat: ${error.message}`);
  const index = data.findIndex((slide) => slide.id === id);
  const otherIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || !data[otherIndex]) return;
  const current = data[index];
  const other = data[otherIndex];
  const first = await supabase.from("hero_slides").update({ sort_order: other.sort_order }).eq("id", current.id);
  if (first.error) throw new Error(`Urutan slide gagal diubah: ${first.error.message}`);
  const second = await supabase.from("hero_slides").update({ sort_order: current.sort_order }).eq("id", other.id);
  if (second.error) throw new Error(`Urutan slide gagal diubah: ${second.error.message}`);
  revalidateSlides();
}

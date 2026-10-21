"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SlidesActionState = { error: string; success: string };
const emptyState: SlidesActionState = { error: "", success: "" };
type UrlResult = { error: string } | { value: string | null };

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function readUrl(value: FormDataEntryValue | null): UrlResult {
  const url = String(value ?? "").trim();
  if (url && !url.startsWith("https://")) return { error: "Link slide must start with https://." };
  return { value: url || null };
}

async function removeStorageFile(supabase: Awaited<ReturnType<typeof createClient>>, path: string) {
  const { error } = await supabase.storage.from("portfolio").remove([path]);
  if (error) throw new Error(`File Storage could not be deleted: ${error.message}`);
}

function revalidateSlides() {
  revalidatePath("/", "page");
  revalidatePath("/admin/slides", "page");
}

export async function uploadSlides(previousState: SlidesActionState = emptyState, formData: FormData): Promise<SlidesActionState> {
  void previousState;
  let uploaded: { path: string; url: string; name: string }[] = [];
  try { uploaded = JSON.parse(String(formData.get("uploaded_images") ?? "[]")); } catch { return { error: "Data upload slide is invalid.", success: "" }; }
  if (uploaded.length === 0) return { error: "Select at least one image.", success: "" };
  const supabase = await requireUser();
  try {
    const { data: lastSlide, error: lastSlideError } = await supabase.from("hero_slides").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
    if (lastSlideError) throw new Error(`Order slide could not be read: ${lastSlideError.message}`);
    const startOrder = (lastSlide?.sort_order ?? -1) + 1;
    const { error } = await supabase.from("hero_slides").insert(uploaded.map((slide, index) => ({
      image_url: slide.url,
      image_path: slide.path,
      caption: null,
      link_url: null,
      sort_order: startOrder + index,
      is_active: true,
    })));
    if (error) throw new Error(`Slide could not be saved: ${error.message}`);
  } catch (error) {
    for (const slide of uploaded) await supabase.storage.from("portfolio").remove([slide.path]);
    return { error: error instanceof Error ? error.message : "Slide upload failed.", success: "" };
  }

  revalidateSlides();
  return { error: "", success: `${uploaded.length} slide successfully ditambahkan.` };
}

export async function updateSlide(previousState: SlidesActionState = emptyState, formData: FormData): Promise<SlidesActionState> {
  void previousState;
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Slide not found.", success: "" };
  const link = readUrl(formData.get("link_url"));
  if ("error" in link) return { error: link.error, success: "" };
  const supabase = await requireUser();
  const { error } = await supabase.from("hero_slides").update({
    caption: String(formData.get("caption") ?? "").trim() || null,
    link_url: link.value,
    is_active: formData.get("is_active") === "on",
  }).eq("id", id);
  if (error) return { error: `Slide could not be updated: ${error.message}`, success: "" };
  revalidateSlides();
  return { error: "", success: "Slide successfully diperbarui." };
}

export async function deleteSlide(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const path = String(formData.get("image_path") ?? "");
  if (!id || !path) throw new Error("Slide data is incomplete.");
  const supabase = await requireUser();
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) throw new Error(`Slide could not be deleted: ${error.message}`);
  await removeStorageFile(supabase, path);
  revalidateSlides();
}

export async function moveSlide(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const direction = formData.get("direction") === "up" ? "up" : "down";
  if (!id) throw new Error("Slide not found.");
  const supabase = await requireUser();
  const { data, error } = await supabase.from("hero_slides").select("id,sort_order").order("sort_order", { ascending: true }).order("created_at", { ascending: true });
  if (error) throw new Error(`Order slide could not be loaded: ${error.message}`);
  const index = data.findIndex((slide) => slide.id === id);
  const otherIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || !data[otherIndex]) return;
  const current = data[index];
  const other = data[otherIndex];
  const first = await supabase.from("hero_slides").update({ sort_order: other.sort_order }).eq("id", current.id);
  if (first.error) throw new Error(`Order slide could not be changed: ${first.error.message}`);
  const second = await supabase.from("hero_slides").update({ sort_order: current.sort_order }).eq("id", other.id);
  if (second.error) throw new Error(`Order slide could not be changed: ${second.error.message}`);
  revalidateSlides();
}

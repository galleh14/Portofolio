"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type TestimonialsActionState = { error: string; success: string };
const emptyState: TestimonialsActionState = { error: "", success: "" };
type FieldsResult = { error: string } | {
  value: {
    quote: string;
    name: string;
    position: string | null;
    organization: string | null;
    sort_order: number;
    is_visible: boolean;
  };
};

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function readText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

async function removePhoto(supabase: Awaited<ReturnType<typeof createClient>>, path: string | null) {
  if (!path) return;
  const { error } = await supabase.storage.from("portfolio").remove([path]);
  if (error) throw new Error(`Foto Storage gagal dihapus: ${error.message}`);
}

function revalidateTestimonials() {
  revalidatePath("/", "page");
  revalidatePath("/admin/testimonials", "page");
}

function readFields(formData: FormData): FieldsResult {
  const quote = readText(formData, "quote");
  const name = readText(formData, "name");
  if (!quote || !name) return { error: "Quote dan nama wajib diisi." };
  const sortOrder = Number.parseInt(readText(formData, "sort_order") || "0", 10);
  return {
    value: {
      quote,
      name,
      position: readText(formData, "position") || null,
      organization: readText(formData, "organization") || null,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
      is_visible: formData.get("is_visible") === "on",
    },
  };
}

export async function createTestimonial(previousState: TestimonialsActionState = emptyState, formData: FormData): Promise<TestimonialsActionState> {
  void previousState;
  const fields = readFields(formData);
  if ("error" in fields) return { error: fields.error, success: "" };
  const supabase = await requireUser();
  const uploaded = formData.get("uploaded_photo_url") ? { path: String(formData.get("uploaded_photo_path") ?? ""), url: String(formData.get("uploaded_photo_url")) } : undefined;
  try {
    const { error } = await supabase.from("testimonials").insert({
      ...fields.value,
      photo_url: uploaded?.url ?? null,
      photo_path: uploaded?.path ?? null,
    });
    if (error) throw new Error(`Testimonial gagal disimpan: ${error.message}`);
  } catch (error) {
    if (uploaded) await supabase.storage.from("portfolio").remove([uploaded.path]);
    return { error: error instanceof Error ? error.message : "Testimonial gagal disimpan.", success: "" };
  }
  revalidateTestimonials();
  return { error: "", success: "Testimonial berhasil ditambahkan." };
}

export async function updateTestimonial(previousState: TestimonialsActionState = emptyState, formData: FormData): Promise<TestimonialsActionState> {
  void previousState;
  const id = readText(formData, "id");
  if (!id) return { error: "Testimonial tidak ditemukan.", success: "" };
  const fields = readFields(formData);
  if ("error" in fields) return { error: fields.error, success: "" };
  const supabase = await requireUser();
  const oldPath = readText(formData, "existing_photo_path") || null;
  const uploaded = formData.get("uploaded_photo_url") ? { path: String(formData.get("uploaded_photo_path") ?? ""), url: String(formData.get("uploaded_photo_url")) } : undefined;
  try {
    const { error } = await supabase.from("testimonials").update({
      ...fields.value,
      ...(uploaded ? { photo_url: uploaded.url, photo_path: uploaded.path } : {}),
    }).eq("id", id);
    if (error) throw new Error(`Testimonial gagal diperbarui: ${error.message}`);
    if (uploaded && oldPath) await removePhoto(supabase, oldPath);
  } catch (error) {
    if (uploaded) await supabase.storage.from("portfolio").remove([uploaded.path]);
    return { error: error instanceof Error ? error.message : "Testimonial gagal diperbarui.", success: "" };
  }
  revalidateTestimonials();
  return { error: "", success: "Testimonial berhasil diperbarui." };
}

export async function deleteTestimonial(formData: FormData) {
  const id = readText(formData, "id");
  if (!id) throw new Error("Testimonial tidak ditemukan.");
  const supabase = await requireUser();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(`Testimonial gagal dihapus: ${error.message}`);
  await removePhoto(supabase, readText(formData, "photo_path") || null);
  revalidateTestimonials();
}

export async function moveTestimonial(formData: FormData) {
  const id = readText(formData, "id");
  const direction = formData.get("direction") === "up" ? "up" : "down";
  if (!id) throw new Error("Testimonial tidak ditemukan.");
  const supabase = await requireUser();
  const { data, error } = await supabase.from("testimonials").select("id,sort_order").order("sort_order", { ascending: true }).order("id", { ascending: true });
  if (error) throw new Error(`Urutan testimonial gagal dimuat: ${error.message}`);
  const index = data.findIndex((item) => item.id === id);
  const otherIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || !data[otherIndex]) return;
  const current = data[index];
  const other = data[otherIndex];
  const first = await supabase.from("testimonials").update({ sort_order: other.sort_order }).eq("id", current.id);
  if (first.error) throw new Error(`Urutan testimonial gagal diubah: ${first.error.message}`);
  const second = await supabase.from("testimonials").update({ sort_order: current.sort_order }).eq("id", other.id);
  if (second.error) throw new Error(`Urutan testimonial gagal diubah: ${second.error.message}`);
  revalidateTestimonials();
}

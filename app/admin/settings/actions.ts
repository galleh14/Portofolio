"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SettingsActionState = { error: string; success: boolean };
const emptyState: SettingsActionState = { error: "", success: false };
const MAX_CV_SIZE = 5 * 1024 * 1024;
type SettingsPayload = {
  site_name: string;
  role_title: string;
  location: string;
  hero_heading: string;
  hero_subheading: string;
  about_label: string;
  about_heading: string;
  about_body: string;
  email: string;
  linkedin_url: string;
  instagram_url: string;
  github_url: string;
  whatsapp: string;
  cv_url: string;
  footer_text: string;
};
type SettingsReadResult = { error: string } | { value: SettingsPayload };

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function readText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function isValidUrl(value: string) {
  return !value || value.startsWith("https://");
}

function readSettings(formData: FormData): SettingsReadResult {
  const settings = {
    site_name: readText(formData, "site_name"),
    role_title: readText(formData, "role_title"),
    location: readText(formData, "location"),
    hero_heading: readText(formData, "hero_heading"),
    hero_subheading: readText(formData, "hero_subheading"),
    about_label: readText(formData, "about_label"),
    about_heading: readText(formData, "about_heading"),
    about_body: readText(formData, "about_body"),
    email: readText(formData, "email"),
    linkedin_url: readText(formData, "linkedin_url"),
    instagram_url: readText(formData, "instagram_url"),
    github_url: readText(formData, "github_url"),
    whatsapp: readText(formData, "whatsapp"),
    cv_url: readText(formData, "cv_url"),
    footer_text: readText(formData, "footer_text"),
  };

  if (Object.entries(settings).some(([key, value]) => !["linkedin_url", "instagram_url", "github_url", "whatsapp", "cv_url"].includes(key) && !value)) {
    return { error: "Semua field selain link opsional wajib diisi." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
    return { error: "Format email tidak valid." };
  }
  for (const [name, value] of [["LinkedIn", settings.linkedin_url], ["Instagram", settings.instagram_url], ["GitHub", settings.github_url], ["CV", settings.cv_url]] as const) {
    if (!isValidUrl(value)) return { error: `URL ${name} harus diawali https://.` };
  }
  return { value: settings };
}

export async function updateSettings(previousState: SettingsActionState = emptyState, formData: FormData): Promise<SettingsActionState> {
  void previousState;
  const parsed = readSettings(formData);
  if ("error" in parsed) return { error: parsed.error, success: false };

  const cv = formData.get("cv_file");
  if (cv instanceof File && cv.size > 0) {
    if (cv.type !== "application/pdf") return { error: "CV harus berupa file PDF.", success: false };
    if (cv.size > MAX_CV_SIZE) return { error: "Ukuran CV maksimal 5MB.", success: false };
  }

  const supabase = await requireUser();
  let cvUrl = parsed.value.cv_url || null;
  let uploadedPath: string | null = null;
  if (cv instanceof File && cv.size > 0) {
    uploadedPath = `cv/${crypto.randomUUID()}.pdf`;
    const { error } = await supabase.storage.from("portfolio").upload(uploadedPath, await cv.arrayBuffer(), {
      contentType: "application/pdf",
      cacheControl: "3600",
      upsert: false,
    });
    if (error) return { error: `Upload CV gagal: ${error.message}`, success: false };
    cvUrl = supabase.storage.from("portfolio").getPublicUrl(uploadedPath).data.publicUrl;
  }

  const { error } = await supabase.from("site_settings").update({ ...parsed.value, cv_url: cvUrl }).eq("id", 1);
  if (error) {
    if (uploadedPath) await supabase.storage.from("portfolio").remove([uploadedPath]);
    return { error: `Pengaturan gagal disimpan: ${error.message}`, success: false };
  }

  revalidatePath("/", "layout");
  revalidatePath("/about", "page");
  revalidatePath("/contact", "page");
  revalidatePath("/projects", "page");
  return { error: "", success: true };
}

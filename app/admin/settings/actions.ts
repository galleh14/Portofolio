"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SettingsActionState = { error: string; success: boolean };
const emptyState: SettingsActionState = { error: "", success: false };
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
  profile_image_url: string | null;
  profile_image_path: string | null;
  footer_text: string;
  availability_status: "open" | "busy" | "closed";
  available_from: string;
  location_preference: string;
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

async function removeStorageFile(supabase: Awaited<ReturnType<typeof createClient>>, path: string | null) {
  if (!path) return;
  const { error } = await supabase.storage.from("portfolio").remove([path]);
  if (error) throw new Error(`Failed to delete the old profile photo: ${error.message}`);
}

function readSettings(formData: FormData): SettingsReadResult {
  const availabilityStatus = readText(formData, "availability_status");
  if (!["open", "busy", "closed"].includes(availabilityStatus)) {
    return { error: "Status ketersediaan is invalid." };
  }
  const settings: SettingsPayload = {
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
    availability_status: availabilityStatus as SettingsPayload["availability_status"],
    available_from: readText(formData, "available_from"),
    location_preference: readText(formData, "location_preference"),
    profile_image_url: null,
    profile_image_path: null,
  };

  if (Object.entries(settings).some(([key, value]) => !["linkedin_url", "instagram_url", "github_url", "whatsapp", "cv_url", "available_from", "location_preference"].includes(key) && !value)) {
    return { error: "All fields except optional links are required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
    return { error: "Format email is invalid." };
  }
  for (const [name, value] of [["LinkedIn", settings.linkedin_url], ["Instagram", settings.instagram_url], ["GitHub", settings.github_url], ["CV", settings.cv_url]] as const) {
    if (!isValidUrl(value)) return { error: `URL ${name} must start with https://.` };
  }
  return { value: settings };
}

export async function updateSettings(previousState: SettingsActionState = emptyState, formData: FormData): Promise<SettingsActionState> {
  void previousState;
  const parsed = readSettings(formData);
  if ("error" in parsed) return { error: parsed.error, success: false };

  const supabase = await requireUser();
  const cvUrl = readText(formData, "uploaded_cv_url") || parsed.value.cv_url || null;
  const uploadedProfileImageUrl = readText(formData, "uploaded_profile_image_url");
  const uploadedProfileImagePath = readText(formData, "uploaded_profile_image_path");
  const removeProfileImage = formData.get("remove_profile_image") === "on";
  const { data: existingSettings, error: existingSettingsError } = await supabase
    .from("site_settings")
    .select("profile_image_url,profile_image_path")
    .eq("id", 1)
    .single();
  if (existingSettingsError) return { error: `Failed to read current settings: ${existingSettingsError.message}`, success: false };
  const profileImageUrl = uploadedProfileImageUrl || (removeProfileImage ? null : existingSettings.profile_image_url);
  const profileImagePath = uploadedProfileImagePath || (removeProfileImage ? null : existingSettings.profile_image_path);

  const { error } = await supabase.from("site_settings").update({ ...parsed.value, cv_url: cvUrl, profile_image_url: profileImageUrl, profile_image_path: profileImagePath }).eq("id", 1);
  if (error) {
    if (uploadedProfileImagePath) await removeStorageFile(supabase, uploadedProfileImagePath);
    return { error: `Settings could not be saved: ${error.message}`, success: false };
  }
  if (uploadedProfileImagePath || removeProfileImage) {
    try {
      await removeStorageFile(supabase, existingSettings.profile_image_path);
    } catch (cleanupError) {
      return { error: cleanupError instanceof Error ? cleanupError.message : "Profile photo cleanup failed.", success: false };
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/about", "page");
  revalidatePath("/contact", "page");
  revalidatePath("/projects", "page");
  revalidatePath("/opengraph-image", "page");
  return { error: "", success: true };
}

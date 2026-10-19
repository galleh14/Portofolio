"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error: string };
const emptyState: ActionState = { error: "" };
type ProjectPayload = {
  title: string;
  slug: string;
  description: string;
  tech_stack: string[];
  image_url: string | null;
  demo_url: string | null;
  repo_url: string | null;
  featured: boolean;
};
type ProjectReadResult = { error: string } | { value: ProjectPayload };
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  return supabase;
}

function readProject(formData: FormData): ProjectReadResult {
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const description = String(formData.get("description") ?? "").trim();
  const techStack = String(formData.get("tech_stack") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!title || !slug || !description) {
    return { error: "Title, slug, dan description wajib diisi." as const };
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung." as const };
  }

  return {
    value: {
      title,
      slug,
      description,
      tech_stack: techStack,
      image_url: String(formData.get("existing_image_url") ?? "").trim() || null,
      demo_url: String(formData.get("demo_url") ?? "").trim() || null,
      repo_url: String(formData.get("repo_url") ?? "").trim() || null,
      featured: formData.get("featured") === "on",
    },
  };
}

function readImageFile(formData: FormData): { file?: File; error?: string } {
  const value = formData.get("image");
  if (!(value instanceof File) || value.size === 0) return {};

  if (!IMAGE_TYPES.has(value.type)) {
    return { error: "Gambar harus berformat JPG, PNG, atau WebP." };
  }

  if (value.size > MAX_IMAGE_SIZE) {
    return { error: "Ukuran gambar maksimal 2MB." };
  }

  return { file: value };
}

async function uploadProjectImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
) {
  const extension = IMAGE_TYPES.get(file.type);
  if (!extension) throw new Error("Format gambar tidak didukung.");

  const path = `projects/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from("portfolio")
    .upload(path, await file.arrayBuffer(), {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw new Error(`Upload gambar gagal: ${error.message}`);
  const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
  return { path, url: data.publicUrl };
}

function getStoragePath(imageUrl: string | null) {
  if (!imageUrl) return null;
  const marker = "/storage/v1/object/public/portfolio/";
  const markerIndex = imageUrl.indexOf(marker);
  if (markerIndex === -1) return null;

  try {
    return decodeURIComponent(imageUrl.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}

async function removeProjectImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  imageUrl: string | null,
) {
  const path = getStoragePath(imageUrl);
  if (!path) return;

  const { error } = await supabase.storage.from("portfolio").remove([path]);
  if (error) throw new Error(`Penghapusan gambar lama gagal: ${error.message}`);
}

export async function createProject(previousState: ActionState = emptyState, formData: FormData): Promise<ActionState> {
  void previousState;
  const project = readProject(formData);
  if ("error" in project) return project;
  const image = readImageFile(formData);
  if (image.error) return { error: image.error };
  if (!image.file) return { error: "Pilih gambar project terlebih dahulu." };

  const supabase = await requireUser();
  let uploadedImage: { path: string; url: string } | undefined;
  if (image.file) {
    try {
      uploadedImage = await uploadProjectImage(supabase, image.file);
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Upload gambar gagal." };
    }
  }

  const { error } = await supabase
    .from("projects")
    .insert({ ...project.value, image_url: uploadedImage?.url ?? null });
  if (error) {
    if (uploadedImage) {
      await supabase.storage.from("portfolio").remove([uploadedImage.path]);
    }
    return { error: error.message };
  }

  revalidatePath("/admin/dashboard", "page");
  revalidatePath("/projects", "page");
  redirect("/admin/dashboard");
}

export async function updateProject(previousState: ActionState = emptyState, formData: FormData): Promise<ActionState> {
  void previousState;
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Project tidak ditemukan." };

  const project = readProject(formData);
  if ("error" in project) return project;
  const image = readImageFile(formData);
  if (image.error) return { error: image.error };

  const supabase = await requireUser();
  const { data: existingProject, error: existingProjectError } = await supabase
    .from("projects")
    .select("image_url")
    .eq("id", id)
    .single();
  if (existingProjectError) return { error: `Gagal membaca project: ${existingProjectError.message}` };

  let uploadedImage: { path: string; url: string } | undefined;
  if (image.file) {
    try {
      uploadedImage = await uploadProjectImage(supabase, image.file);
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Upload gambar gagal." };
    }
  }

  const { error } = await supabase
    .from("projects")
    .update({ ...project.value, image_url: uploadedImage?.url ?? existingProject.image_url })
    .eq("id", id)
    .select("id")
    .single();
  if (error) {
    if (uploadedImage) {
      await supabase.storage.from("portfolio").remove([uploadedImage.path]);
    }
    return { error: error.message };
  }

  if (uploadedImage) {
    try {
      await removeProjectImage(supabase, existingProject.image_url);
    } catch (cleanupError) {
      return {
        error: cleanupError instanceof Error
          ? `Project tersimpan, tetapi ${cleanupError.message.toLowerCase()}`
          : "Project tersimpan, tetapi gambar lama gagal dihapus.",
      };
    }
  }

  revalidatePath("/admin/dashboard", "page");
  revalidatePath("/projects", "page");
  revalidatePath(`/projects/${project.value.slug}`, "page");
  redirect("/admin/dashboard");
}

export async function deleteProject(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Project tidak ditemukan.");

  const supabase = await requireUser();
  const { data: project, error: readError } = await supabase
    .from("projects")
    .select("image_url")
    .eq("id", id)
    .single();
  if (readError) throw new Error(`Gagal membaca project: ${readError.message}`);

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await removeProjectImage(supabase, project.image_url);

  revalidatePath("/admin/dashboard", "page");
  revalidatePath("/projects", "page");
}

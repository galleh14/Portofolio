"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PROJECT_DOMAINS, DATA_TYPES } from "@/lib/project-types";

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
  doc_url: string | null;
  doc_name: string | null;
  featured: boolean;
  role: string | null;
  duration: string | null;
  study_area: string | null;
  domain: string | null;
  data_type: string | null;
  methods: string[];
  software: string[];
  objective: string | null;
  workflow: string | null;
  result: string | null;
  conclusion: string | null;
  notebook_url: string | null;
  dataset_url: string | null;
  latitude: number | null;
  longitude: number | null;
};
type ProjectReadResult = { error: string } | { value: ProjectPayload };

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
  const readTags = (name: string) => {
    try {
      const value = JSON.parse(String(formData.get(name) ?? "[]"));
      return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())).map((item) => item.trim()) : [];
    } catch {
      return [];
    }
  };
  const domain = String(formData.get("domain") ?? "").trim();
  const dataType = String(formData.get("data_type") ?? "").trim();

  if (!title || !slug || !description) {
    return { error: "Title, slug, dan description wajib diisi." as const };
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung." as const };
  }
  if (domain && !PROJECT_DOMAINS.includes(domain as (typeof PROJECT_DOMAINS)[number])) return { error: "Domain project tidak valid." };
  if (dataType && !DATA_TYPES.includes(dataType as (typeof DATA_TYPES)[number])) return { error: "Data type project tidak valid." };

  const notebookUrl = String(formData.get("notebook_url") ?? "").trim();
  const datasetUrl = String(formData.get("dataset_url") ?? "").trim();
  if ((notebookUrl && !notebookUrl.startsWith("https://")) || (datasetUrl && !datasetUrl.startsWith("https://"))) {
    return { error: "URL Notebook dan Dataset harus diawali https://." };
  }
  const latitudeText = String(formData.get("latitude") ?? "").trim();
  const longitudeText = String(formData.get("longitude") ?? "").trim();
  const latitude = latitudeText ? Number(latitudeText) : null;
  const longitude = longitudeText ? Number(longitudeText) : null;
  if ((latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) || (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180))) {
    return { error: "Latitude harus -90 sampai 90 dan longitude -180 sampai 180." };
  }
  if ((latitude === null) !== (longitude === null)) return { error: "Latitude dan longitude harus diisi bersama." };

  return {
    value: {
      title,
      slug,
      description,
      tech_stack: techStack,
      image_url: String(formData.get("uploaded_image_url") ?? formData.get("existing_image_url") ?? "").trim() || null,
      demo_url: String(formData.get("demo_url") ?? "").trim() || null,
      repo_url: String(formData.get("repo_url") ?? "").trim() || null,
      doc_url: String(formData.get("uploaded_doc_url") ?? formData.get("existing_doc_url") ?? "").trim() || null,
      doc_name: String(formData.get("uploaded_doc_name") ?? formData.get("existing_doc_name") ?? "").trim() || null,
      featured: formData.get("featured") === "on",
      role: String(formData.get("role") ?? "").trim() || null,
      duration: String(formData.get("duration") ?? "").trim() || null,
      study_area: String(formData.get("study_area") ?? "").trim() || null,
      domain: domain || null,
      data_type: dataType || null,
      methods: readTags("methods"),
      software: readTags("software"),
      objective: String(formData.get("objective") ?? "").trim() || null,
      workflow: String(formData.get("workflow") ?? "").trim() || null,
      result: String(formData.get("result") ?? "").trim() || null,
      conclusion: String(formData.get("conclusion") ?? "").trim() || null,
      notebook_url: notebookUrl || null,
      dataset_url: datasetUrl || null,
      latitude,
      longitude,
    },
  };
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

async function removeProjectDocument(
  supabase: Awaited<ReturnType<typeof createClient>>,
  documentUrl: string | null,
) {
  const path = getStoragePath(documentUrl);
  if (!path) return;

  const { error } = await supabase.storage.from("portfolio").remove([path]);
  if (error) throw new Error(`Penghapusan dokumen lama gagal: ${error.message}`);
}

export async function createProject(previousState: ActionState = emptyState, formData: FormData): Promise<ActionState> {
  void previousState;
  const project = readProject(formData);
  if ("error" in project) return project;
  const uploadedImageUrl = String(formData.get("uploaded_image_url") ?? "").trim();
  if (!uploadedImageUrl) return { error: "Pilih gambar project terlebih dahulu." };

  const supabase = await requireUser();
  const { data: createdProject, error } = await supabase
    .from("projects")
    .insert({
      ...project.value,
      image_url: uploadedImageUrl,
      doc_url: String(formData.get("uploaded_doc_url") ?? "").trim() || null,
      doc_name: String(formData.get("uploaded_doc_name") ?? "").trim() || null,
    }).select("id").single();
  if (error) {
    const paths = [String(formData.get("uploaded_image_path") ?? ""), String(formData.get("uploaded_doc_path") ?? "")].filter(Boolean);
    if (paths.length) await supabase.storage.from("portfolio").remove(paths);
    return { error: error.message };
  }
  try {
    const uploadedGallery = JSON.parse(String(formData.get("uploaded_gallery") ?? "[]")) as { path: string; url: string; caption: string | null }[];
    if (uploadedGallery.length > 0) {
      const { error: galleryError } = await supabase.from("project_images").insert(uploadedGallery.map((image, index) => ({ project_id: createdProject.id, image_url: image.url, image_path: image.path, caption: image.caption, sort_order: index })));
      if (galleryError) throw new Error(`Galeri gagal disimpan: ${galleryError.message}`);
    }
  } catch (galleryError) {
    await supabase.from("projects").delete().eq("id", createdProject.id);
    return { error: galleryError instanceof Error ? galleryError.message : "Galeri gagal disimpan." };
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
  const uploadedImageUrl = String(formData.get("uploaded_image_url") ?? "").trim();
  const removeDocument = formData.get("remove_document") === "on";

  const supabase = await requireUser();
  const { data: existingProject, error: existingProjectError } = await supabase
    .from("projects")
    .select("image_url,doc_url,doc_name")
    .eq("id", id)
    .single();
  if (existingProjectError) return { error: `Gagal membaca project: ${existingProjectError.message}` };

  const { error } = await supabase
    .from("projects")
    .update({
      ...project.value,
      image_url: uploadedImageUrl || existingProject.image_url,
      doc_url: String(formData.get("uploaded_doc_url") ?? "").trim() || (removeDocument ? null : existingProject.doc_url),
      doc_name: String(formData.get("uploaded_doc_name") ?? "").trim() || (removeDocument ? null : existingProject.doc_name),
    })
    .eq("id", id)
    .select("id")
    .single();
  if (error) {
    const paths = [String(formData.get("uploaded_image_path") ?? ""), String(formData.get("uploaded_doc_path") ?? "")].filter(Boolean);
    if (paths.length) await supabase.storage.from("portfolio").remove(paths);
    return { error: error.message };
  }

  const uploadedGallery = JSON.parse(String(formData.get("uploaded_gallery") ?? "[]")) as { path: string; url: string; caption: string | null }[];
  if (uploadedGallery.length > 0) {
    const { data: existingGallery } = await supabase.from("project_images").select("sort_order").eq("project_id", id).order("sort_order", { ascending: false }).limit(1).maybeSingle();
    try {
      const { error: galleryError } = await supabase.from("project_images").insert(uploadedGallery.map((image, index) => ({ project_id: id, image_url: image.url, image_path: image.path, caption: image.caption, sort_order: (existingGallery?.sort_order ?? -1) + index + 1 })));
      if (galleryError) throw new Error(`Galeri gagal disimpan: ${galleryError.message}`);
    } catch (galleryError) {
      for (const image of uploadedGallery) await supabase.storage.from("portfolio").remove([image.path]);
      return { error: galleryError instanceof Error ? galleryError.message : "Galeri gagal disimpan." };
    }
  }

  if (uploadedImageUrl) {
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
  if (formData.get("uploaded_doc_url") || removeDocument) {
    try {
      await removeProjectDocument(supabase, existingProject.doc_url);
    } catch (cleanupError) {
      return {
        error: cleanupError instanceof Error
          ? `Project tersimpan, tetapi ${cleanupError.message.toLowerCase()}`
          : "Project tersimpan, tetapi dokumen lama gagal dihapus.",
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
    .select("image_url,doc_url")
    .eq("id", id)
    .single();
  if (readError) throw new Error(`Gagal membaca project: ${readError.message}`);

  const { data: gallery } = await supabase.from("project_images").select("image_path").eq("project_id", id);
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  const cleanupErrors: string[] = [];
  try {
    await removeProjectImage(supabase, project.image_url);
  } catch (cleanupError) {
    cleanupErrors.push(cleanupError instanceof Error ? cleanupError.message : "Penghapusan gambar gagal.");
  }
  try {
    await removeProjectDocument(supabase, project.doc_url);
  } catch (cleanupError) {
    cleanupErrors.push(cleanupError instanceof Error ? cleanupError.message : "Penghapusan dokumen gagal.");
  }
  for (const image of gallery ?? []) {
    try {
      await supabase.storage.from("portfolio").remove([image.image_path]);
    } catch (cleanupError) {
      cleanupErrors.push(cleanupError instanceof Error ? cleanupError.message : "Penghapusan gambar galeri gagal.");
    }
  }

  if (cleanupErrors.length > 0) throw new Error(`Project terhapus, tetapi ${cleanupErrors.join(" ")}`);

  revalidatePath("/admin/dashboard", "page");
  revalidatePath("/projects", "page");
}

export async function updateProjectImage(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const imageId = String(formData.get("image_id") ?? "");
  const caption = String(formData.get("caption") ?? "").trim() || null;
  if (!id || !imageId) throw new Error("Data gambar project tidak lengkap.");
  const supabase = await requireUser();
  const { error } = await supabase.from("project_images").update({ caption }).eq("id", imageId).eq("project_id", id);
  if (error) throw new Error(`Caption gambar gagal disimpan: ${error.message}`);
  revalidatePath(`/projects/${String(formData.get("slug") ?? "")}`, "page");
}

export async function setProjectCover(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const imageId = String(formData.get("image_id") ?? "");
  if (!id || !imageId) throw new Error("Data cover project tidak lengkap.");
  const supabase = await requireUser();
  const { data: image, error: imageError } = await supabase.from("project_images").select("image_url").eq("id", imageId).eq("project_id", id).single();
  if (imageError || !image) throw new Error(`Gambar cover gagal dimuat: ${imageError?.message ?? "gambar tidak ditemukan"}`);
  const { error } = await supabase.from("projects").update({ image_url: image.image_url }).eq("id", id);
  if (error) throw new Error(`Cover project gagal disimpan: ${error.message}`);
  const slug = String(formData.get("slug") ?? "");
  revalidatePath("/admin/dashboard", "page");
  revalidatePath("/", "page");
  revalidatePath("/projects", "page");
  revalidatePath(`/projects/${slug}`, "page");
}

export async function deleteProjectImage(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const imageId = String(formData.get("image_id") ?? "");
  const path = String(formData.get("image_path") ?? "");
  if (!id || !imageId || !path) throw new Error("Data gambar project tidak lengkap.");
  const supabase = await requireUser();
  const { error } = await supabase.from("project_images").delete().eq("id", imageId).eq("project_id", id);
  if (error) throw new Error(`Gambar gagal dihapus: ${error.message}`);
  await supabase.storage.from("portfolio").remove([path]);
  revalidatePath(`/projects/${String(formData.get("slug") ?? "")}`, "page");
}

export async function moveProjectImage(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const imageId = String(formData.get("image_id") ?? "");
  const direction = formData.get("direction") === "up" ? "up" : "down";
  if (!id || !imageId) throw new Error("Data gambar project tidak lengkap.");
  const supabase = await requireUser();
  const { data, error } = await supabase.from("project_images").select("id,sort_order").eq("project_id", id).order("sort_order", { ascending: true });
  if (error) throw new Error(`Urutan galeri gagal dimuat: ${error.message}`);
  const index = data.findIndex((image) => image.id === imageId);
  const otherIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || !data[otherIndex]) return;
  const current = data[index];
  const other = data[otherIndex];
  const first = await supabase.from("project_images").update({ sort_order: other.sort_order }).eq("id", current.id);
  if (first.error) throw new Error(`Urutan galeri gagal diubah: ${first.error.message}`);
  const second = await supabase.from("project_images").update({ sort_order: current.sort_order }).eq("id", other.id);
  if (second.error) throw new Error(`Urutan galeri gagal diubah: ${second.error.message}`);
  revalidatePath(`/projects/${String(formData.get("slug") ?? "")}`, "page");
}

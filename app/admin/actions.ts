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
      image_url: String(formData.get("image_url") ?? "").trim() || null,
      demo_url: String(formData.get("demo_url") ?? "").trim() || null,
      repo_url: String(formData.get("repo_url") ?? "").trim() || null,
      featured: formData.get("featured") === "on",
    },
  };
}

export async function createProject(previousState: ActionState = emptyState, formData: FormData): Promise<ActionState> {
  void previousState;
  const project = readProject(formData);
  if ("error" in project) return project;

  const supabase = await requireUser();
  const { error } = await supabase.from("projects").insert(project.value);
  if (error) return { error: error.message };

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

  const supabase = await requireUser();
  const { error } = await supabase
    .from("projects")
    .update(project.value)
    .eq("id", id)
    .select("id")
    .single();
  if (error) return { error: error.message };

  revalidatePath("/admin/dashboard", "page");
  revalidatePath("/projects", "page");
  revalidatePath(`/projects/${project.value.slug}`, "page");
  redirect("/admin/dashboard");
}

export async function deleteProject(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Project tidak ditemukan.");

  const supabase = await requireUser();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/dashboard", "page");
  revalidatePath("/projects", "page");
}

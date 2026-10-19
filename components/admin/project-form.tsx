"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import type { Project } from "@/lib/dummy-data";
import { createProject, updateProject, type ActionState } from "@/app/admin/actions";

const initialState: ActionState = { error: "" };
type AdminProject = Project & { id: string; image_url?: string | null };

export function ProjectForm({ project }: { project?: AdminProject }) {
  const action = project ? updateProject : createProject;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [preview, setPreview] = useState<string | null>(project?.image_url ?? null);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setFileError("");
    if (!file) {
      setPreview(project?.image_url ?? null);
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      event.target.value = "";
      setFileError("Gambar harus berformat JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      event.target.value = "";
      setFileError("Ukuran gambar maksimal 2MB.");
      return;
    }

    setPreview(URL.createObjectURL(file));
  }

  return (
    <form action={formAction} encType="multipart/form-data" className="space-y-6 rounded-2xl bg-white p-6 sm:p-8">
      {project && <input type="hidden" name="id" value={project.id} />}
      <input type="hidden" name="existing_image_url" value={project?.image_url ?? ""} />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">Title<input required name="title" defaultValue={project?.title} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none transition focus:border-[var(--dark)]" /></label>
        <label className="block text-sm font-semibold">Slug<input required name="slug" defaultValue={project?.slug} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none transition focus:border-[var(--dark)]" /></label>
      </div>
      <label className="block text-sm font-semibold">Description<textarea required name="description" rows={4} defaultValue={project?.description} className="mt-2 block w-full resize-none rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none transition focus:border-[var(--dark)]" /></label>
      <label className="block text-sm font-semibold">Tech stack <span className="font-normal text-[var(--muted)]">(pisahkan dengan koma)</span><input name="tech_stack" defaultValue={project?.stack.join(", ")} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none transition focus:border-[var(--dark)]" /></label>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold">Project image<input required={!project?.image_url} accept="image/jpeg,image/png,image/webp" name="image" type="file" onChange={handleImageChange} className="mt-2 block w-full cursor-pointer rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 text-sm font-normal file:mr-4 file:rounded-full file:border-0 file:bg-[var(--dark)] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white" /></label>
          <p className="mt-2 text-xs text-[var(--muted)]">JPG, PNG, atau WebP. Maksimal 2MB.</p>
          {fileError && <p role="alert" className="mt-2 text-sm text-red-700">{fileError}</p>}
          {preview && <div className="mt-4 aspect-[2/1] max-w-md rounded-xl bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url("${preview}")` }} aria-label="Preview gambar project" />}
        </div>
        <label className="block text-sm font-semibold">Demo URL<input name="demo_url" defaultValue={project?.demoUrl} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none transition focus:border-[var(--dark)]" /></label>
        <label className="block text-sm font-semibold">Repo URL<input name="repo_url" defaultValue={project?.repoUrl} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none transition focus:border-[var(--dark)]" /></label>
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="featured" defaultChecked={project?.featured} className="h-4 w-4 accent-[#18211b]" /> Featured project</label>
      {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
      <div className="flex flex-col-reverse gap-3 border-t border-[var(--line)] pt-6 sm:flex-row sm:justify-end">
        <Link href="/admin/dashboard" className="rounded-full border border-[var(--line)] px-6 py-3 text-center text-sm font-semibold transition hover:border-[var(--dark)]">Cancel</Link>
        <button disabled={pending} type="submit" className="rounded-full bg-[var(--dark)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Saving..." : project ? "Save changes" : "Create project"}</button>
      </div>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import type { Project } from "@/lib/dummy-data";
import { createProject, deleteProjectImage, moveProjectImage, setProjectCover, updateProject, updateProjectImage, type ActionState } from "@/app/admin/actions";
import { TagInput } from "@/components/admin/tag-input";
import { DATA_TYPES, PROJECT_DOMAINS, type ProjectImage } from "@/lib/project-types";
import { LazyMap } from "@/components/lazy-map";

const initialState: ActionState = { error: "" };
type AdminProject = Project & { id: string; image_url?: string | null; gallery?: ProjectImage[] };

export function ProjectForm({ project }: { project?: AdminProject }) {
  const action = project ? updateProject : createProject;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [preview, setPreview] = useState<string | null>(project?.image_url ?? null);
  const [fileError, setFileError] = useState("");
  const [documentError, setDocumentError] = useState("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryCaptions, setGalleryCaptions] = useState<string[]>([]);
  const [latitude, setLatitude] = useState<number | "">(project?.latitude ?? "");
  const [longitude, setLongitude] = useState<number | "">(project?.longitude ?? "");

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

  function handleDocumentChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setDocumentError("");
    if (!file) return;
    if (file.type !== "application/pdf") {
      event.target.value = "";
      setDocumentError("Dokumen harus berformat PDF.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      event.target.value = "";
      setDocumentError("Ukuran dokumen maksimal 5MB.");
    }

  }

  function handleGalleryChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setGalleryFiles(files);
    setGalleryCaptions(files.map(() => ""));
  }

  return (
    <form action={formAction} encType="multipart/form-data" className="space-y-6 rounded-2xl bg-white p-6 sm:p-8">
      {project && <input type="hidden" name="id" value={project.id} />}
      <input type="hidden" name="existing_image_url" value={project?.image_url ?? ""} />
      <input type="hidden" name="existing_doc_url" value={project?.docUrl ?? ""} />
      <input type="hidden" name="existing_doc_name" value={project?.docName ?? ""} />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">Title<input required name="title" defaultValue={project?.title} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none transition focus:border-[var(--dark)]" /></label>
        <label className="block text-sm font-semibold">Slug<input required name="slug" defaultValue={project?.slug} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none transition focus:border-[var(--dark)]" /></label>
      </div>
      <label className="block text-sm font-semibold">Description<textarea required name="description" rows={4} defaultValue={project?.description} className="mt-2 block w-full resize-none rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none transition focus:border-[var(--dark)]" /></label>
      <label className="block text-sm font-semibold">Tech stack <span className="font-normal text-[var(--muted)]">(pisahkan dengan koma)</span><input name="tech_stack" defaultValue={project?.stack.join(", ")} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none transition focus:border-[var(--dark)]" /></label>
      <section className="space-y-5 border-t border-[var(--line)] pt-6">
        <h2 className="display-font text-3xl font-bold">Case Study</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold">Role<input name="role" defaultValue={project?.role ?? ""} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none focus:border-[var(--dark)]" /></label>
          <label className="block text-sm font-semibold">Duration<input name="duration" defaultValue={project?.duration ?? ""} placeholder="Jan 2022 - Mar 2024" className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none focus:border-[var(--dark)]" /></label>
          <label className="block text-sm font-semibold">Study area<input name="study_area" defaultValue={project?.studyArea ?? ""} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none focus:border-[var(--dark)]" /></label>
          <label className="block text-sm font-semibold">Domain<select name="domain" defaultValue={project?.domain ?? ""} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-white px-3 py-3 font-normal outline-none focus:border-[var(--dark)]"><option value="">Pilih domain</option>{PROJECT_DOMAINS.map((domain) => <option key={domain}>{domain}</option>)}</select></label>
          <label className="block text-sm font-semibold">Data type<select name="data_type" defaultValue={project?.dataType ?? ""} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-white px-3 py-3 font-normal outline-none focus:border-[var(--dark)]"><option value="">Pilih data type</option>{DATA_TYPES.map((dataType) => <option key={dataType}>{dataType}</option>)}</select></label>
        </div>
        <div className="grid gap-5 sm:grid-cols-2"><TagInput name="methods" label="Methods" initialTags={project?.methods ?? []} suggestions={["Seismic", "Gravity", "Magnetic", "Resistivity/IP", "GPR", "EM/MT", "Well Log"]} /><TagInput name="software" label="Software" initialTags={project?.software ?? []} suggestions={["Petrel", "Oasis montaj", "Surfer", "Res2DInv", "OpendTect", "QGIS", "Python", "MATLAB"]} /></div>
        <label className="block text-sm font-semibold">Objective<textarea name="objective" rows={3} defaultValue={project?.objective ?? ""} className="mt-2 block w-full resize-y rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none focus:border-[var(--dark)]" /></label>
        <label className="block text-sm font-semibold">Workflow<textarea name="workflow" rows={4} defaultValue={project?.workflow ?? ""} className="mt-2 block w-full resize-y rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none focus:border-[var(--dark)]" /></label>
        <label className="block text-sm font-semibold">Result<textarea name="result" rows={4} defaultValue={project?.result ?? ""} className="mt-2 block w-full resize-y rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none focus:border-[var(--dark)]" /></label>
        <label className="block text-sm font-semibold">Conclusion<textarea name="conclusion" rows={3} defaultValue={project?.conclusion ?? ""} className="mt-2 block w-full resize-y rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none focus:border-[var(--dark)]" /></label>
        <div className="space-y-4"><h3 className="text-sm font-semibold">Lokasi studi</h3><div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-semibold">Latitude<input name="latitude" type="number" step="any" min="-90" max="90" value={latitude} onChange={(event) => setLatitude(event.target.value === "" ? "" : Number(event.target.value))} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none focus:border-[var(--dark)]" /></label><label className="block text-sm font-semibold">Longitude<input name="longitude" type="number" step="any" min="-180" max="180" value={longitude} onChange={(event) => setLongitude(event.target.value === "" ? "" : Number(event.target.value))} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none focus:border-[var(--dark)]" /></label></div><p className="text-xs text-[var(--muted)]">Klik peta untuk mengisi koordinat.</p><LazyMap selected={latitude !== "" && longitude !== "" ? [latitude, longitude] : undefined} onSelect={(nextLatitude, nextLongitude) => { setLatitude(Number(nextLatitude.toFixed(6))); setLongitude(Number(nextLongitude.toFixed(6))); }} /></div>
      </section>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold">Project image<input required={!project?.image_url} accept="image/jpeg,image/png,image/webp" name="image" type="file" onChange={handleImageChange} className="mt-2 block w-full cursor-pointer rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 text-sm font-normal file:mr-4 file:rounded-full file:border-0 file:bg-[var(--dark)] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white" /></label>
          <p className="mt-2 text-xs text-[var(--muted)]">JPG, PNG, atau WebP. Maksimal 2MB.</p>
          {fileError && <p role="alert" className="mt-2 text-sm text-red-700">{fileError}</p>}
          {preview && <div className="mt-4 aspect-[2/1] max-w-md rounded-xl bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url("${preview}")` }} aria-label="Preview gambar project" />}
        </div>
        <section className="space-y-4 border-t border-[var(--line)] pt-6">
          <h2 className="display-font text-3xl font-bold">Gallery</h2>
          <p className="text-xs text-[var(--muted)]">JPG, PNG, atau WebP. Maksimal 3MB per file.</p>
          <input name="gallery_images" type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={handleGalleryChange} className="block w-full cursor-pointer rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 text-sm" />
          {galleryFiles.map((file, index) => <label key={`${file.name}-${index}`} className="block text-sm font-semibold">{file.name}<input name="gallery_caption" value={galleryCaptions[index] ?? ""} onChange={(event) => setGalleryCaptions(galleryCaptions.map((caption, captionIndex) => captionIndex === index ? event.target.value : caption))} placeholder="Penampang resistivitas 2D" className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-2 font-normal" /></label>)}
          {project?.gallery && project.gallery.length > 0 && <div className="space-y-3">{project.gallery.map((image, index) => <div key={image.id} className="flex flex-col gap-3 rounded-xl border border-[var(--line)] p-3 sm:flex-row sm:items-center"><Image src={image.image_url} alt={image.caption ?? "Gallery image"} width={128} height={80} className="h-20 w-32 rounded-lg object-cover" /><form action={updateProjectImage} className="flex flex-1 gap-2"><input type="hidden" name="id" value={project.id} /><input type="hidden" name="image_id" value={image.id} /><input type="hidden" name="slug" value={project.slug} /><input name="caption" defaultValue={image.caption ?? ""} className="min-w-0 flex-1 rounded-lg border border-[var(--line)] px-3 py-2 text-sm" /><button className="text-sm font-semibold">Simpan</button></form><div className="flex flex-wrap gap-3 text-sm"><form action={setProjectCover}><input type="hidden" name="id" value={project.id} /><input type="hidden" name="image_id" value={image.id} /><input type="hidden" name="slug" value={project.slug} /><button className="font-semibold text-[var(--dark)]">{project.image_url === image.image_url ? "Cover aktif" : "Jadikan cover"}</button></form><form action={moveProjectImage}><input type="hidden" name="id" value={project.id} /><input type="hidden" name="image_id" value={image.id} /><input type="hidden" name="slug" value={project.slug} /><input type="hidden" name="direction" value="up" /><button disabled={index === 0} className="disabled:opacity-30">↑</button></form><form action={moveProjectImage}><input type="hidden" name="id" value={project.id} /><input type="hidden" name="image_id" value={image.id} /><input type="hidden" name="slug" value={project.slug} /><input type="hidden" name="direction" value="down" /><button disabled={index === project.gallery!.length - 1} className="disabled:opacity-30">↓</button></form><form action={deleteProjectImage}><input type="hidden" name="id" value={project.id} /><input type="hidden" name="image_id" value={image.id} /><input type="hidden" name="image_path" value={image.image_path} /><input type="hidden" name="slug" value={project.slug} /><button className="text-red-700">Hapus</button></form></div></div>)}</div>}
        </section>
        <label className="block text-sm font-semibold">Demo URL<input name="demo_url" defaultValue={project?.demoUrl} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none transition focus:border-[var(--dark)]" /></label>
        <label className="block text-sm font-semibold">Repo URL<input name="repo_url" defaultValue={project?.repoUrl} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none transition focus:border-[var(--dark)]" /></label>
        <label className="block text-sm font-semibold">Notebook URL<input name="notebook_url" type="url" placeholder="https://..." defaultValue={project?.notebookUrl ?? ""} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none focus:border-[var(--dark)]" /></label>
        <label className="block text-sm font-semibold">Dataset URL<input name="dataset_url" type="url" placeholder="https://..." defaultValue={project?.datasetUrl ?? ""} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none focus:border-[var(--dark)]" /></label>
      </div>
      <div className="space-y-3 border-t border-[var(--line)] pt-6">
        <label className="block text-sm font-semibold">Project document (PDF)<input name="document" type="file" accept="application/pdf" onChange={handleDocumentChange} className="mt-2 block w-full cursor-pointer rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 text-sm font-normal file:mr-4 file:rounded-full file:border-0 file:bg-[var(--dark)] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white" /></label>
        <p className="text-xs text-[var(--muted)]">PDF, maksimal 5MB. Upload file baru akan mengganti dokumen lama.</p>
        {documentError && <p role="alert" className="text-sm text-red-700">{documentError}</p>}
        {project?.docUrl && <div className="flex flex-wrap items-center gap-4 rounded-lg border border-[var(--line)] p-3 text-sm"><a href={project.docUrl} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">{project.docName ?? "Lihat dokumen lama"} ↗</a><label className="flex items-center gap-2 text-red-700"><input type="checkbox" name="remove_document" className="h-4 w-4" /> Hapus dokumen lama</label></div>}
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

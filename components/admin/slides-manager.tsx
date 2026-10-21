"use client";

import Image from "next/image";
import { useActionState } from "react";
import { useState, useTransition } from "react";
import { deleteSlide, moveSlide, updateSlide, uploadSlides, type SlidesActionState } from "@/app/admin/slides/actions";
import type { HeroSlide } from "@/lib/slide-types";
import { removeBrowserFiles, uploadBrowserFile } from "@/lib/client-upload";

const initialState: SlidesActionState = { error: "", success: "" };

function SlideRow({ slide, index, total }: { slide: HeroSlide; index: number; total: number }) {
  const [state, formAction, pending] = useActionState(updateSlide, initialState);

  return (
    <div className="rounded-2xl bg-white p-5">
      <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
        <Image src={slide.image_url} alt={slide.caption || "Hero slide"} width={180} height={110} className="aspect-video w-full rounded-xl object-cover" />
        <div className="space-y-4">
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="id" value={slide.id} />
            <label className="block text-sm font-semibold">Caption<textarea name="caption" rows={2} defaultValue={slide.caption ?? ""} className="mt-2 block w-full resize-y rounded-lg border border-[var(--line)] bg-transparent px-3 py-2 font-normal outline-none focus:border-[var(--dark)]" /></label>
            <label className="block text-sm font-semibold">Link URL<input name="link_url" type="url" placeholder="https://..." defaultValue={slide.link_url ?? ""} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-2 font-normal outline-none focus:border-[var(--dark)]" /></label>
            <div className="flex flex-wrap items-center gap-4"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="is_active" defaultChecked={slide.is_active} className="h-4 w-4 accent-[#18211b]" /> Aktif</label><button disabled={pending} type="submit" className="rounded-full bg-[var(--dark)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Saving..." : "Save"}</button></div>
            {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
            {state.success && <p role="status" className="text-sm text-[#627a34]">{state.success}</p>}
          </form>
          <div className="flex flex-wrap items-center gap-4 border-t border-[var(--line)] pt-4 text-sm">
            <form action={moveSlide}><input type="hidden" name="id" value={slide.id} /><input type="hidden" name="direction" value="up" /><button disabled={index === 0} className="disabled:opacity-30" title="Move up">↑ Move up</button></form>
            <form action={moveSlide}><input type="hidden" name="id" value={slide.id} /><input type="hidden" name="direction" value="down" /><button disabled={index === total - 1} className="disabled:opacity-30" title="Move down">↓ Move down</button></form>
            <form action={deleteSlide}><input type="hidden" name="id" value={slide.id} /><input type="hidden" name="image_path" value={slide.image_path} /><button className="text-red-700 hover:underline">Delete slide</button></form>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SlidesManager({ slides }: { slides: HeroSlide[] }) {
  const [state, formAction, pending] = useActionState(uploadSlides, initialState);
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [preserveQuality, setPreserveQuality] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploading(true); setError(""); setProgress(0);
    const paths: string[] = [];
    try {
      const data = new FormData(event.currentTarget);
      const files = data.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
      const uploaded = [];
      for (const file of files) {
        const result = await uploadBrowserFile(file, "hero", { compressImage: true, preserveQuality, onProgress: setProgress });
        paths.push(result.path); uploaded.push(result);
      }
      data.delete("images"); data.set("uploaded_images", JSON.stringify(uploaded));
      startTransition(() => formAction(data));
    } catch (uploadError) {
      await removeBrowserFiles(paths);
      setError(uploadError instanceof Error ? uploadError.message : "Slide upload failed.");
    } finally { setUploading(false); }
  }
  return (
    <div className="space-y-8">
      <form onSubmit={handleUpload} encType="multipart/form-data" className="rounded-2xl bg-white p-6 sm:p-8">
        <h2 className="display-font text-3xl font-bold">Add slides</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Select one or more images. JPG, PNG, or WebP, maximum 50MB per file. Kompresi otomatis sekitar 3MB.</p>
        <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={preserveQuality} onChange={(event) => setPreserveQuality(event.target.checked)} /> Keep original quality</label>
        <input required name="images" type="file" multiple accept="image/jpeg,image/png,image/webp" className="mt-5 block w-full cursor-pointer rounded-lg border border-[var(--line)] px-3 py-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-[var(--dark)] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white" />
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        {(uploading || pending) && <p className="mt-4 text-sm text-[var(--muted)]">Uploading... {progress}%</p>}
        <button disabled={isPending || pending || uploading} type="submit" className="mt-5 rounded-full bg-[var(--dark)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{uploading ? "Uploading..." : isPending || pending ? "Saving..." : "Upload slides"}</button>
        {state.error && <p role="alert" className="mt-4 text-sm text-red-700">{state.error}</p>}
        {state.success && <p role="status" className="mt-4 text-sm text-[#627a34]">{state.success}</p>}
      </form>
      {slides.length === 0 ? <p className="rounded-2xl bg-white p-8 text-sm text-[var(--muted)]">No slides yet.</p> : <div className="space-y-5">{slides.map((slide, index) => <SlideRow key={slide.id} slide={slide} index={index} total={slides.length} />)}</div>}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProjectImage } from "@/lib/project-types";

export function ProjectLightbox({ images }: { images: ProjectImage[] }) {
  const [selected, setSelected] = useState<ProjectImage | null>(null);
  return <>
    <div className="mt-6 grid gap-5 sm:grid-cols-2">{images.map((image) => <button key={image.id} type="button" onClick={() => setSelected(image)} className="group text-left"><div className="relative aspect-video overflow-hidden rounded-2xl bg-[var(--dark)]"><Image src={image.image_url} alt={image.caption || "Project gallery"} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" /></div>{image.caption && <p className="mt-3 text-sm text-[var(--muted)]">{image.caption}</p>}</button>)}</div>
    {selected && <div role="dialog" aria-modal="true" aria-label="Project image preview" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5" onClick={() => setSelected(null)}><div className="relative h-[80vh] w-full max-w-5xl" onClick={(event) => event.stopPropagation()}><Image src={selected.image_url} alt={selected.caption || "Project gallery"} fill sizes="90vw" className="object-contain" /><button type="button" onClick={() => setSelected(null)} aria-label="Tutup preview" className="absolute right-0 top-0 rounded-full bg-white px-4 py-2 text-black">×</button></div></div>}
  </>;
}

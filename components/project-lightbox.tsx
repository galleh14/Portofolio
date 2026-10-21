"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from "react";
import type { ProjectImage } from "@/lib/project-types";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

export function ProjectLightbox({ images }: { images: ProjectImage[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const dragStart = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const pinchStart = useRef({ distance: 0, zoom: MIN_ZOOM });

  const selected = selectedIndex === null ? null : images[selectedIndex];

  useEffect(() => {
    if (selectedIndex === null) return;
    lastFocusedRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      lastFocusedRef.current?.focus();
    };
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "Tab") {
        const focusable = Array.from(document.querySelectorAll<HTMLElement>("[data-lightbox-focus]"));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  function move(direction: number) {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + direction + images.length) % images.length);
    resetView();
  }

  function resetView() {
    setZoom(MIN_ZOOM);
    setOffset({ x: 0, y: 0 });
  }

  function open(index: number) {
    lastFocusedRef.current = document.activeElement as HTMLElement;
    setSelectedIndex(index);
    resetView();
  }

  function changeZoom(delta: number) {
    setZoom((value) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value + delta)));
    if (zoom + delta <= MIN_ZOOM) setOffset({ x: 0, y: 0 });
  }

  function handleWheel(event: ReactWheelEvent<HTMLDivElement>) {
    event.preventDefault();
    changeZoom(event.deltaY < 0 ? 0.25 : -0.25);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 1) {
      dragStart.current = { x: event.clientX, y: event.clientY, offsetX: offset.x, offsetY: offset.y };
    } else if (pointers.current.size === 2) {
      const [first, second] = Array.from(pointers.current.values());
      pinchStart.current = { distance: Math.hypot(first.x - second.x, first.y - second.y), zoom };
    }
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size >= 2) {
      const [first, second] = Array.from(pointers.current.values());
      const distance = Math.hypot(first.x - second.x, first.y - second.y);
      if (pinchStart.current.distance > 0) setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, pinchStart.current.zoom * distance / pinchStart.current.distance)));
      return;
    }
    const dx = event.clientX - dragStart.current.x;
    const dy = event.clientY - dragStart.current.y;
    if (zoom > MIN_ZOOM) setOffset({ x: dragStart.current.offsetX + dx, y: dragStart.current.offsetY + dy });
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const startX = dragStart.current.x;
    const deltaX = event.clientX - startX;
    pointers.current.delete(event.pointerId);
    if (pointers.current.size === 0 && zoom === MIN_ZOOM && Math.abs(deltaX) > 60) move(deltaX < 0 ? 1 : -1);
  }

  return (
    <>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {images.map((image, index) => (
          <button key={image.id} type="button" onClick={() => open(index)} className="group text-left" aria-label={`Open image ${index + 1} of ${images.length}`}>
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-[var(--dark)]"><Image src={image.image_url} alt={image.caption || "Project gallery image"} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" /></div>
            {image.caption && <p className="mt-3 text-sm text-[var(--muted)]">{image.caption}</p>}
          </button>
        ))}
      </div>
      {selected && selectedIndex !== null && (
        <div role="dialog" aria-modal="true" aria-label="Project image preview" className="fixed inset-0 z-50 flex flex-col bg-black/95 p-4 text-white sm:p-6" onClick={() => setSelectedIndex(null)}>
          <div className="flex items-center justify-between"><p className="text-sm text-white/70">{selectedIndex + 1} / {images.length}</p><div className="flex items-center gap-2"><button data-lightbox-focus type="button" onClick={(event) => { event.stopPropagation(); changeZoom(-0.5); }} aria-label="Zoom out" className="rounded-full bg-white/10 px-3 py-2 text-lg hover:bg-white/20">−</button><button data-lightbox-focus type="button" onClick={(event) => { event.stopPropagation(); changeZoom(0.5); }} aria-label="Zoom in" className="rounded-full bg-white/10 px-3 py-2 text-lg hover:bg-white/20">+</button><button data-lightbox-focus ref={closeButtonRef} type="button" onClick={() => setSelectedIndex(null)} aria-label="Close preview" className="rounded-full bg-white px-3 py-2 text-xl text-black">×</button></div></div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center" onClick={(event) => event.stopPropagation()} onWheel={handleWheel} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} onDoubleClick={() => changeZoom(zoom === MIN_ZOOM ? 1 : -1)} style={{ touchAction: "none" }}>
            <Image src={selected.image_url} alt={selected.caption || "Project gallery image"} fill sizes="95vw" priority className="select-none object-contain" draggable={false} style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`, transition: pointers.current.size ? "none" : "transform 160ms ease" }} />
            {images.length > 1 && <><button data-lightbox-focus type="button" onClick={() => move(-1)} aria-label="Previous image" className="absolute left-0 rounded-full bg-white/10 px-4 py-3 text-2xl hover:bg-white/20">‹</button><button data-lightbox-focus type="button" onClick={() => move(1)} aria-label="Next image" className="absolute right-0 rounded-full bg-white/10 px-4 py-3 text-2xl hover:bg-white/20">›</button></>}
          </div>
          <div className="min-h-10 pt-3 text-center text-sm text-white/80">{selected.caption}</div>
          {images[(selectedIndex + 1) % images.length] && <Image src={images[(selectedIndex + 1) % images.length].image_url} alt="" width={1} height={1} className="hidden" priority />}
        </div>
      )}
    </>
  );
}

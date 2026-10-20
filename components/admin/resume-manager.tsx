"use client";

import { useState } from "react";
import { useActionState } from "react";
import { deleteResumeItem, moveResumeItem, saveResumeItem, toggleResumeItem, type ResumeActionState } from "@/app/admin/resume/actions";
import { RESUME_CATEGORIES, RESUME_CATEGORY_LABELS, formatResumePeriod, type ResumeCategory, type ResumeItem } from "@/lib/resume-types";

const initialState: ResumeActionState = { error: "", success: false };

function dateValue(value: string | null) {
  return value ?? "";
}

function ResumeItemForm({ category, item, onCancel }: { category: ResumeCategory; item: ResumeItem | null; onCancel: () => void }) {
  const [state, formAction, pending] = useActionState(saveResumeItem, initialState);
  const [isCurrent, setIsCurrent] = useState(item?.is_current ?? false);
  const isDated = category !== "skill";
  const hasOrganization = category !== "skill";
  const hasUrl = category === "publication" || category === "certification";

  return (
    <form key={item?.id ?? `new-${category}`} action={formAction} encType="multipart/form-data" className="space-y-5 rounded-2xl border border-[var(--line)] bg-[var(--background)] p-5">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="existing_file_url" value={item?.file_url ?? ""} />
      <input type="hidden" name="existing_file_path" value={item?.file_path ?? ""} />
      <div className="flex items-center justify-between gap-4"><h3 className="display-font text-2xl font-bold">{item ? "Edit item" : "Tambah item"}</h3><button type="button" onClick={onCancel} className="text-sm text-[var(--muted)]">Batal</button></div>
      <label className="block text-sm font-semibold">Title<input required name="title" defaultValue={item?.title ?? ""} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-white px-3 py-3 font-normal outline-none focus:border-[var(--dark)]" /></label>
      {hasOrganization && <div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-semibold">Organization<input name="organization" defaultValue={item?.organization ?? ""} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-white px-3 py-3 font-normal outline-none focus:border-[var(--dark)]" /></label><label className="block text-sm font-semibold">Location<input name="location" defaultValue={item?.location ?? ""} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-white px-3 py-3 font-normal outline-none focus:border-[var(--dark)]" /></label></div>}
      {isDated && <div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-semibold">Start date<input type="date" name="start_date" defaultValue={dateValue(item?.start_date ?? null)} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-white px-3 py-3 font-normal outline-none focus:border-[var(--dark)]" /></label><label className="block text-sm font-semibold">End date<input type="date" name="end_date" defaultValue={dateValue(item?.end_date ?? null)} disabled={isCurrent} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-white px-3 py-3 font-normal outline-none disabled:opacity-50" /></label><label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2"><input type="checkbox" name="is_current" checked={isCurrent} onChange={(event) => setIsCurrent(event.target.checked)} className="h-4 w-4 accent-[#18211b]" /> Masih berlangsung</label></div>}
      {(category !== "skill") && <label className="block text-sm font-semibold">Description<textarea name="description" rows={4} defaultValue={item?.description ?? ""} className="mt-2 block w-full resize-y rounded-lg border border-[var(--line)] bg-white px-3 py-3 font-normal outline-none focus:border-[var(--dark)]" /></label>}
      {hasUrl && <label className="block text-sm font-semibold">URL<input name="url" type="url" placeholder="https://..." defaultValue={item?.url ?? ""} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-white px-3 py-3 font-normal outline-none focus:border-[var(--dark)]" /></label>}
      {category === "certification" && <><label className="block text-sm font-semibold">Credential ID<input name="credential_id" defaultValue={item?.credential_id ?? ""} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-white px-3 py-3 font-normal outline-none focus:border-[var(--dark)]" /></label><label className="block text-sm font-semibold">File sertifikat<input name="file" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-white px-3 py-3 text-sm font-normal" /><span className="mt-2 block text-xs font-normal text-[var(--muted)]">PDF, JPG, PNG, WebP. Maksimal 5MB.{item?.file_url ? ` File saat ini tersedia.` : ""}</span></label></>}
      <div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-semibold">Urutan<input type="number" name="sort_order" defaultValue={item?.sort_order ?? 0} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-white px-3 py-3 font-normal outline-none focus:border-[var(--dark)]" /></label><label className="flex items-center gap-2 self-end pb-3 text-sm font-semibold"><input type="checkbox" name="is_visible" defaultChecked={item?.is_visible ?? true} className="h-4 w-4 accent-[#18211b]" /> Tampilkan di publik</label></div>
      {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
      {state.success && <p role="status" className="text-sm text-[#627a34]">Item berhasil disimpan.</p>}
      <button disabled={pending} type="submit" className="rounded-full bg-[var(--dark)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Menyimpan..." : "Simpan item"}</button>
    </form>
  );
}

export function ResumeManager({ items }: { items: ResumeItem[] }) {
  const [category, setCategory] = useState<ResumeCategory>("experience");
  const [editing, setEditing] = useState<ResumeItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const visibleItems = items.filter((item) => item.category === category);

  function startNew() {
    setEditing(null);
    setFormOpen(true);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <div className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2">
        {RESUME_CATEGORIES.map((itemCategory) => <button key={itemCategory} type="button" onClick={() => { setCategory(itemCategory); setEditing(null); setFormOpen(false); }} className={`whitespace-nowrap rounded-full px-4 py-2 text-left text-sm font-semibold transition lg:block lg:w-full ${category === itemCategory ? "bg-[var(--dark)] text-white" : "bg-white text-[var(--muted)] hover:text-[var(--foreground)]"}`}>{RESUME_CATEGORY_LABELS[itemCategory]}</button>)}
      </div>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4"><div><p className="eyebrow">{RESUME_CATEGORY_LABELS[category]}</p><h2 className="display-font mt-2 text-3xl font-bold">{visibleItems.length} item</h2></div><button type="button" onClick={startNew} className="rounded-full bg-[var(--dark)] px-5 py-3 text-sm font-semibold text-white">Tambah +</button></div>
        {formOpen && <ResumeItemForm category={category} item={editing} onCancel={() => setFormOpen(false)} />}
        {!formOpen && visibleItems.length === 0 && <p className="rounded-2xl bg-white p-8 text-sm text-[var(--muted)]">Belum ada item di kategori ini.</p>}
        {!formOpen && visibleItems.map((item, index) => <div key={item.id} className="rounded-2xl bg-white p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{item.title}</h3><span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${item.is_visible ? "bg-[#eff9d7] text-[#627a34]" : "bg-[#f2f2f2] text-[var(--muted)]"}`}>{item.is_visible ? "Tampil" : "Sembunyi"}</span></div><p className="mt-1 text-sm text-[var(--muted)]">{item.organization}{item.organization && item.location ? " · " : ""}{item.location}</p><p className="mt-1 text-xs text-[var(--muted)]">{formatResumePeriod(item)}</p></div><div className="flex flex-wrap items-center gap-3 text-sm"><form action={moveResumeItem}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="category" value={category} /><input type="hidden" name="direction" value="up" /><button disabled={index === 0} className="disabled:opacity-30" title="Naik">↑</button></form><form action={moveResumeItem}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="category" value={category} /><input type="hidden" name="direction" value="down" /><button disabled={index === visibleItems.length - 1} className="disabled:opacity-30" title="Turun">↓</button></form><button type="button" onClick={() => { setEditing(item); setFormOpen(true); }} className="font-semibold hover:underline">Edit</button><form action={toggleResumeItem}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="is_visible" value={String(item.is_visible)} /><button className="hover:underline">{item.is_visible ? "Sembunyikan" : "Tampilkan"}</button></form><form action={deleteResumeItem}><input type="hidden" name="id" value={item.id} /><button className="text-red-700 hover:underline">Hapus</button></form></div></div></div>)}
      </div>
    </div>
  );
}

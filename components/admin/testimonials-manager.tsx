"use client";

import Image from "next/image";
import { useActionState } from "react";
import { createTestimonial, deleteTestimonial, moveTestimonial, updateTestimonial, type TestimonialsActionState } from "@/app/admin/testimonials/actions";
import type { Testimonial } from "@/lib/testimonial-types";

const initialState: TestimonialsActionState = { error: "", success: "" };

function TestimonialRow({ item, index, total }: { item: Testimonial; index: number; total: number }) {
  const [state, formAction, pending] = useActionState(updateTestimonial, initialState);
  return (
    <div className="rounded-2xl bg-white p-5">
      <form action={formAction} encType="multipart/form-data" className="grid gap-5 lg:grid-cols-[100px_1fr]">
        <div>
          {item.photo_url ? <Image src={item.photo_url} alt={item.name} width={100} height={100} className="aspect-square w-full rounded-full object-cover" /> : <div className="flex aspect-square items-center justify-center rounded-full bg-[var(--dark)] text-2xl font-bold text-white">{item.name.charAt(0).toUpperCase()}</div>}
        </div>
        <div className="space-y-4">
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="existing_photo_path" value={item.photo_path ?? ""} />
          <label className="block text-sm font-semibold">Quote<textarea required name="quote" rows={3} defaultValue={item.quote} className="mt-2 block w-full resize-y rounded-lg border border-[var(--line)] bg-transparent px-3 py-2 font-normal outline-none focus:border-[var(--dark)]" /></label>
          <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Nama<input required name="name" defaultValue={item.name} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-2 font-normal outline-none focus:border-[var(--dark)]" /></label><label className="block text-sm font-semibold">Posisi<input name="position" defaultValue={item.position ?? ""} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-2 font-normal outline-none focus:border-[var(--dark)]" /></label></div>
          <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Organisasi<input name="organization" defaultValue={item.organization ?? ""} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-2 font-normal outline-none focus:border-[var(--dark)]" /></label><label className="block text-sm font-semibold">Urutan<input name="sort_order" type="number" defaultValue={item.sort_order} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-2 font-normal outline-none focus:border-[var(--dark)]" /></label></div>
          <label className="block text-sm font-semibold">Ganti foto<input name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-normal" /></label>
          <div className="flex flex-wrap items-center gap-4"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="is_visible" defaultChecked={item.is_visible} className="h-4 w-4 accent-[#18211b]" /> Tampilkan</label><button disabled={pending} type="submit" className="rounded-full bg-[var(--dark)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Menyimpan..." : "Simpan"}</button></div>
          {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}{state.success && <p role="status" className="text-sm text-[#627a34]">{state.success}</p>}
        </div>
      </form>
      <div className="mt-4 flex flex-wrap gap-4 border-t border-[var(--line)] pt-4 text-sm"><form action={moveTestimonial}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="direction" value="up" /><button disabled={index === 0} className="disabled:opacity-30">↑ Naik</button></form><form action={moveTestimonial}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="direction" value="down" /><button disabled={index === total - 1} className="disabled:opacity-30">↓ Turun</button></form><form action={deleteTestimonial}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="photo_path" value={item.photo_path ?? ""} /><button className="text-red-700 hover:underline">Hapus</button></form></div>
    </div>
  );
}

export function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] }) {
  const [state, formAction, pending] = useActionState(createTestimonial, initialState);
  return <div className="space-y-8"><form action={formAction} encType="multipart/form-data" className="rounded-2xl bg-white p-6 sm:p-8"><h2 className="display-font text-3xl font-bold">Tambah testimonial</h2><div className="mt-5 space-y-4"><label className="block text-sm font-semibold">Quote<textarea required name="quote" rows={3} className="mt-2 block w-full resize-y rounded-lg border border-[var(--line)] bg-transparent px-3 py-2 font-normal outline-none focus:border-[var(--dark)]" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Nama<input required name="name" className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-2 font-normal outline-none focus:border-[var(--dark)]" /></label><label className="block text-sm font-semibold">Posisi<input name="position" className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-2 font-normal outline-none focus:border-[var(--dark)]" /></label><label className="block text-sm font-semibold">Organisasi<input name="organization" className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-2 font-normal outline-none focus:border-[var(--dark)]" /></label><label className="block text-sm font-semibold">Urutan<input name="sort_order" type="number" defaultValue="0" className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-2 font-normal outline-none focus:border-[var(--dark)]" /></label></div><label className="block text-sm font-semibold">Foto (opsional)<input name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-normal" /><span className="mt-2 block text-xs font-normal text-[var(--muted)]">JPG, PNG, atau WebP. Maksimal 2MB.</span></label><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="is_visible" defaultChecked className="h-4 w-4 accent-[#18211b]" /> Tampilkan</label><button disabled={pending} type="submit" className="rounded-full bg-[var(--dark)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Menyimpan..." : "Tambah testimonial"}</button>{state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}{state.success && <p role="status" className="text-sm text-[#627a34]">{state.success}</p>}</div></form>{testimonials.length === 0 ? <p className="rounded-2xl bg-white p-8 text-sm text-[var(--muted)]">Belum ada testimonial.</p> : <div className="space-y-5">{testimonials.map((item, index) => <TestimonialRow key={item.id} item={item} index={index} total={testimonials.length} />)}</div>}</div>;
}

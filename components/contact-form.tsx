"use client";

import { useActionState } from "react";
import { submitContact, type ContactActionState } from "@/app/contact/actions";

export function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactActionState, FormData>(
    submitContact,
    { error: "", success: false },
  );

  if (state.success) {
    return (
      <div className="rounded-2xl border border-[#b9d88a] bg-[#eff9d7] p-8">
        <p className="eyebrow text-[#627a34]">Message received</p>
        <h3 className="display-font mt-3 text-3xl font-bold">Thanks for reaching out.</h3>
        <p className="mt-3 text-[var(--muted)]">Pesanmu sudah tersimpan. Saya akan segera menghubungimu kembali.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm font-semibold">Name<input required name="name" placeholder="Your name" className="mt-2 w-full border-b border-[var(--line)] bg-transparent py-3 outline-none placeholder:text-[#9ba59d] focus:border-[var(--dark)]" /></label>
        <label className="block text-sm font-semibold">Email<input required type="email" name="email" placeholder="you@email.com" className="mt-2 w-full border-b border-[var(--line)] bg-transparent py-3 outline-none placeholder:text-[#9ba59d] focus:border-[var(--dark)]" /></label>
      </div>
      <label className="block text-sm font-semibold">Tell me about your project<textarea required name="message" rows={4} placeholder="A little bit about what you have in mind..." className="mt-2 w-full resize-none border-b border-[var(--line)] bg-transparent py-3 outline-none placeholder:text-[#9ba59d] focus:border-[var(--dark)]" /></label>
      {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
      <button disabled={pending} type="submit" className="rounded-full bg-[var(--dark)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#35443a] disabled:cursor-wait disabled:opacity-60">{pending ? "Sending..." : "Send message"} <span className="ml-1">↗</span></button>
    </form>
  );
}

"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-[#b9d88a] bg-[#eff9d7] p-8">
        <p className="eyebrow text-[#627a34]">Message received</p>
        <h3 className="display-font mt-3 text-3xl font-bold">Thanks for reaching out.</h3>
        <p className="mt-3 text-[var(--muted)]">Ini masih demo frontend, tapi pesanmu sudah berhasil tervalidasi.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm font-semibold">Name<input required name="name" placeholder="Your name" className="mt-2 w-full border-b border-[var(--line)] bg-transparent py-3 outline-none placeholder:text-[#9ba59d] focus:border-[var(--dark)]" /></label>
        <label className="block text-sm font-semibold">Email<input required type="email" name="email" placeholder="you@email.com" className="mt-2 w-full border-b border-[var(--line)] bg-transparent py-3 outline-none placeholder:text-[#9ba59d] focus:border-[var(--dark)]" /></label>
      </div>
      <label className="block text-sm font-semibold">Tell me about your project<textarea required name="message" rows={4} placeholder="A little bit about what you have in mind..." className="mt-2 w-full resize-none border-b border-[var(--line)] bg-transparent py-3 outline-none placeholder:text-[#9ba59d] focus:border-[var(--dark)]" /></label>
      <button type="submit" className="rounded-full bg-[var(--dark)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#35443a]">Send message <span className="ml-1">↗</span></button>
    </form>
  );
}

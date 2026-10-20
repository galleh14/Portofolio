"use client";

import { useState, useTransition } from "react";
import { deleteMessage, markMessageRead, markMessageUnread } from "@/app/admin/messages/actions";
import type { Message } from "@/lib/messages";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function MessageItem({ message }: { message: Message }) {
  const [expanded, setExpanded] = useState(false);
  const [pending, startTransition] = useTransition();

  function openMessage() {
    setExpanded(true);
    if (!message.is_read) {
      const data = new FormData();
      data.set("id", message.id);
      startTransition(() => void markMessageRead(data));
    }
  }

  return (
    <article className={`rounded-2xl bg-white p-5 ${!message.is_read ? "border-l-4 border-[#829e52]" : ""}`}>
      <button type="button" onClick={openMessage} className="w-full text-left" aria-expanded={expanded}>
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
          <div><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{message.name}</h2>{!message.is_read && <span className="rounded-full bg-[#eff9d7] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#627a34]">Belum dibaca</span>}</div><p className="mt-1 text-sm text-[var(--muted)]">{message.email}</p></div>
          <time dateTime={message.created_at} className="text-xs text-[var(--muted)]">{formatDate(message.created_at)}</time>
        </div>
        {!expanded && <p className="mt-4 line-clamp-2 text-sm text-[var(--muted)]">{message.message}</p>}
      </button>
      {expanded && <div className="mt-5 border-t border-[var(--line)] pt-5"><p className="whitespace-pre-line text-sm leading-7">{message.message}</p><div className="mt-5 flex flex-wrap items-center gap-4 text-sm"><a href={`mailto:${message.email}`} className="rounded-full bg-[var(--dark)] px-4 py-2 font-semibold text-white">Balas via email</a>{message.is_read && <form action={markMessageUnread}><input type="hidden" name="id" value={message.id} /><button disabled={pending} className="font-semibold hover:underline">Tandai belum dibaca</button></form>}<form action={deleteMessage} onSubmit={(event) => { if (!window.confirm("Hapus pesan ini?")) event.preventDefault(); }}><input type="hidden" name="id" value={message.id} /><button disabled={pending} className="font-semibold text-red-700 hover:underline">Hapus</button></form></div></div>}
    </article>
  );
}

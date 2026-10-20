import Link from "next/link";
import { MessagesList } from "@/components/admin/messages-list";
import { getMessages } from "@/lib/messages";

export const metadata = { title: "Pesan" };
export const instant = false;

export default async function AdminMessagesPage() {
  const messages = await getMessages();
  return <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24"><div className="flex items-end justify-between gap-4 border-b border-[var(--line)] pb-8"><div><p className="eyebrow">Admin workspace</p><h1 className="display-font mt-3 text-5xl font-bold">Pesan.</h1></div><Link href="/admin/dashboard" className="text-sm text-[var(--muted)]">← Dashboard</Link></div><div className="mt-8">{messages.length === 0 ? <p className="rounded-2xl bg-white p-8 text-sm text-[var(--muted)]">Belum ada pesan.</p> : <MessagesList messages={messages} />}</div></div>;
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

export async function markMessageRead(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Pesan tidak ditemukan.");
  const supabase = await requireUser();
  const { error } = await supabase.from("messages").update({ is_read: true }).eq("id", id);
  if (error) throw new Error(`Pesan gagal ditandai sudah dibaca: ${error.message}`);
  revalidatePath("/admin/messages", "page");
  revalidatePath("/admin/dashboard", "page");
}

export async function markMessageUnread(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Pesan tidak ditemukan.");
  const supabase = await requireUser();
  const { error } = await supabase.from("messages").update({ is_read: false }).eq("id", id);
  if (error) throw new Error(`Pesan gagal ditandai belum dibaca: ${error.message}`);
  revalidatePath("/admin/messages", "page");
  revalidatePath("/admin/dashboard", "page");
}

export async function deleteMessage(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Pesan tidak ditemukan.");
  const supabase = await requireUser();
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) throw new Error(`Pesan gagal dihapus: ${error.message}`);
  revalidatePath("/admin/messages", "page");
  revalidatePath("/admin/dashboard", "page");
}

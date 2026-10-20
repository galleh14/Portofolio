import { createClient } from "@/lib/supabase/server";

export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export async function getMessages() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("id,name,email,message,is_read,created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Gagal memuat pesan: ${error.message}`);
  return (data ?? []) as Message[];
}

export async function getUnreadMessageCount() {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);
  if (error) throw new Error(`Gagal menghitung pesan belum dibaca: ${error.message}`);
  return count ?? 0;
}

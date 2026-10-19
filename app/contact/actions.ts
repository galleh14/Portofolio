"use server";

import { createClient } from "@/lib/supabase/server";

export type ContactActionState = {
  error: string;
  success: boolean;
};

const initialState: ContactActionState = { error: "", success: false };

export async function submitContact(
  _previousState: ContactActionState = initialState,
  formData: FormData,
): Promise<ContactActionState> {
  void _previousState;
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 2) {
    return { error: "Nama harus diisi minimal 2 karakter.", success: false };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Masukkan alamat email yang valid.", success: false };
  }

  if (message.length < 10) {
    return { error: "Pesan harus diisi minimal 10 karakter.", success: false };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({ name, email, message });

  if (error) {
    return { error: "Pesan belum terkirim. Silakan coba lagi.", success: false };
  }

  return { error: "", success: true };
}

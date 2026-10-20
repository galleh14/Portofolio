"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type ContactActionState = {
  error: string;
  success: boolean;
};

const initialState: ContactActionState = { error: "", success: false };
const requestsByIp = new Map<string, number[]>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MIN_FORM_AGE_MS = 3 * 1000;

export async function submitContact(
  _previousState: ContactActionState = initialState,
  formData: FormData,
): Promise<ContactActionState> {
  void _previousState;
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const honeypot = String(formData.get("website") ?? "").trim();
  const openedAt = Number(formData.get("opened_at") ?? 0);

  if (honeypot) return { error: "", success: true };

  if (!Number.isFinite(openedAt) || Date.now() - openedAt < MIN_FORM_AGE_MS) {
    return { error: "Tunggu beberapa detik sebelum mengirim pesan.", success: false };
  }

  if (name.length < 2 || name.length > 100) {
    return { error: "Nama harus diisi antara 2 sampai 100 karakter.", success: false };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Masukkan alamat email yang valid.", success: false };
  }

  if (message.length < 10 || message.length > 2000) {
    return { error: "Pesan harus diisi antara 10 sampai 2000 karakter.", success: false };
  }

  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown";
  const now = Date.now();
  const recentRequests = (requestsByIp.get(ip) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  if (recentRequests.length >= RATE_LIMIT) {
    return { error: "Batas pengiriman tercapai. Silakan coba lagi dalam beberapa menit.", success: false };
  }
  requestsByIp.set(ip, [...recentRequests, now]);

  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({ name, email, message });

  if (error) {
    return { error: "Pesan belum terkirim. Silakan coba lagi.", success: false };
  }

  return { error: "", success: true };
}

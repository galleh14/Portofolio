"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const { error } = await createClient().auth.signOut();
    if (error) {
      throw new Error("Logout failed. Please try again.");
    }
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={handleLogout} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
      Sign out
    </button>
  );
}

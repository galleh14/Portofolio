"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Email atau password tidak valid.");
      setLoading(false);
      return;
    }

    router.push(searchParams.get("next") || "/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block text-sm font-semibold">
        Email
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          className="mt-2 w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 outline-none focus:border-[var(--dark)]"
        />
      </label>
      <label className="block text-sm font-semibold">
        Password
        <input
          required
          type="password"
          name="password"
          autoComplete="current-password"
          className="mt-2 w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 outline-none focus:border-[var(--dark)]"
        />
      </label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button
        disabled={loading}
        type="submit"
        className="w-full rounded-full bg-[var(--dark)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#35443a] disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

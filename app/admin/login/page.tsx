import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export const metadata = { title: "Admin Login" };

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-220px)] max-w-md items-center px-5 py-16 sm:px-8">
      <div className="w-full rounded-2xl bg-white p-6 shadow-sm sm:p-10">
        <p className="eyebrow">Private workspace</p>
        <h1 className="display-font mt-3 text-4xl font-bold">Welcome back.</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Masuk untuk mengelola project portfolio.
        </p>
        <div className="mt-8">
          <Suspense fallback={<div className="h-56 animate-pulse rounded-lg bg-[var(--background)]" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

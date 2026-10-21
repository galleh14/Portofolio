"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid-overlay flex min-h-[70vh] items-center px-5 py-20 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="display-font mt-6 max-w-3xl text-6xl font-bold leading-[0.9] sm:text-8xl">This page could not be loaded.</h1>
        <p className="mt-8 max-w-md leading-7 text-[var(--muted)]">Please reload the page. If the problem continues, return to the home page.</p>
        <button type="button" onClick={() => reset()} className="mt-10 rounded-full bg-[var(--dark)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#35443a]">Try again <span className="ml-1">↻</span></button>
      </div>
    </main>
  );
}

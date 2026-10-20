function Skeleton({ className }: { className: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-[var(--line)] ${className}`} />;
}

export default function ResumeLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28" aria-label="Memuat resume" role="status">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-5 h-24 w-full max-w-4xl sm:h-32" />
      <div className="mt-20 space-y-20">
        {[1, 2].map((section) => <section key={section}><Skeleton className="h-3 w-28" /><div className="mt-6 space-y-8 border-l border-[var(--line)] pl-6"><div><Skeleton className="h-7 w-2/3" /><Skeleton className="mt-3 h-4 w-1/3" /><Skeleton className="mt-4 h-12 w-full max-w-2xl" /></div><div><Skeleton className="h-7 w-1/2" /><Skeleton className="mt-3 h-4 w-1/4" /></div></div></section>)}
      </div>
    </div>
  );
}

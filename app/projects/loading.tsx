function Skeleton({ className }: { className: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-[var(--line)] ${className}`} />;
}

export default function ProjectsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28" aria-label="Loading project list" role="status">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-5 h-24 w-full max-w-3xl sm:h-32" />
      <Skeleton className="mt-4 h-6 w-full max-w-xs" />
      <div className="mt-12 border-b border-[var(--line)] pb-6"><Skeleton className="h-10 w-48 rounded-full" /></div>
      <div className="grid gap-x-8 gap-y-16 pt-12 md:grid-cols-2">
        {[1, 2, 3, 4].map((item) => <div key={item}><Skeleton className="aspect-[1.18] w-full rounded-2xl" /><Skeleton className="mt-4 h-7 w-3/4" /><Skeleton className="mt-2 h-4 w-1/3" /></div>)}
      </div>
    </div>
  );
}

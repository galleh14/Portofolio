function Skeleton({ className }: { className: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-[var(--line)] ${className}`} />;
}

export default function ProjectDetailLoading() {
  return (
    <article aria-label="Loading project details" role="status">
      <div className="mx-auto max-w-6xl px-5 pt-16 sm:px-8 sm:pt-24">
        <Skeleton className="h-4 w-28" />
        <div className="mt-12 flex flex-col justify-between gap-8 md:flex-row md:items-end"><Skeleton className="h-24 w-full max-w-2xl sm:h-36" /><Skeleton className="h-20 w-full max-w-xs" /></div>
        <div className="mt-8 flex gap-3"><Skeleton className="h-8 w-28 rounded-full" /><Skeleton className="h-8 w-32 rounded-full" /></div>
      </div>
      <Skeleton className="mx-auto mt-16 aspect-video w-[calc(100%-2.5rem)] max-w-6xl rounded-2xl sm:w-[calc(100%-4rem)]" />
      <div className="mx-auto max-w-6xl space-y-16 px-5 py-16 sm:px-8 sm:py-24">
        <div><Skeleton className="h-3 w-24" /><Skeleton className="mt-5 h-16 w-full max-w-3xl" /></div>
        <div><Skeleton className="h-3 w-36" /><Skeleton className="mt-5 h-28 w-full max-w-3xl" /></div>
        <div><Skeleton className="h-3 w-20" /><Skeleton className="mt-5 aspect-video w-full max-w-3xl rounded-2xl" /></div>
      </div>
    </article>
  );
}

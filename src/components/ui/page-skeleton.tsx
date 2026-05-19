export function PageSkeleton({ title = "Cargando" }: { title?: string }) {
  return (
    <div className="space-y-6" aria-label={title}>
      <div className="space-y-2">
        <div className="h-7 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-2xl border bg-card" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-2xl border bg-card" />
        <div className="h-72 animate-pulse rounded-2xl border bg-card" />
      </div>
    </div>
  );
}

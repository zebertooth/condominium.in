export function ListingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6">
      <div className="h-9 w-56 rounded-lg bg-slate-200" />
      <div className="mt-3 h-5 w-80 max-w-full rounded bg-slate-100" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="aspect-[4/3] bg-slate-200" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-3/4 rounded bg-slate-200" />
              <div className="h-6 w-1/2 rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

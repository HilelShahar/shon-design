export default function LoadingWork() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* keep space for the pill nav */}
      <div className="pt-28 sm:pt-32 px-4">
        <div className="mx-auto w-full max-w-6xl">
          {/* header skeleton */}
          <div className="mb-10 text-center">
            <div className="mx-auto h-10 w-48 rounded-full bg-muted/20 animate-pulse" />
            <div className="mx-auto mt-3 h-4 w-64 rounded-full bg-muted/20 animate-pulse" />
          </div>

          {/* grid skeleton */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-border">
                <div className="relative aspect-[4/3]">
                  <div className="absolute inset-0 bg-muted/20 animate-pulse" />
                </div>
                <div className="p-4">
                  <div className="h-4 w-3/5 rounded bg-muted/20 animate-pulse" />
                  <div className="mt-2 h-3 w-16 rounded bg-muted/20 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

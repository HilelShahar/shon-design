export default function LoadingProject() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pt-28 sm:pt-32 px-4">
        <div className="mx-auto w-full max-w-4xl">
          {/* title row */}
          <div className="mb-6 flex items-center justify-between">
            <div className="h-8 w-56 rounded bg-muted/20 animate-pulse" />
            <div className="h-4 w-10 rounded bg-muted/20 animate-pulse" />
          </div>

          {/* description */}
          <div className="mb-8 space-y-2">
            <div className="h-4 w-11/12 rounded bg-muted/20 animate-pulse" />
            <div className="h-4 w-10/12 rounded bg-muted/20 animate-pulse" />
            <div className="h-4 w-9/12 rounded bg-muted/20 animate-pulse" />
          </div>

          {/* long image placeholder */}
          <div className="h-[1200px] rounded-2xl bg-muted/20 animate-pulse" />

          {/* buttons row */}
          <div className="mt-10 flex items-center justify-between">
            <div className="h-10 w-32 rounded-full bg-muted/20 animate-pulse" />
            <div className="h-10 w-40 rounded-full bg-muted/20 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

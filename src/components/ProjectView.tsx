"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  title: string;
  year?: string | number;
  description?: string;
  descriptionRtl?: boolean;
  descriptionFooter?: string;
  longImage: string;
  closeHref: string;   // e.g. "/work" or "/#work"
  overlay?: boolean;   // ← NEW (optional)
};

export default function ProjectView({
  title,
  year,
  description,
  descriptionRtl = false,
  descriptionFooter,
  longImage,
  closeHref,
  overlay = false,
}: Props) {
  const router = useRouter();
  const close = () => router.push(closeHref);

 useEffect(() => {
  if (!overlay) return;
  const original = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  // iOS Safari fix: prevent rubber-band scrolling
  const originalOB = document.documentElement.style.overscrollBehavior;
  document.documentElement.style.overscrollBehavior = "none";

  return () => {
    document.body.style.overflow = original;
    document.documentElement.style.overscrollBehavior = originalOB;
  };
}, [overlay]);


  // Clicking outside should close (both modes)
  const handleOuterClick: React.MouseEventHandler<HTMLDivElement> = () => close();
  const stop: React.MouseEventHandler<HTMLDivElement> = (e) => e.stopPropagation();

  if (overlay) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overscroll-none"
      onClick={handleOuterClick}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} project`}
    >
      {/* Close button */}
      <button
        aria-label="Close"
        onClick={(e) => { e.stopPropagation(); close(); }}
        className="fixed right-4 top-4 z-[60] rounded-full border border-white/20 px-3 py-1 text-sm hover:bg-white/10"
      >
        ✕
      </button>

      {/* Scrollable content area */}
      <div
        className="absolute inset-0 mx-auto max-w-4xl w-full px-4 py-16 sm:py-20 overflow-y-auto"
        onClick={stop}
      >
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif">{title}</h1>
          {year && <span className="text-sm text-muted-foreground">{year}</span>}
        </header>

        {description && (
          <div className="mb-8" dir={descriptionRtl ? "rtl" : undefined}>
            <p className="text-muted-foreground whitespace-pre-line">{description}</p>
            {descriptionFooter && (
              <p className="mt-4 text-xs text-muted-foreground/70">{descriptionFooter}</p>
            )}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-border bg-muted/30">
          {/* Native img for progressive JPEG loading (top-to-bottom reveal) */}
          <img
            src={longImage}
            alt={title}
            loading="eager"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
}

  // Original full-page version
  return (
    <div className="min-h-screen bg-background text-foreground" onClick={handleOuterClick}>
      <button
        aria-label="Close"
        onClick={(e) => { e.stopPropagation(); close(); }}
        className="fixed right-4 top-4 z-50 rounded-full border border-white/20 px-3 py-1 text-sm hover:bg-white/10"
      >
        ✕
      </button>

      <section className="px-4 pt-28 sm:pt-32 pb-16" onClick={stop}>
        <div className="mx-auto w-full max-w-4xl">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-serif">{title}</h1>
            {year && <span className="text-sm text-muted-foreground">{year}</span>}
          </header>

          {description && (
            <div className="mb-8" dir={descriptionRtl ? "rtl" : undefined}>
              <p className="text-muted-foreground whitespace-pre-line">{description}</p>
              {descriptionFooter && (
                <p className="mt-4 text-xs text-muted-foreground/70">{descriptionFooter}</p>
              )}
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-border bg-muted/30">
            {/* Native img for progressive JPEG loading (top-to-bottom reveal) */}
            <img
              src={longImage}
              alt={title}
              loading="eager"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

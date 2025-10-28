"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  title: string;
  year?: string | number;
  description?: string;
  longImage: string;
  closeHref?: string; // default "/#work"
};

export default function ProjectOverlay({
  title,
  year,
  description,
  longImage,
  closeHref = "/#work",
}: Props) {
  const router = useRouter();
  const close = () => router.push(closeHref, { scroll: false });

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []); // eslint-disable-line

  // Prevent background scroll while open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 backdrop-blur-sm"
      onClick={close} // click backdrop to close
    >
      {/* Card */}
      <div
        className="relative mt-24 w-[min(1000px,92vw)] max-h-[80vh] overflow-y-auto rounded-2xl border border-white/15 bg-background"
        onClick={(e) => e.stopPropagation()} // don't close when clicking content
      >
        {/* Close */}
        <button
          aria-label="Close"
          onClick={close}
          className="absolute right-3 top-3 z-10 rounded-full border border-white/20 px-3 py-1 text-sm hover:bg-white/10"
        >
          ✕
        </button>

        {/* Header */}
        <div className="px-5 pt-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-serif">{title}</h2>
            {year && <span className="text-sm text-muted-foreground">{year}</span>}
          </div>
          {description && (
            <p className="mb-4 text-sm md:text-base text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Long image */}
        <div className="px-5 pb-6">
          <div className="overflow-hidden rounded-2xl border border-border">
            <Image
              src={longImage}
              alt={title}
              width={2000}
              height={6000}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

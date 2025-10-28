"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  title: string;
  year?: string | number;
  description?: string;
  longImage: string;
  closeHref: string; // e.g. "/work"
};

export default function ProjectView({
  title,
  year,
  description,
  longImage,
  closeHref,
}: Props) {
  const router = useRouter();
  const close = () => router.push(closeHref);

  // Click outside the image (anywhere in the page) → close.
  const handleOuterClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    // If the click bubbled from inside the image wrapper, do nothing.
    // We’ll stopPropagation on the image wrapper below.
    close();
  };

  return (
    <div className="min-h-screen bg-background text-foreground" onClick={handleOuterClick}>
      {/* fixed close button */}
      <button
        aria-label="Close"
        onClick={(e) => { e.stopPropagation(); close(); }}
        className="fixed right-4 top-4 z-50 rounded-full border border-white/20 px-3 py-1 text-sm hover:bg-white/10"
      >
        ✕
      </button>

      <section className="px-4 pt-28 sm:pt-32 pb-16">
        <div className="mx-auto w-full max-w-4xl">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-serif">{title}</h1>
            {year && <span className="text-sm text-muted-foreground">{year}</span>}
          </header>

          {description && (
            <p className="mb-8 text-muted-foreground">{description}</p>
          )}

          {/* Image wrapper stops the outer click from closing */}
          <div
            className="overflow-hidden rounded-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
            role="group"
          >
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
      </section>
    </div>
  );
}

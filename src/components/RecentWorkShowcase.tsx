"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { projects } from "@/lib/projects";
import { useIsMobile } from "@/hooks/useIsMobile";

type CanvasItem = {
  slug: string;
  title: string;
  src: string;
  longImage: string;
  /** Existing year label. Role and discipline tags are omitted until that data exists. */
  year?: string;
  disciplines?: string[];
};

const canvases: CanvasItem[] = [
  {
    slug: "dolev-dadon-single-cover",
    title: "Single cover design - Dolev Dadon",
    src: "/single.jpg",
    longImage: "/single_long.jpg",
    year: "2025",
  },
  {
    slug: "studio-movimiento-branding",
    title: "Branding design - Studio Movimiento",
    src: "/studio.jpg",
    longImage: "/studio_long.jpg",
    year: "2025",
  },
  {
    slug: "zach-track-design",
    title: "ZACH - Track Design",
    src: "/zach.jpg",
    longImage: "/zach_long.jpg",
    year: "2025",
  },
];

const BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQACEQAD8QAf/9k=";

type Slot = "front" | "back-left" | "back-right";

function slotFor(index: number, active: number): Slot {
  if (index === active) return "front";
  const others = canvases.map((_, i) => i).filter((i) => i !== active);
  return index === others[0] ? "back-left" : "back-right";
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function RecentWorkShowcase() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [active, setActive] = useState(0);
  const total = canvases.length;
  const item = canvases[active];

  const meta = useMemo(
    () => projects.find((project) => project.slug === item.slug),
    [item.slug]
  );

  const description = meta?.description?.trim() ?? "";
  const year = item.year ?? (meta?.year ? String(meta.year) : undefined);
  const tags = item.disciplines ?? [];

  const openProject = (slug: string) => {
    router.push(`/?project=${slug}#work`, { scroll: false });
  };

  const preload = (src: string) => {
    const img = new window.Image();
    img.src = src;
  };

  const onCanvasClick = (index: number) => {
    if (index === active) {
      openProject(canvases[index].slug);
      return;
    }
    setActive(index);
  };

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(15rem,20rem)_minmax(0,1fr)] lg:gap-16">
      <div className="order-2 max-w-md lg:order-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          {pad(active + 1)} / {pad(total)}
        </p>
        <h3 className="mt-4 font-serif text-3xl leading-tight text-foreground md:text-4xl">
          <button
            type="button"
            onClick={() => openProject(item.slug)}
            onMouseEnter={() => preload(item.longImage)}
            className="bg-transparent p-0 text-left font-[inherit] text-inherit transition-opacity duration-300 hover:opacity-80"
          >
            {item.title}
          </button>
        </h3>
        {description ? (
          <p
            className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground md:text-base"
            dir={meta?.descriptionRtl ? "rtl" : undefined}
          >
            {description}
          </p>
        ) : null}
        {year ? (
          <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {year}
          </p>
        ) : null}
        {tags.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border/80 bg-transparent px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="order-1 lg:order-2">
        <div className="project-stage hidden md:block">
          {canvases.map((canvas, index) => {
            const slot = slotFor(index, active);
            const focused = index === active;
            return (
              <button
                key={canvas.slug}
                type="button"
                data-slot={slot}
                className="project-canvas group"
                onClick={() => onCanvasClick(index)}
                onMouseEnter={() => preload(canvas.longImage)}
                aria-label={
                  focused ? `Open project ${canvas.title}` : `Focus ${canvas.title}`
                }
                aria-current={focused ? "true" : undefined}
              >
                <Image
                  src={canvas.src}
                  alt={canvas.title}
                  fill
                  quality={100}
                  className="object-cover"
                  sizes="(max-width: 1024px) 46vw, 32vw"
                  placeholder={isMobile ? "empty" : "blur"}
                  blurDataURL={isMobile ? undefined : BLUR}
                  priority={focused}
                />
              </button>
            );
          })}
        </div>

        <div className="md:hidden">
          <button
            type="button"
            className="project-canvas-flat"
            onClick={() => openProject(item.slug)}
            onMouseEnter={() => preload(item.longImage)}
            aria-label={`Open project ${item.title}`}
          >
            <Image
              src={item.src}
              alt={item.title}
              fill
              quality={100}
              className="object-cover"
              sizes="100vw"
              placeholder="empty"
              priority
            />
          </button>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {canvases.map((canvas, index) =>
              index === active ? null : (
                <button
                  key={canvas.slug}
                  type="button"
                  className="project-canvas-flat project-canvas-flat-quiet"
                  onClick={() => setActive(index)}
                  aria-label={`Focus ${canvas.title}`}
                >
                  <Image
                    src={canvas.src}
                    alt=""
                    fill
                    quality={100}
                    className="object-cover"
                    sizes="46vw"
                    placeholder="empty"
                  />
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MaskedReveal, Reveal } from "@/components/motion/Motion";
import { projects } from "@/lib/projects";
import { useIsMobile } from "@/hooks/useIsMobile";

const RECENT_COUNT = 7;

const recentProjects = projects.slice(0, RECENT_COUNT);

/** Small designed angles. Focus eases each one toward 0. */
const ROTATION = [-3.4, 2.5, -4.5, 3.2, -2.4, 4.8, -3.6];
/** A few pixels off the ascending line so the row is not a ruler. */
const WOBBLE = [2, -1, 1, -2, 2, -1, 1];

const BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQACEQAD8QAf/9k=";

const DRAG_CLICK_THRESHOLD = 8;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function strideRatio(viewport: number) {
  if (viewport < 768) return 0.84;
  if (viewport < 1024) return 0.88;
  return 0.86;
}

function smoothstep(value: number) {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type Frame = {
  lefts: number[];
  track: number;
};

type Metrics = {
  snaps: number[];
  stride: number;
  maxScroll: number;
};

export default function RecentWorkShowcase() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [active, setActive] = useState(0);
  const [frame, setFrame] = useState<Frame | null>(null);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const metricsRef = useRef<Metrics>({ snaps: [], stride: 1, maxScroll: 0 });
  const activeRef = useRef(0);
  const frameIdRef = useRef(0);
  const settleIdRef = useRef(0);
  const settlingRef = useRef(false);
  const layoutKeyRef = useRef("");
  const suppressClickRef = useRef(false);
  const dragRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startScroll: 0,
    moved: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
  });

  const total = recentProjects.length;
  const item = recentProjects[active];
  const description = item.description.trim();
  const tags = item.tags ?? [];

  const applyPoses = useCallback(() => {
    const scroller = scrollerRef.current;
    const { snaps, stride } = metricsRef.current;
    if (!scroller || snaps.length === 0 || stride <= 0) return;

    const viewport = window.innerWidth;
    const rotPose = viewport < 768 ? 0.5 : viewport < 1024 ? 0.72 : 1;
    const rise = viewport < 768 ? 22 : viewport < 1024 ? 36 : 52;
    const scroll = scroller.scrollLeft;
    const view = scroller.clientWidth;

    let best = 0;
    let bestDist = Infinity;

    snaps.forEach((snap, index) => {
      const dist = Math.abs(scroll - snap);
      if (dist < bestDist) {
        bestDist = dist;
        best = index;
      }

      const canvas = itemRefs.current[index];
      if (!canvas) return;
      const away = Math.abs(scroll - snap) / stride;
      const near = smoothstep(1 - Math.min(1.15, away));
      const scale = 0.96 + 0.04 * near;
      const rot = ROTATION[index] * rotPose * (1 - near * 0.9);
      const center = view * 0.5 - (scroll - snap);
      const t = center / Math.max(1, view);
      const y = (0.5 - t) * rise + WOBBLE[index] * (viewport < 768 ? 0.45 : 1);
      canvas.style.transform = `translate3d(0, calc(-50% + ${y}px), 0) rotate(${rot}deg) scale(${scale})`;
      canvas.style.zIndex = String(index + 1 + Math.round(near * 10));
    });

    if (best !== activeRef.current) {
      activeRef.current = best;
      setActive(best);
    }
  }, []);

  const cancelSettle = useCallback(() => {
    if (settleIdRef.current) {
      window.cancelAnimationFrame(settleIdRef.current);
      settleIdRef.current = 0;
    }
    settlingRef.current = false;
  }, []);

  const settle = useCallback(() => {
    const scroller = scrollerRef.current;
    const snaps = metricsRef.current.snaps;
    if (!scroller || snaps.length === 0 || dragRef.current.active || settlingRef.current) return;

    let best = 0;
    let bestDist = Infinity;
    snaps.forEach((snap, index) => {
      const dist = Math.abs(scroller.scrollLeft - snap);
      if (dist < bestDist) {
        bestDist = dist;
        best = index;
      }
    });

    const target = snaps[best];
    const start = scroller.scrollLeft;
    const delta = target - start;
    if (Math.abs(delta) < 1.5) {
      scroller.scrollLeft = target;
      applyPoses();
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      scroller.scrollLeft = target;
      applyPoses();
      return;
    }

    const duration = Math.min(320, Math.max(180, Math.abs(delta) * 0.48));
    const t0 = performance.now();
    settlingRef.current = true;

    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      scroller.scrollLeft = start + delta * eased;
      if (t < 1) {
        settleIdRef.current = window.requestAnimationFrame(step);
        return;
      }
      scroller.scrollLeft = target;
      settlingRef.current = false;
      settleIdRef.current = 0;
      applyPoses();
    };

    settleIdRef.current = window.requestAnimationFrame(step);
  }, [applyPoses]);

  const release = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const maxVelocity = 0.62;
    let velocity = clamp(dragRef.current.velocity, -maxVelocity, maxVelocity);
    if (reduce || Math.abs(velocity) < 0.08) {
      settle();
      return;
    }

    const origin = scroller.scrollLeft;
    const maxTravel = Math.max(42, metricsRef.current.stride * 0.36);
    let traveled = 0;
    let previous = performance.now();
    settlingRef.current = true;

    const step = (now: number) => {
      if (dragRef.current.active) {
        settlingRef.current = false;
        settleIdRef.current = 0;
        return;
      }
      const dt = Math.min(32, now - previous);
      previous = now;
      velocity *= Math.pow(0.82, dt / 16);
      const delta = velocity * dt;
      traveled += delta;
      let next = scroller.scrollLeft + delta;
      const capped = Math.abs(traveled) >= maxTravel;
      if (capped) next = origin + Math.sign(traveled || velocity) * maxTravel;
      const limit = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      next = clamp(next, 0, limit);
      scroller.scrollLeft = next;
      const edge = next <= 0 || next >= limit - 0.5;
      if (!capped && !edge && Math.abs(velocity) > 0.045) {
        settleIdRef.current = window.requestAnimationFrame(step);
        return;
      }
      settlingRef.current = false;
      settleIdRef.current = 0;
      settle();
    };

    settleIdRef.current = window.requestAnimationFrame(step);
  }, [settle]);

  const measure = useCallback(() => {
    const scroller = scrollerRef.current;
    const sample = itemRefs.current[0];
    if (!scroller || !sample) return;

    const width = sample.offsetWidth;
    const viewport = scroller.clientWidth;
    if (width < 1 || viewport < 1) return;

    const stride = width * strideRatio(window.innerWidth);
    const focusX = viewport * 0.5;
    const pad = focusX - width / 2;
    const count = recentProjects.length;
    const lefts = recentProjects.map((_, index) => pad + index * stride);
    const track = viewport + Math.max(0, count - 1) * stride;
    const key = `${Math.round(width)}:${Math.round(viewport)}:${Math.round(stride)}:${count}`;
    metricsRef.current = {
      snaps: recentProjects.map((_, index) => index * stride),
      stride,
      maxScroll: Math.max(0, count - 1) * stride,
    };

    if (key === layoutKeyRef.current) return;
    layoutKeyRef.current = key;
    setFrame({ lefts, track });
  }, []);

  useLayoutEffect(() => {
    measure();
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onScroll = () => {
      if (frameIdRef.current) return;
      frameIdRef.current = window.requestAnimationFrame(() => {
        frameIdRef.current = 0;
        applyPoses();
      });
    };

    const onScrollEnd = () => {
      if (dragRef.current.active || settlingRef.current) return;
      settle();
    };

    const onResize = () => {
      measure();
      const snaps = metricsRef.current.snaps;
      const next = snaps[activeRef.current];
      if (scroller && next != null) scroller.scrollLeft = next;
      applyPoses();
    };

    window.addEventListener("resize", onResize);
    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("scrollend", onScrollEnd);
    const observer = new ResizeObserver(onResize);
    observer.observe(scroller);

    return () => {
      window.removeEventListener("resize", onResize);
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("scrollend", onScrollEnd);
      observer.disconnect();
      if (frameIdRef.current) window.cancelAnimationFrame(frameIdRef.current);
      cancelSettle();
    };
  }, [cancelSettle, measure, settle, applyPoses]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const snap = metricsRef.current.snaps[activeRef.current];
    if (!scroller || snap == null || dragRef.current.active || settlingRef.current) return;
    scroller.scrollLeft = snap;
  }, [frame]);

  useLayoutEffect(() => {
    applyPoses();
  }, [frame, active, applyPoses]);

  const openProject = (slug: string) => {
    router.push(`/?project=${slug}#work`, { scroll: false });
  };

  const preload = (src: string) => {
    const image = new window.Image();
    image.src = src;
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    cancelSettle();
    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: scroller.scrollLeft,
      moved: 0,
      lastX: event.clientX,
      lastT: event.timeStamp || performance.now(),
      velocity: 0,
    };
    scroller.setPointerCapture(event.pointerId);
    scroller.classList.add("is-grabbing");
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const scroller = scrollerRef.current;
    if (!drag.active || !scroller || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.startX;
    drag.moved = Math.max(drag.moved, Math.abs(dx));
    const now = event.timeStamp || performance.now();
    const dt = now - drag.lastT;
    if (dt > 0 && dt < 64) {
      const velocity = -(event.clientX - drag.lastX) / dt;
      drag.velocity = drag.velocity * 0.35 + velocity * 0.65;
    }
    drag.lastX = event.clientX;
    drag.lastT = now;
    scroller.scrollLeft = drag.startScroll - dx;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const scroller = scrollerRef.current;
    if (!drag.active || event.pointerId !== drag.pointerId) return;
    drag.active = false;
    scroller?.classList.remove("is-grabbing");
    if (drag.moved > DRAG_CLICK_THRESHOLD) suppressClickRef.current = true;
    release();
  };

  const onCanvasClick = (slug: string) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    openProject(slug);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const dir = event.key === "ArrowRight" ? 1 : -1;
    const next = Math.min(total - 1, Math.max(0, activeRef.current + dir));
    const snap = metricsRef.current.snaps[next];
    const scroller = scrollerRef.current;
    if (!scroller || snap == null) return;
    cancelSettle();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      scroller.scrollLeft = snap;
      activeRef.current = next;
      setActive(next);
      return;
    }
    scroller.scrollLeft = scroller.scrollLeft;
    activeRef.current = next;
    const start = scroller.scrollLeft;
    const delta = snap - start;
    const t0 = performance.now();
    settlingRef.current = true;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / 320);
      scroller.scrollLeft = start + delta * (1 - Math.pow(1 - t, 3));
      if (t < 1) {
        settleIdRef.current = window.requestAnimationFrame(step);
        return;
      }
      settlingRef.current = false;
      setActive(next);
    };
    settleIdRef.current = window.requestAnimationFrame(step);
  };

  return (
    <div className="work-section">
      <div className="mx-auto flex w-full max-w-6xl items-end justify-between px-4 pt-24 md:pt-32">
        <MaskedReveal className="text-3xl font-serif md:text-4xl">Recent work</MaskedReveal>
        <Reveal delay={90}>
          <Link href="/work">
            <Button
              variant="outline"
              className="h-9 rounded-full border-white/30 px-4 text-foreground hover:border-white/50 hover:bg-white/10"
            >
              See all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </Reveal>
      </div>

      <div
        ref={scrollerRef}
        className="work-scroller"
        data-ready={frame ? "true" : "false"}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
      >
        <div className="work-track" style={frame ? { width: frame.track } : undefined}>
          {recentProjects.map((canvas, index) => {
            const focused = index === active;
            return (
              <button
                key={canvas.slug}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                type="button"
                className="work-canvas"
                data-active={focused ? "true" : "false"}
                aria-current={focused ? "true" : undefined}
                aria-label={`Open project ${canvas.title}`}
                style={{ left: frame ? frame.lefts[index] : 0 }}
                onClick={() => onCanvasClick(canvas.slug)}
                onMouseEnter={() => preload(canvas.longImage)}
                onDragStart={(event) => event.preventDefault()}
              >
                <Image
                  src={canvas.cover}
                  alt={canvas.title}
                  fill
                  quality={100}
                  draggable={false}
                  className="object-cover"
                  sizes="(max-width: 767px) 60vw, (max-width: 1023px) 34vw, 380px"
                  placeholder={isMobile ? "empty" : "blur"}
                  blurDataURL={isMobile ? undefined : BLUR}
                  priority={index === 0}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="work-copy mx-auto w-full max-w-6xl px-4 pb-20 md:pb-28">
        <div key={item.slug} className="work-info-panel" aria-live="polite">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {pad(active + 1)} / {pad(total)}
          </p>
          <h3 className="work-info-title mt-2 text-foreground">
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
              className="work-info-desc mt-2 line-clamp-2 text-muted-foreground"
              dir={item.descriptionRtl ? "rtl" : undefined}
            >
              {description}
            </p>
          ) : null}
          {tags.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <li key={tag} className="work-tag">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}

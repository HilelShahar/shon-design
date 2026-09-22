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

const ROTATION_BIAS = [-0.35, 0.28, -0.22, 0.32, -0.26, 0.18, -0.3];

const BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQACEQAD8QAf/9k=";

const DRAG_CLICK_THRESHOLD = 8;
const ZACH_CASE_SLUG = "zach-track-design";
const ZACH_CASE_HREF = "/work/zach-track-design";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Desktop reference width. CSS canvas width resolves to this at 1440px. */
const REFERENCE_WIDTH = 380;
/** Same neighbor overlap at every width: stride is this fraction of the canvas. */
const STRIDE_RATIO = 0.82;
const ARC_AMPLITUDE = 104;

function compositionScale(canvasWidth: number) {
  return clamp(canvasWidth / REFERENCE_WIDTH, 0.48, 1);
}

const ARC_LEFT = [0, 0.42, 0.8, 1];
const ARC_RIGHT = [0, 0.28, 0.54, 0.74];

function sampleCurve(distance: number, samples: number[]) {
  const max = samples.length - 1;
  const t = Math.min(Math.max(0, distance), max);
  const index = Math.floor(t);
  const blend = t - index;
  const eased = blend * blend * (3 - 2 * blend);
  const from = samples[index];
  const to = samples[Math.min(max, index + 1)];
  return from + (to - from) * eased;
}

/** Authored display line. 0 at the focus (highest). Left falls further than the right. */
function arcDrop(offset: number) {
  return sampleCurve(Math.abs(offset), offset < 0 ? ARC_LEFT : ARC_RIGHT);
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
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const metricsRef = useRef<Metrics>({ snaps: [], stride: 1, maxScroll: 0 });
  const activeRef = useRef(0);
  const frameIdRef = useRef(0);
  const settleIdRef = useRef(0);
  const settlingRef = useRef(false);
  const layoutKeyRef = useRef("");
  const suppressClickRef = useRef(false);
  const pressSlugRef = useRef<string | null>(null);
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

    const canvasWidth = itemRefs.current[0]?.offsetWidth ?? REFERENCE_WIDTH;
    const scale = compositionScale(canvasWidth);
    const arc = ARC_AMPLITUDE * scale;
    const rotPose = 0.7 + 0.3 * scale;
    const scroll = scroller.scrollLeft;

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
      const offset = (snap - scroll) / stride;
      const distance = Math.abs(offset);
      const near = smoothstep(1 - Math.min(1.15, distance));
      const drop = arcDrop(offset);
      const y = drop * arc;
      const dir = offset < 0 ? -1 : 1;
      const x = dir * (Math.pow(distance, 2.1) * 26 - distance * 20) * scale;
      const tilt = Math.min(4.6, distance * 2.35);
      const rot = (dir * tilt + ROTATION_BIAS[index] * (1 - near)) * rotPose;
      const pose = 0.985 + 0.015 * near;
      canvas.style.transform = `translate3d(${x}px, calc(-50% + ${y}px), 0) rotate(${rot}deg) scale(${pose})`;
      canvas.style.zIndex = String(48 - Math.round(distance * 8) + (offset > 0 ? 1 : 0));
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

    const stride = width * STRIDE_RATIO;
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

  const preload = (src: string) => {
    const image = new window.Image();
    image.src = src;
  };

  const canvasSlugFrom = (target: EventTarget | null) => {
    const element = target instanceof Element ? target.closest(".work-canvas") : null;
    return element?.getAttribute("data-slug") ?? null;
  };

  const openZachFromPress = (pointerId: number, moved: number) => {
    if (dragRef.current.pointerId !== pointerId) return;
    const slug = pressSlugRef.current;
    pressSlugRef.current = null;
    if (slug !== ZACH_CASE_SLUG || moved > DRAG_CLICK_THRESHOLD) return;
    suppressClickRef.current = true;
    router.push(ZACH_CASE_HREF);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pressSlugRef.current = canvasSlugFrom(event.target);
    if (event.pointerType !== "mouse") {
      dragRef.current = {
        ...dragRef.current,
        active: false,
        pointerId: event.pointerId,
        startX: event.clientX,
        startScroll: 0,
        moved: 0,
      };
      return;
    }
    if (event.button !== 0) return;
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
    if (event.pointerType !== "mouse") {
      if (event.pointerId !== drag.pointerId) return;
      const dx = event.clientX - drag.startX;
      drag.moved = Math.max(drag.moved, Math.abs(dx));
      return;
    }
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
    if (event.pointerType !== "mouse") {
      if (event.pointerId === drag.pointerId && drag.moved > DRAG_CLICK_THRESHOLD) {
        suppressClickRef.current = true;
      }
      openZachFromPress(event.pointerId, drag.moved);
      return;
    }
    if (!drag.active || event.pointerId !== drag.pointerId) return;
    drag.active = false;
    scroller?.classList.remove("is-grabbing");
    if (drag.moved > DRAG_CLICK_THRESHOLD) suppressClickRef.current = true;
    openZachFromPress(event.pointerId, drag.moved);
    release();
  };

  const onCanvasClick = (slug: string) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (slug !== ZACH_CASE_SLUG) return;
    router.push(ZACH_CASE_HREF);
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
        onPointerCancel={(event) => {
          pressSlugRef.current = null;
          endDrag(event);
        }}
        onKeyDown={onKeyDown}
      >
        <div className="work-track" style={frame ? { width: frame.track } : undefined}>
          {recentProjects.map((canvas, index) => {
            const focused = index === active;
            const linked = canvas.slug === ZACH_CASE_SLUG;
            const CanvasTag = linked ? "button" : "div";
            return (
              <CanvasTag
                key={canvas.slug}
                ref={(node: HTMLElement | null) => {
                  itemRefs.current[index] = node;
                }}
                type={linked ? "button" : undefined}
                className={linked ? "work-canvas is-case" : "work-canvas"}
                data-slug={canvas.slug}
                data-active={focused ? "true" : "false"}
                aria-current={focused ? "true" : undefined}
                aria-label={linked ? `Open ${canvas.title}` : canvas.title}
                style={{ left: frame ? frame.lefts[index] : 0 }}
                onClick={linked ? () => onCanvasClick(canvas.slug) : undefined}
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
                  sizes="(max-width: 390px) 188px, (min-width: 1440px) 380px, calc(17.4vw + 130px)"
                  placeholder={isMobile ? "empty" : "blur"}
                  blurDataURL={isMobile ? undefined : BLUR}
                  priority={index === 0}
                />
              </CanvasTag>
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
            {item.slug === ZACH_CASE_SLUG ? (
              <button
                type="button"
                onClick={() => router.push(ZACH_CASE_HREF)}
                onMouseEnter={() => preload(item.longImage)}
                className="bg-transparent p-0 text-left font-[inherit] text-inherit transition-opacity duration-300 hover:opacity-80"
              >
                {item.title}
              </button>
            ) : (
              item.title
            )}
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

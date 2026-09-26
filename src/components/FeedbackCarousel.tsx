"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState, type AnimationEvent } from "react";
import {
  TESTIMONIALS,
  type Testimonial,
} from "@/lib/testimonials";
import { TestimonialQuoteAuthor, TestimonialQuoteText } from "@/components/TestimonialCard";
import { MaskedReveal, Reveal, Stagger } from "@/components/motion/Motion";

const SWIPE_THRESHOLD = 48;
const DRAG_LOCK = 10;

function circularOffset(index: number, active: number, count: number) {
  let offset = index - active;
  while (offset > count / 2) offset -= count;
  while (offset < -count / 2) offset += count;
  return offset;
}

function FeedbackCard({
  item,
  offset,
  dragPx,
  stride,
  cardWidth,
  sideScale,
  entrance,
  onSelect,
}: {
  item: Testimonial;
  offset: number;
  dragPx: number;
  stride: number;
  cardWidth: number;
  sideScale: number;
  entrance?: boolean;
  onSelect: () => void;
}) {
  const dragUnits = stride > 0 ? dragPx / stride : 0;
  const dist = Math.abs(offset + dragUnits);
  const near = Math.min(dist, 1);
  const fade = dist <= 1 ? 1 : Math.max(0, 1 - (dist - 1) / 0.42);
  const scale = sideScale + (1 - near) * (1 - sideScale);
  const opacity = (0.64 + (1 - near) * 0.36) * fade;
  const y = near * 8;
  const x = offset * stride + dragPx;
  const isCenter = dist < 0.35;

  return (
    <article
      role="group"
      aria-roledescription="slide"
      aria-hidden={!isCenter}
      className="feedback-card absolute left-1/2 top-0 will-change-transform"
      style={{
        width: cardWidth,
        transform: `translate3d(calc(-50% + ${x}px), ${y}px, 0) scale(${scale})`,
        opacity,
        filter: `brightness(${0.86 + (1 - near) * 0.14})`,
        zIndex: Math.round(10 + (1 - near) * 30),
        pointerEvents: dist > 1.05 || fade < 0.05 ? "none" : "auto",
        transition: dragPx !== 0 ? "none" : undefined,
      }}
      onClick={() => {
        if (!isCenter) onSelect();
      }}
    >
      <div
        className={`feedback-card-panel flex h-full min-h-[17.5rem] flex-col rounded-2xl border p-6 md:min-h-[18.5rem] md:p-7 ${
          isCenter ? "feedback-card-panel--active" : ""
        }`}
      >
        <span className="feedback-quote-mark" aria-hidden="true">
          ”
        </span>
        {entrance ? (
          <Stagger className="flex min-h-0 flex-1 flex-col">
            <TestimonialQuoteText item={item} />
            <TestimonialQuoteAuthor item={item} />
          </Stagger>
        ) : (
          <>
            <TestimonialQuoteText item={item} />
            <TestimonialQuoteAuthor item={item} />
          </>
        )}
      </div>
    </article>
  );
}

const navBtn =
  "feedback-nav-btn inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/70 backdrop-blur-xl transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 disabled:pointer-events-none disabled:opacity-35";

export default function FeedbackCarousel() {
  const count = TESTIMONIALS.length;
  const [active, setActive] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [layout, setLayout] = useState({ cardWidth: 320, stride: 280, sideScale: 0.82 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    locked: null as "x" | "y" | null,
  });

  const measure = useCallback(() => {
    const w = viewportRef.current?.clientWidth ?? 0;
    if (!w) return;
    const inset = w < 640 ? 16 : 10;
    const usable = Math.max(0, w - inset * 2);

    if (w < 760) {
      if (window.innerWidth <= 420) {
        const sideScale = 0.92;
        const cardWidth = w * 0.782;
        const sideVisual = cardWidth * sideScale;
        const peek = sideVisual * 0.1;
        setLayout({
          cardWidth,
          sideScale,
          stride: sideVisual / 2 + w / 2 - peek,
        });
        return;
      }
      const sideScale = w < 640 ? 0.66 : 0.76;
      const gap = w < 640 ? 6 : 12;
      let cardWidth = (usable - gap * 2) / (1 + sideScale * 2);
      cardWidth = Math.min(cardWidth, 280);
      const spare = usable - (cardWidth * (1 + sideScale * 2) + gap * 2);
      const fittedGap = gap + Math.max(0, spare) / 2;
      setLayout({
        cardWidth,
        sideScale,
        stride: (cardWidth * (1 + sideScale)) / 2 + fittedGap,
      });
      return;
    }

    const sideScale = w < 900 ? 0.78 : 0.82;
    const gap = w < 900 ? 16 : 26;
    let cardWidth = (usable - gap * 2) / (1 + sideScale * 2);
    cardWidth = Math.min(cardWidth, 400);
    const spare = usable - (cardWidth * (1 + sideScale * 2) + gap * 2);
    const fittedGap = gap + Math.max(0, spare) / 2;
    setLayout({
      cardWidth,
      sideScale,
      stride: (cardWidth * (1 + sideScale)) / 2 + fittedGap,
    });
  }, []);

  useLayoutEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [measure]);

  useLayoutEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    const fit = () => {
      const width = node.clientWidth;
      let tallest = 0;
      node.querySelectorAll<HTMLElement>(".feedback-card").forEach((card) => {
        tallest = Math.max(tallest, card.offsetHeight);
      });
      if (!tallest) return;
      if (width < 760) {
        node.style.minHeight = `${Math.ceil(tallest + 64)}px`;
        return;
      }
      node.style.minHeight = "";
      const floor = node.clientHeight;
      const needed = Math.ceil(tallest + 56);
      if (needed > floor) node.style.minHeight = `${needed}px`;
    };
    fit();
    const observer = new ResizeObserver(fit);
    node.querySelectorAll(".feedback-card").forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [layout.cardWidth]);

  const go = useCallback(
    (delta: number) => {
      setActive((i) => (i + delta + count) % count);
    },
    [count],
  );

  const goTo = useCallback(
    (index: number) => {
      setActive(((index % count) + count) % count);
    },
    [count],
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
  };

  const finishDrag = (dx: number) => {
    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      go(dx > 0 ? -1 : 1);
    }
    setDragPx(0);
    dragRef.current = {
      active: false,
      pointerId: -1,
      startX: 0,
      startY: 0,
      locked: null,
    };
  };

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.button !== 0) return;
    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      locked: null,
    };
    setDragPx(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag.active || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (drag.locked === null) {
      if (Math.abs(dx) < DRAG_LOCK && Math.abs(dy) < DRAG_LOCK) return;
      drag.locked = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (drag.locked === "y") return;
    event.preventDefault();
    setDragPx(dx);
  };

  const onPointerUp = (event: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag.active || event.pointerId !== drag.pointerId) return;
    const dx = drag.locked === "x" ? event.clientX - drag.startX : 0;
    finishDrag(dx);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
  };

  const onPointerCancel = (event: React.PointerEvent) => {
    if (event.pointerId !== dragRef.current.pointerId) return;
    finishDrag(0);
  };

  const settleStage = (event: AnimationEvent<HTMLElement>) => {
    const node = event.target;
    if (!(node instanceof HTMLElement) || !node.classList.contains("feedback-stage")) return;
    if (event.animationName !== "motion-media-in") return;
    node.style.animation = "none";
  };

  return (
    <section id="testimonials" className="feedback-section px-4 py-20 md:py-24" dir="ltr" onAnimationEnd={settleStage}>
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 md:mb-12">
          <MaskedReveal className="text-left font-serif text-3xl tracking-tight text-foreground md:text-[2.65rem] md:leading-tight">
            Feedback
          </MaskedReveal>
          <p className="mt-3 max-w-md text-left text-sm text-muted-foreground">
            Notes from clients and collaborators.
          </p>
        </header>

        <Reveal media className="feedback-stage">
        <div
          className="feedback-carousel relative"
          onKeyDown={onKeyDown}
          tabIndex={0}
          aria-label="Client feedback carousel"
          role="region"
        >
          <div className="feedback-carousel-row flex items-center justify-center gap-3 md:gap-5">
            <button
              type="button"
              className={`${navBtn} feedback-nav-prev`}
              aria-label="Previous feedback"
              onClick={() => go(-1)}
            >
              <ChevronLeft size={22} strokeWidth={1.8} />
            </button>

            <div
              ref={viewportRef}
              className="feedback-viewport relative min-h-[19rem] flex-1 touch-pan-y md:min-h-[20rem]"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerCancel}
            >
              {TESTIMONIALS.map((item, index) => (
                <FeedbackCard
                  key={index}
                  item={item}
                  offset={circularOffset(index, active, count)}
                  dragPx={dragPx}
                  stride={layout.stride}
                  cardWidth={layout.cardWidth}
                  sideScale={layout.sideScale}
                  entrance={index === 0}
                  onSelect={() => goTo(index)}
                />
              ))}
            </div>

            <button
              type="button"
              className={`${navBtn} feedback-nav-next`}
              aria-label="Next feedback"
              onClick={() => go(1)}
            >
              <ChevronRight size={22} strokeWidth={1.8} />
            </button>
          </div>

          <div className="feedback-dots mt-8 flex items-center justify-center gap-2" role="tablist" aria-label="Feedback slides">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`Show feedback ${index + 1} of ${count}`}
                className={index === active ? "feedback-dot is-active" : "feedback-dot"}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import { useRef, useState, type AnimationEvent, type KeyboardEvent, type TouchEvent, type WheelEvent } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { TESTIMONIALS } from "@/lib/testimonials";
import {
  TestimonialAvatar,
  TestimonialQuoteAuthor,
  TestimonialQuoteText,
} from "@/components/TestimonialCard";
import { MaskedReveal, Reveal } from "@/components/motion/Motion";

const ARROW_BTN =
  "feedback-nav-btn inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25";

// Gesture tuning: one deliberate gesture moves the wheel by exactly one step.
const WHEEL_THRESHOLD = 48; // accumulated px of vertical wheel delta
const GESTURE_QUIET_MS = 160; // silence that ends a wheel/trackpad gesture (momentum tails stay locked)
const GESTURE_COOLDOWN_MS = 520; // minimum time between steps (longer than the 420ms animation)
const SWIPE_THRESHOLD = 36; // px of touch travel along the selector's axis
const MOBILE_QUERY = "(max-width: 767px)"; // below md the selector is a horizontal row

/**
 * Feedback as a spotlight: one testimonial in a fixed card, a compact vertical
 * profile wheel beside it (previous / active / next). Every testimonial sits in
 * the same grid cell, so the card never changes size or position; switching only
 * fades/settles the content. The wheel and the card read the same `active`
 * index, so they always change together.
 */
export default function FeedbackSpotlight() {
  const [active, setActive] = useState(0);
  const count = TESTIMONIALS.length;

  // Signed, wrapped distance from the active profile: -1 previous, 0 active, +1 next.
  const offsetOf = (index: number) => {
    const half = Math.floor(count / 2);
    return ((index - active + count + half) % count) - half;
  };

  const step = (direction: 1 | -1) => setActive((current) => (current + direction + count) % count);

  // Gesture handling. Nothing here ever calls preventDefault or locks scrolling:
  // the page keeps scrolling while the wheel merely reacts to the same gesture.
  const gesture = useRef({ accum: 0, lastEvent: 0, locked: false, cooldownEnd: 0, touchY: 0, touchX: 0 });

  const tryStep = (direction: 1 | -1, now: number) => {
    step(direction);
    gesture.current.locked = true;
    gesture.current.cooldownEnd = now + GESTURE_COOLDOWN_MS;
    gesture.current.accum = 0;
  };

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (event.ctrlKey) return; // pinch-zoom
    // On mobile the selector is a horizontal strip, so sideways wheel movement
    // drives it; everywhere else only vertical movement counts.
    const sideways = window.matchMedia(MOBILE_QUERY).matches && Math.abs(event.deltaX) > Math.abs(event.deltaY);
    if (!sideways && Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const g = gesture.current;
    const now = performance.now();
    // A pause (after the cooldown) marks the end of one gesture; momentum tails
    // keep arriving without a pause, so they stay locked.
    if (now - g.lastEvent > GESTURE_QUIET_MS && now >= g.cooldownEnd) {
      g.locked = false;
      g.accum = 0;
    }
    g.lastEvent = now;
    if (g.locked) return;
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    g.accum += (sideways ? event.deltaX : event.deltaY) * unit;
    if (Math.abs(g.accum) >= WHEEL_THRESHOLD) tryStep(g.accum > 0 ? 1 : -1, now);
  };

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    gesture.current.touchY = event.touches[0].clientY;
    gesture.current.touchX = event.touches[0].clientX;
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const g = gesture.current;
    const touch = event.changedTouches[0];
    const dy = touch.clientY - g.touchY;
    const dx = touch.clientX - g.touchX;
    const now = performance.now();
    if (now < g.cooldownEnd) return;
    if (window.matchMedia(MOBILE_QUERY).matches) {
      // Horizontal row: swipe left = next, swipe right = previous.
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      tryStep(dx < 0 ? 1 : -1, now);
      return;
    }
    if (Math.abs(dy) < SWIPE_THRESHOLD || Math.abs(dy) < Math.abs(dx) * 1.5) return;
    tryStep(dy < 0 ? 1 : -1, now); // finger up = scroll down = next
  };

  const onWheelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const horizontal = window.matchMedia(MOBILE_QUERY).matches;
    if (horizontal && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
      event.preventDefault();
      step(event.key === "ArrowRight" ? 1 : -1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      step(-1);
    }
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
          <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:gap-10">
            <div id="feedback-card" className="feedback-stack" aria-live="polite">
              {TESTIMONIALS.map((item, index) => (
                <article
                  key={`${item.name}-${index}`}
                  className={index === active ? "feedback-slide is-active" : "feedback-slide"}
                  aria-hidden={index !== active}
                >
                  <div className="feedback-spot-card feedback-card-panel feedback-card-panel--active flex h-full flex-col rounded-2xl border p-6 md:p-7">
                    <span className="feedback-spot-quote" aria-hidden="true">
                      ”
                    </span>
                    <div className="my-auto ml-auto w-full max-w-[38rem] py-3 md:[&_blockquote]:text-base">
                      <TestimonialQuoteText item={item} />
                    </div>
                    <TestimonialQuoteAuthor item={item} />
                  </div>
                </article>
              ))}
            </div>

            <div
              className="feedback-selector hidden min-w-0 flex-col items-center justify-center gap-1 md:flex"
              onWheel={onWheel}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <button type="button" className={ARROW_BTN} aria-label="Previous feedback" aria-controls="feedback-card" onClick={() => step(-1)}>
                <ChevronUp size={16} strokeWidth={1.8} />
              </button>
              <div
                role="group"
                aria-label="Choose whose feedback to read"
                className="feedback-wheel"
                onKeyDown={onWheelKeyDown}
              >
                {TESTIMONIALS.map((item, index) => {
                  const offset = offsetOf(index);
                  // Only the previous / active / next profiles and the two off-stage
                  // slots are mounted; nothing else is ever visible.
                  if (Math.abs(offset) > 2) return null;
                  const isActive = offset === 0;
                  const isVisible = Math.abs(offset) <= 1;
                  return (
                    <button
                      key={`${item.name}-${index}`}
                      type="button"
                      data-pos={offset}
                      aria-pressed={isActive}
                      aria-current={isActive ? "true" : undefined}
                      aria-controls="feedback-card"
                      aria-label={`${item.name}, ${item.title}`}
                      aria-hidden={isVisible ? undefined : true}
                      tabIndex={isVisible ? 0 : -1}
                      className="feedback-wheel-item"
                      onClick={() => setActive(index)}
                    >
                      <span className="feedback-wheel-avatar" aria-hidden="true">
                        <TestimonialAvatar name={item.name} image={item.image} initials={item.initials} size="size-14" />
                      </span>
                    </button>
                  );
                })}
              </div>
              <button type="button" className={ARROW_BTN} aria-label="Next feedback" aria-controls="feedback-card" onClick={() => step(1)}>
                <ChevronDown size={16} strokeWidth={1.8} />
              </button>
            </div>

            <div
              className="feedback-strip"
              onWheel={onWheel}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              onKeyDown={onWheelKeyDown}
            >
              <button type="button" className={ARROW_BTN} aria-label="Previous feedback" aria-controls="feedback-card" onClick={() => step(-1)}>
                <ChevronLeft size={16} strokeWidth={1.8} />
              </button>
              <div role="group" aria-label="Choose whose feedback to read" className="feedback-strip-row">
                {TESTIMONIALS.map((item, index) => {
                  const offset = offsetOf(index);
                  if (Math.abs(offset) > 2) return null;
                  const isActive = offset === 0;
                  const isVisible = Math.abs(offset) <= 1;
                  return (
                    <button
                      key={`${item.name}-${index}`}
                      type="button"
                      data-pos={offset}
                      aria-pressed={isActive}
                      aria-current={isActive ? "true" : undefined}
                      aria-controls="feedback-card"
                      aria-label={`${item.name}, ${item.title}`}
                      aria-hidden={isVisible ? undefined : true}
                      tabIndex={isVisible ? 0 : -1}
                      className="feedback-strip-item"
                      onClick={() => setActive(index)}
                    >
                      <span className="feedback-strip-avatar" aria-hidden="true">
                        <TestimonialAvatar name={item.name} image={item.image} initials={item.initials} size="size-14" />
                      </span>
                    </button>
                  );
                })}
              </div>
              <button type="button" className={ARROW_BTN} aria-label="Next feedback" aria-controls="feedback-card" onClick={() => step(1)}>
                <ChevronRight size={16} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

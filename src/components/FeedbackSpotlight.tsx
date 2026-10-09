"use client";

import { useRef, useState, type AnimationEvent, type KeyboardEvent, type TouchEvent } from "react";
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

// One horizontal swipe on the mobile selector moves exactly one step.
const GESTURE_COOLDOWN_MS = 520;
const SWIPE_THRESHOLD = 36;
const MOBILE_QUERY = "(max-width: 767px)";

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

  // Mobile only. A horizontal swipe on the strip steps one profile. Vertical
  // movement is ignored, and nothing here calls preventDefault, so the page
  // keeps scrolling. Desktop and tablet have no wheel or swipe listener.
  const gesture = useRef({ cooldownEnd: 0, touchY: 0, touchX: 0 });

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    gesture.current.touchY = event.touches[0].clientY;
    gesture.current.touchX = event.touches[0].clientX;
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (!window.matchMedia(MOBILE_QUERY).matches) return;
    const g = gesture.current;
    const touch = event.changedTouches[0];
    const dy = touch.clientY - g.touchY;
    const dx = touch.clientX - g.touchX;
    const now = performance.now();
    if (now < g.cooldownEnd) return;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    step(dx < 0 ? 1 : -1); // finger left = next
    g.cooldownEnd = now + GESTURE_COOLDOWN_MS;
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

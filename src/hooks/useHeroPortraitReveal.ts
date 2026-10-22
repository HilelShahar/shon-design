"use client";

import { useEffect, useRef } from "react";

/** Phones and tablets, plus touch-first devices of any width. */
const GATED_QUERY = "(max-width: 1023px), (hover: none) and (pointer: coarse)";
/** Real scroll distance, from where the user started, before the reveal may begin. */
const GATE_PX = 56;

/**
 * Scrubs the hero portrait reveal directly from native scroll position.
 *
 * Writes `--hero-p` (0 -> 1) plus the two mask stops onto the hero section; the
 * visual work lives in CSS. Geometry is only read on mount/resize so scrolling
 * never forces layout, and there is no sticky stage or wheel interception.
 *
 * At progress 0 the mask is fully closed — none of the portrait is visible.
 *
 * Desktop reads `scrollY` directly, as before. On phones and tablets the reveal
 * is gated: a page that loads already offset (in-app browsers, restored scroll,
 * toolbars collapsing) must not open it. Progress only counts scroll that
 * follows a real touch / wheel / key input, measured from where that input
 * started, and it never closes again once it has opened.
 */
export function useHeroPortraitReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gatedQuery = window.matchMedia(GATED_QUERY);

    let range = 1;
    let frame = 0;

    // Gated (mobile / tablet) state.
    let armed = false;
    let baseline = 0;
    let latched = 0; // furthest real scroll distance so far, in px

    const docTop = (node: HTMLElement) => {
      let top = 0;
      let el: HTMLElement | null = node;
      while (el) {
        top += el.offsetTop;
        el = el.offsetParent as HTMLElement | null;
      }
      return top;
    };

    const measure = () => {
      const sectionBottom = docTop(section) + section.offsetHeight;
      range = Math.min(520, Math.max(160, sectionBottom - window.innerHeight));
    };

    // Visible fraction of the portrait. Held nearly closed at the start so
    // the name reads first, then opens more in the second half of the range.
    const visibleAt = (p: number) => {
      if (p <= 0.12) return 0;
      if (p <= 0.28) return ((p - 0.12) / 0.16) * 0.1;
      if (p <= 0.48) return 0.1 + ((p - 0.28) / 0.2) * 0.32;
      if (p <= 0.68) return 0.42 + ((p - 0.48) / 0.2) * 0.28;
      if (p <= 0.85) return 0.7 + ((p - 0.68) / 0.17) * 0.2;
      return 0.9 + ((p - 0.85) / 0.15) * 0.1;
    };

    const progress = () => {
      const y = window.scrollY;
      if (reduce || !gatedQuery.matches) return Math.min(1, Math.max(0, y / range));

      // Already far past the hero without a gesture (restored position, anchor
      // jump from the nav): nothing left to reveal, so don't hide it.
      if (y >= range) latched = Math.max(latched, range);
      if (armed) {
        const delta = y - baseline;
        if (delta >= GATE_PX) latched = Math.max(latched, delta);
      }
      return Math.min(1, latched / range);
    };

    const update = () => {
      frame = 0;
      const p = progress();
      section.style.setProperty("--hero-hint", p.toFixed(4));
      if (reduce) return;
      const a = visibleAt(p);
      const b = a <= 0 ? 0 : Math.min(1, a + 0.16);
      section.style.setProperty("--hero-p", p.toFixed(4));
      section.style.setProperty("--hero-mask-a", `${(a * 100).toFixed(2)}%`);
      section.style.setProperty("--hero-mask-b", `${(b * 100).toFixed(2)}%`);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    // Real input only. A scroll event with no input before it never counts.
    const arm = () => {
      if (armed) return;
      armed = true;
      baseline = window.scrollY;
    };

    measure();
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("touchstart", arm, { passive: true });
    window.addEventListener("touchmove", arm, { passive: true });
    window.addEventListener("wheel", arm, { passive: true });
    window.addEventListener("keydown", arm);

    const observer = new ResizeObserver(onResize);
    observer.observe(section);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("touchstart", arm);
      window.removeEventListener("touchmove", arm);
      window.removeEventListener("wheel", arm);
      window.removeEventListener("keydown", arm);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}

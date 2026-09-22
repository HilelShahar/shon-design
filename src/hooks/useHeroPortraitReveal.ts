"use client";

import { useEffect, useRef } from "react";

/**
 * Scrubs the hero portrait reveal directly from native scroll position.
 *
 * Writes `--hero-p` (0 -> 1) plus the two mask stops onto the hero section; the
 * visual work lives in CSS. Geometry is only read on mount/resize so scrolling
 * never forces layout, and there is no sticky stage or wheel interception.
 *
 * At progress 0 the mask is fully closed — none of the portrait is visible.
 */
export function useHeroPortraitReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let range = 1;
    let frame = 0;

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

    const update = () => {
      frame = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / range));
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

    measure();
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const observer = new ResizeObserver(onResize);
    observer.observe(section);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}

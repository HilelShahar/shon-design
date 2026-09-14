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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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

    // Visible fraction of the portrait for a given scroll progress.
    // Delayed start so the name reads first; then head → face → body → full.
    const visibleAt = (p: number) => {
      if (p <= 0) return 0;
      if (p <= 0.2) return (p / 0.2) * 0.12;
      if (p <= 0.4) return 0.12 + ((p - 0.2) / 0.2) * 0.3;
      if (p <= 0.65) return 0.42 + ((p - 0.4) / 0.25) * 0.28;
      return 0.7 + ((p - 0.65) / 0.35) * 0.3;
    };

    const update = () => {
      frame = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / range));
      const a = visibleAt(p);
      const b = p <= 0 ? 0 : Math.min(1, a + 0.16);
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

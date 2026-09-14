"use client";

import { useLayoutEffect, useRef, useState } from "react";

import {
  HERO_REVEAL_AT_MS,
  HERO_REVEAL_EVENT,
  INTRO_SEEN_KEY as STORAGE_KEY,
} from "@/lib/introSequence";

export default function IntroOverlay() {
  const [active, setActive] = useState(true);
  const prevOverflow = useRef<string | null>(null);
  const curtain = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const seen = sessionStorage.getItem(STORAGE_KEY) === "1";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reduce) {
      if (!seen) sessionStorage.setItem(STORAGE_KEY, "1");
      setActive(false);
      return;
    }

    prevOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // The wipe starts painting before React hydrates, so measure against the
    // curtain's own clock instead of this effect — otherwise a slow hydration
    // would hand off to the hero long after the curtain had passed it.
    const elapsed = Number(curtain.current?.getAnimations()[0]?.currentTime) || 0;
    const handoff = window.setTimeout(
      () => window.dispatchEvent(new Event(HERO_REVEAL_EVENT)),
      Math.max(0, HERO_REVEAL_AT_MS - elapsed),
    );

    return () => {
      window.clearTimeout(handoff);
      if (prevOverflow.current !== null) {
        document.body.style.overflow = prevOverflow.current;
      }
    };
  }, []);

  const finish = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    if (prevOverflow.current !== null) {
      document.body.style.overflow = prevOverflow.current;
    }
    setActive(false);
  };

  if (!active) return null;

  return (
    <div className="intro-overlay" aria-hidden="true">
      <div ref={curtain} className="intro-overlay-curtain" onAnimationEnd={finish} />
      <div className="intro-overlay-runner">
        <svg viewBox="0 0 100 170" fill="none" aria-hidden="true">
          <path d="M40 92 C16 80 8 58 13 32" stroke="#f5f5f5" strokeWidth="10.5" strokeLinecap="round" />
          <path d="M47 90 C30 70 28 46 36 24" stroke="#f5f5f5" strokeWidth="10.5" strokeLinecap="round" />
          <path d="M45 124 C26 138 18 152 14 167" stroke="#f5f5f5" strokeWidth="12" strokeLinecap="round" />
          <path d="M61 122 C78 136 88 150 94 167" stroke="#f5f5f5" strokeWidth="12" strokeLinecap="round" />
          <ellipse cx="51" cy="102" rx="13" ry="21" transform="rotate(34 51 102)" fill="#f5f5f5" />
          <rect x="57" y="68" width="8" height="14" rx="4" transform="rotate(26 61 75)" fill="#f5f5f5" />
          <path d="M55 64 C52 78 60 84 72 84 C84 84 88 74 86 64 C84 72 76 76 70 76 C60 76 56 70 55 64Z" fill="#d8d8d8" />
          <circle cx="71" cy="48" r="15" fill="#f5f5f5" />
          <path d="M58 38 C50 10 80 4 90 22 C94 30 88 42 80 45 C86 28 72 22 60 36 Z" fill="#d8d8d8" />
          <circle cx="78" cy="46" r="2.8" fill="#111" />
          <path d="M77 52 L85 58" stroke="#111" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M72 55 Q78 58 84 55" stroke="#111" strokeWidth="2.4" strokeLinecap="round" />
          <ellipse cx="79" cy="61" rx="2.6" ry="1.8" fill="#111" />
          <path d="M44 90 Q52 96 60 89" stroke="#111" strokeWidth="2.1" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

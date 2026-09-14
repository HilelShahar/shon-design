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
        <div className="intro-overlay-sprite" />
      </div>
    </div>
  );
}

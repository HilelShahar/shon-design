"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type Phase = "closed" | "charging" | "open" | "closing";

type PersonalWorldProps = {
  pokemonShelf: ReactNode;
  pokemonCards: ReactNode;
  pokemonApp: ReactNode;
  gaming: ReactNode;
  pokerTable: ReactNode;
  pokerChips: ReactNode;
  pokerStudy: ReactNode;
};

const CHARGE_MS = 560;
const CLOSE_MS = 260;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function PokeBall() {
  return (
    <svg viewBox="0 0 200 200" className="pw-svg" aria-hidden="true" focusable="false">
      {/* Base: lower half, equator band and centre button stay put. */}
      <path d="M10 100a90 90 0 0 0 180 0z" fill="#e8e8ea" />
      <ellipse className="pw-light" cx="100" cy="97" rx="84" ry="8" fill="#ffffff" />
      <rect x="10" y="94" width="180" height="12" fill="#0a0a0a" />
      <circle cx="100" cy="100" r="27" fill="#0a0a0a" />
      <circle cx="100" cy="100" r="16" fill="#e8e8ea" />
      <circle cx="100" cy="100" r="9" fill="#cfcfd3" />
      {/* Lid lifts away on open. */}
      <g className="pw-lid">
        <path d="M10 100a90 90 0 0 1 180 0z" fill="#9b2229" />
        <path
          d="M34 70a72 72 0 0 1 46-30"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.22"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <rect x="10" y="94" width="180" height="6" fill="#0a0a0a" />
        <path d="M73 100a27 27 0 0 1 54 0z" fill="#0a0a0a" />
      </g>
      {/* A thin line of light escaping along the seam. */}
      <g className="pw-seam">
        <rect className="pw-seam-soft" x="16" y="98" width="168" height="4" rx="2" fill="#f1ebff" />
        <rect x="14" y="99.2" width="172" height="1.6" rx="0.8" fill="#ffffff" />
      </g>
      <circle cx="100" cy="100" r="89.5" fill="none" stroke="#ffffff" strokeOpacity="0.08" />
    </svg>
  );
}

function StoryCopy({
  eyebrow,
  title,
  body,
  large = false,
  className = "",
}: {
  eyebrow: string;
  title: string;
  body: string;
  large?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="about-eyebrow">{eyebrow}</p>
      <h3 className={`about-story-title mt-4 ${large ? "about-story-title-lg" : ""}`}>{title}</h3>
      <p className="about-body mt-5">{body}</p>
    </div>
  );
}

export default function PersonalWorld({
  pokemonShelf,
  pokemonCards,
  pokemonApp,
  gaming,
  pokerTable,
  pokerChips,
  pokerStudy,
}: PersonalWorldProps) {
  const [phase, setPhase] = useState<Phase>("closed");
  const panelId = useId();
  const ballRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timer = useRef(0);

  const expanded = phase === "charging" || phase === "open";
  const showContent = phase === "open" || phase === "closing";

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const close = useCallback(() => {
    window.clearTimeout(timer.current);
    if (prefersReducedMotion()) {
      setPhase("closed");
      return;
    }
    setPhase("closing");
    timer.current = window.setTimeout(() => setPhase("closed"), CLOSE_MS);
  }, []);

  const toggle = () => {
    if (phase === "charging" || phase === "closing") return;
    if (phase === "open") {
      close();
      return;
    }
    if (prefersReducedMotion()) {
      setPhase("open");
      return;
    }
    // One click: tremble and brighten the seam, then open and release.
    setPhase("charging");
    timer.current = window.setTimeout(() => setPhase("open"), CHARGE_MS);
  };

  useEffect(() => {
    if (phase !== "open") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, close]);

  // Aim each story at the ball so it can travel out of it and settle in place.
  useLayoutEffect(() => {
    if (phase !== "open") return;
    const ball = ballRef.current?.getBoundingClientRect();
    const stories = contentRef.current?.querySelectorAll<HTMLElement>("[data-story]");
    if (!ball || !stories) return;
    const bx = ball.left + ball.width / 2;
    const by = ball.top + ball.height / 2;
    const tilt = ["-7deg", "5deg", "-4deg"];
    stories.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--fx", `${Math.round(bx - (rect.left + rect.width / 2))}px`);
      el.style.setProperty("--fy", `${Math.round(by - (rect.top + rect.height / 2))}px`);
      el.style.setProperty("--fr", tilt[i] ?? "0deg");
    });
  }, [phase]);

  return (
    <div className={`pw-stage is-${phase}`}>
      <div className="pw-ball-zone">
        <div className="pw-ball-wrap">
          <span className="pw-glow" aria-hidden="true" />
          <button
            ref={ballRef}
            type="button"
            className="pw-ball"
            aria-expanded={expanded}
            aria-controls={panelId}
            aria-label={expanded ? "Close my personal world" : "Open my personal world"}
            onClick={toggle}
          >
            <PokeBall />
          </button>
        </div>
        <p className="pw-hint" aria-hidden="true">
          {expanded ? "Tap to close" : "Tap to open"}
        </p>
      </div>

      <div
        id={panelId}
        ref={contentRef}
        className="pw-content"
        hidden={!showContent}
        role="region"
        aria-label="Beyond design: Pokémon, gaming and poker"
      >
        {/* Pokémon: the richest story, so it gets the most weight. */}
        <article
          data-story
          className="pw-story grid gap-8 md:grid-cols-12 md:gap-x-12 md:gap-y-10"
          style={{ "--pw-i": 0 } as CSSProperties}
        >
          <div className="md:col-span-7 md:row-span-2">{pokemonShelf}</div>
          <StoryCopy
            className="md:col-span-5"
            eyebrow="Collecting"
            title="Pokémon & Collecting"
            large
            body="I started collecting because I loved Pokémon as a kid. Today, I'm just as drawn to the cards themselves - the artwork, color, composition and tiny details that make each one feel unique."
          />
          <div className="flex items-end gap-4 md:col-span-5 md:gap-5">
            <div className="w-[56%]">{pokemonCards}</div>
            <div className="w-[30%]">{pokemonApp}</div>
          </div>
        </article>

        <article
          data-story
          className="pw-story grid gap-8 md:grid-cols-12 md:items-center md:gap-x-12"
          style={{ "--pw-i": 1 } as CSSProperties}
        >
          <div className="md:order-2 md:col-span-6 md:col-start-7">{gaming}</div>
          <StoryCopy
            className="md:order-1 md:col-span-5"
            eyebrow="Playing"
            title="Gaming"
            body="I play everything from FC and online games to story-driven RPGs. I often catch myself looking beyond the gameplay at menus, interfaces, environments and the visual details that shape the experience."
          />
        </article>

        <article
          data-story
          className="pw-story grid gap-8 md:grid-cols-12 md:items-center md:gap-x-12"
          style={{ "--pw-i": 2 } as CSSProperties}
        >
          <div className="md:col-span-5">{pokerTable}</div>
          <div className="md:col-span-6 md:col-start-7">
            <StoryCopy
              eyebrow="Thinking"
              title="Poker"
              body="I like poker for the strategy behind it - patience, reading situations and knowing when not to act. The mix of intuition, probability and decision-making is what keeps me interested."
            />
            <div className="mt-8 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:mt-10 md:w-[92%]">
              <div className="min-w-0">{pokerChips}</div>
              <div className="min-w-0">{pokerStudy}</div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

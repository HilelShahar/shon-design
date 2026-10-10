"use client";

import { useEffect, useId, useState, type CSSProperties } from "react";
import {
  IconCards,
  IconDeviceGamepad2,
  IconFlame,
  IconSpade,
  type Icon,
} from "@tabler/icons-react";

/* PLACEHOLDER copy: replace the one-liners with Shon's own words. */
type WorldItem = {
  id: "pokemon" | "gaming" | "poker" | "boxing";
  label: string;
  line: string;
  Icon: Icon;
  /** Order of the reveal, Pokémon first. */
  order: number;
};

const ITEMS: WorldItem[] = [
  {
    id: "pokemon",
    label: "Pokémon",
    line: "Cards, collectibles, rarity, and the visual identity behind them.",
    Icon: IconCards,
    order: 0,
  },
  {
    id: "gaming",
    label: "Gaming",
    line: "Game worlds and the interactive thinking behind them.",
    Icon: IconDeviceGamepad2,
    order: 1,
  },
  {
    id: "poker",
    label: "Poker",
    line: "Reading situations and making calculated decisions.",
    Icon: IconSpade,
    order: 2,
  },
  {
    id: "boxing",
    label: "Boxing",
    line: "Discipline, focus, and energy.",
    Icon: IconFlame,
    order: 3,
  },
];

function PokeBall() {
  return (
    <svg viewBox="0 0 200 200" className="pw-svg" aria-hidden="true" focusable="false">
      {/* Base: lower half, equator band and centre button stay put. */}
      <path d="M10 100a90 90 0 0 0 180 0z" fill="#e8e8ea" />
      <ellipse className="pw-light" cx="100" cy="97" rx="84" ry="8" fill="#ffffff" />
      <rect x="10" y="94" width="180" height="12" fill="#0a0a0a" />
      <circle cx="100" cy="100" r="27" fill="#0a0a0a" />
      <circle cx="100" cy="100" r="16" fill="#e8e8ea" />
      <circle cx="100" cy="100" r="9" className="pw-button-core" fill="#cfcfd3" />
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
      <circle cx="100" cy="100" r="89.5" fill="none" stroke="#ffffff" strokeOpacity="0.08" />
    </svg>
  );
}

export default function PersonalWorld() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={`pw-stage${open ? " is-open" : ""}`}>
      <div className="pw-ball-wrap">
        <span className="pw-glow" aria-hidden="true" />
        <button
          type="button"
          className="pw-ball"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Close my personal world" : "Open my personal world"}
          onClick={() => setOpen((value) => !value)}
        >
          <PokeBall />
        </button>
      </div>

      <p className="pw-hint" aria-hidden="true">
        {open ? "Tap to close" : "Tap to open"}
      </p>

      <div className="pw-items" id={panelId} role="group" aria-label="Beyond design" aria-hidden={!open}>
        <ul className="pw-items-inner">
          {ITEMS.map(({ id, label, line, Icon, order }) => (
            <li
              key={id}
              className="pw-item"
              data-item={id}
              style={{ "--pw-order": order } as CSSProperties}
            >
              <span className="pw-item-icon" aria-hidden="true">
                <Icon size={id === "pokemon" ? 22 : 20} stroke={1.5} />
              </span>
              <span className="pw-item-text">
                <span className="pw-item-label">{label}</span>
                <span className="pw-item-line">{line}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Stagger } from "@/components/motion/Motion";
import { FAQ_SETS, type FaqMode } from "@/lib/faq";

const MODES: { id: FaqMode; label: string }[] = [
  { id: "employer", label: "Employer" },
  { id: "client", label: "Client" },
];

export default function FaqSection() {
  const [mode, setMode] = useState<FaqMode>("employer");
  const [highlight, setHighlight] = useState<FaqMode>("employer");
  const [open, setOpen] = useState<string[]>([]);
  const [fading, setFading] = useState(false);
  const [settled, setSettled] = useState(false);
  const [travel, setTravel] = useState<"right" | "left" | null>(null);
  const tabs = useRef<Record<FaqMode, HTMLButtonElement | null>>({
    employer: null,
    client: null,
  });
  const timer = useRef(0);
  const fadeTimer = useRef(0);
  const travelTimer = useRef(0);

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      window.clearTimeout(fadeTimer.current);
      window.clearTimeout(travelTimer.current);
    },
    [],
  );

  const selectMode = (next: FaqMode, focus = false) => {
    if (next === highlight || fading || travel) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setHighlight(next);
    setSettled(true);
    window.clearTimeout(timer.current);
    window.clearTimeout(fadeTimer.current);
    if (reduce) {
      setMode(next);
      setOpen([]);
      setFading(false);
      if (focus) tabs.current[next]?.focus();
      return;
    }
    setTravel(next === "client" ? "right" : "left");
    window.clearTimeout(travelTimer.current);
    travelTimer.current = window.setTimeout(() => setTravel(null), 440);
    fadeTimer.current = window.setTimeout(() => setFading(true), 100);
    timer.current = window.setTimeout(() => {
      setMode(next);
      setOpen([]);
      setFading(false);
      if (focus) tabs.current[next]?.focus();
    }, 220);
  };

  const onTabsKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const index = MODES.findIndex((item) => item.id === mode);
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = MODES[(index + step + MODES.length) % MODES.length].id;
    selectMode(next, true);
  };

  const items = FAQ_SETS[mode];

  return (
    <section id="faq" className="px-4 py-20" dir="ltr">
      <div className="mx-auto max-w-4xl">
        <div
          role="tablist"
          aria-label="FAQ audience"
          dir="ltr"
          className="faq-mode-switch relative mb-5 inline-grid grid-cols-2 rounded-full bg-white/[0.05] p-1 ring-1 ring-inset ring-white/[0.08]"
          onKeyDown={onTabsKeyDown}
        >
          <span
            aria-hidden="true"
            className={`faq-mode-thumb pointer-events-none absolute bottom-1 left-1 top-1 w-[calc(50%-0.25rem)] rounded-full ${
              highlight === "client" ? "is-client" : "is-employer"
            } ${travel === "right" ? "is-right" : travel === "left" ? "is-left" : ""}`}
            onAnimationEnd={(event) => {
              if (event.animationName !== "faq-blob-right" && event.animationName !== "faq-blob-left") return;
              window.clearTimeout(travelTimer.current);
              setTravel(null);
            }}
          />
          {MODES.map((item) => {
            const selected = highlight === item.id;
            return (
              <button
                key={item.id}
                ref={(node) => {
                  tabs.current[item.id] = node;
                }}
                type="button"
                role="tab"
                id={`faq-tab-${item.id}`}
                aria-selected={selected}
                aria-controls="faq-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => selectMode(item.id)}
                className={`relative z-10 h-9 rounded-full px-3.5 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
                  selected ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <Stagger nested className="mx-auto max-w-4xl">
          <div
            id="faq-panel"
            role="tabpanel"
            aria-labelledby={`faq-tab-${mode}`}
            className={`transition-opacity duration-[120ms] ease-out ${fading ? "opacity-0" : "opacity-100"}`}
          >
            <Accordion type="multiple" value={open} onValueChange={setOpen} className="space-y-4">
              {items.map((item, i) => (
                <AccordionItem
                  key={`${mode}-${i}`}
                  value={`item-${i}`}
                  data-motion-item=""
                  style={{
                    animationDelay: `${Math.min(i, 5) * 85}ms`,
                    animation: settled ? "none" : undefined,
                  }}
                  className="bg-card border border-border rounded-2xl px-6"
                >
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent className="whitespace-pre-line">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Stagger>
      </div>
    </section>
  );
}

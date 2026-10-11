"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowUp } from "lucide-react";
import PillNav from "@/components/PillNav";
import SiteFooter from "@/components/SiteFooter";
import TestimonialCard from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";
import { MaskedReveal, Reveal } from "@/components/motion/Motion";
import { WHATSAPP_HREF } from "@/lib/social";
import type { Testimonial } from "@/lib/testimonials";

function scrollThreshold() {
  return Math.max(420, Math.round(window.innerHeight * 0.7));
}

export function CaseStudyBackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(window.scrollY > scrollThreshold());
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    if (reduce) {
      window.scrollTo(0, 0);
      root.style.scrollBehavior = previous;
      return;
    }
    const start = window.scrollY;
    const duration = 420;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      window.scrollTo(0, start * (1 - eased));
      if (t < 1) {
        window.requestAnimationFrame(step);
        return;
      }
      root.style.scrollBehavior = previous;
    };
    window.requestAnimationFrame(step);
  };

  return (
    <button
      type="button"
      className={visible ? "zach-to-top is-visible" : "zach-to-top"}
      aria-label="Back to top"
      aria-hidden={visible ? undefined : true}
      tabIndex={visible ? 0 : -1}
      onClick={scrollToTop}
    >
      <ArrowUp size={18} strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}

export function CaseStudyFrame({ children }: { children: ReactNode }) {
  return (
    <div className="zach-study min-h-screen bg-background text-foreground">
      <PillNav />
      {children}
      <CaseStudyCta />
      <SiteFooter />
      <CaseStudyBackToTop />
    </div>
  );
}

function splitHeroTitle(title: string) {
  const match = title.match(/^(.+?)\s+[—–-]\s+(.+)$/);
  if (!match) return { heading: title, subtitle: null };
  return { heading: match[1], subtitle: match[2] };
}

/** Short titles stay at Salif's size. Longer ones scale down only enough to wrap to about two lines. */
function titleScale(heading: string) {
  const length = heading.trim().length;
  if (length > 28) return "is-long";
  if (length > 16) return "is-medium";
  return "";
}

export function CaseStudyTitleHero({
  title,
  tags,
  media,
}: {
  title: string;
  tags?: string[];
  /** Optional hero media. Fills the existing hero visual slot. */
  media?: ReactNode;
}) {
  const visibleTags = tags?.filter(Boolean) ?? [];
  const { heading, subtitle } = splitHeroTitle(title);
  const scale = titleScale(heading);
  return (
    <section
      className={media ? "zach-hero case-study-hero has-media" : "zach-hero case-study-hero"}
      aria-label={title}
    >
      <div
        className={media ? "case-study-hero-visual has-media" : "case-study-hero-visual"}
        aria-hidden="true"
      >
        {media}
      </div>
      <div className="zach-hero-layout">
        <div className="zach-hero-copy">
          {visibleTags.length > 0 ? (
            <Reveal>
              <ul className="zach-tags">
                {visibleTags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </Reveal>
          ) : null}
          <div className="zach-hero-names">
            <MaskedReveal as="h1" className={scale ? `zach-title ${scale}` : "zach-title"}>
              {heading}
            </MaskedReveal>
            {subtitle ? (
              <Reveal delay={70}>
                <p className="zach-title-sub">{subtitle}</p>
              </Reveal>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CaseStudyOverview({
  intro,
  introRtl = false,
  preserveBreaks = false,
  note,
  meta,
}: {
  intro?: ReactNode;
  introRtl?: boolean;
  preserveBreaks?: boolean;
  note?: string;
  meta?: { label: string; value: ReactNode }[];
}) {
  const items = meta?.filter((item) => item.value != null && item.value !== "") ?? [];
  if (!intro && !note && items.length === 0) return null;
  return (
    <section className="zach-block">
      <div className="zach-overview">
        {intro ? (
          <div>
            <MaskedReveal as="h2" className="zach-heading">
              Overview
            </MaskedReveal>
            <Reveal delay={80}>
              <p
                className={`zach-prose mt-5${preserveBreaks ? " whitespace-pre-line" : ""}`}
                dir={introRtl ? "rtl" : undefined}
              >
                {intro}
              </p>
              {note ? <p className="mt-4 text-xs text-muted-foreground/70">{note}</p> : null}
            </Reveal>
          </div>
        ) : null}
        {items.length > 0 ? (
          <Reveal delay={100}>
            <dl className="zach-meta">
              {items.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

export function CaseStudyText({
  title,
  children,
  wide = false,
  constrain = false,
}: {
  title: string;
  children?: ReactNode;
  wide?: boolean;
  constrain?: boolean;
}) {
  const body = typeof children === "string" ? children.trim() : children;
  if (body == null || body === "") return null;
  return (
    <section className={wide ? "zach-block zach-block-wide" : "zach-block"}>
      <MaskedReveal as="h2" className="zach-heading">{title}</MaskedReveal>
      <Reveal delay={80}>
        {typeof body === "string" ? (
          <p className={`zach-draft zach-prose mt-5${constrain ? " max-w-2xl" : ""}`}>{body}</p>
        ) : (
          body
        )}
      </Reveal>
    </section>
  );
}

export function CaseStudyCreativeDirection({ children }: { children?: ReactNode }) {
  const body = typeof children === "string" ? children.trim() : children;
  if (body == null || body === "") return null;
  return (
    <section className="zach-block zach-block-wide">
      <MaskedReveal as="h2" className="zach-heading">Creative Direction</MaskedReveal>
      <Reveal delay={80}>
        <div className="zach-split mt-6">
          {typeof body === "string" ? <p className="zach-prose">{body}</p> : body}
        </div>
      </Reveal>
    </section>
  );
}

export type CaseStudyProcessStep = {
  label: string;
  note: string;
  image?: string;
  alt?: string;
};

export function CaseStudyProcess({
  intro,
  steps,
}: {
  intro?: string;
  steps?: CaseStudyProcessStep[];
}) {
  const visible = steps?.filter((step) => step.label || step.note) ?? [];
  if (!intro && visible.length === 0) return null;
  return (
    <section className="zach-block zach-block-wide">
      <MaskedReveal as="h2" className="zach-heading">Process</MaskedReveal>
      {intro ? (
        <Reveal delay={80}>
          <p className="zach-draft zach-prose mt-5 max-w-2xl">{intro}</p>
        </Reveal>
      ) : null}
      {visible.length > 0 ? (
        <div className="zach-process">
          {visible.map((slot) => (
            <Reveal key={slot.label}>
              <figure className="zach-slot">
                <div className={slot.image ? "zach-slot-frame has-media" : "zach-slot-frame"} aria-hidden={slot.image ? undefined : true}>
                  {slot.image ? (
                    <img src={slot.image} alt={slot.alt ?? ""} />
                  ) : null}
                </div>
                <figcaption>
                  <span>{slot.label}</span>
                  <p className="zach-draft">{slot.note}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function CaseStudyFinalWork({
  intro,
  image,
  alt,
}: {
  intro?: string;
  image?: string;
  alt?: string;
}) {
  if (!intro && !image) return null;
  return (
    <section className="zach-block zach-block-wide">
      <MaskedReveal as="h2" className="zach-heading">Final Work</MaskedReveal>
      {intro ? (
        <Reveal delay={80}>
          <p className="zach-draft zach-prose mt-5 max-w-2xl">{intro}</p>
        </Reveal>
      ) : null}
      {image ? (
        <Reveal media className="zach-outcome">
          <img src={image} alt={alt ?? ""} />
        </Reveal>
      ) : null}
    </section>
  );
}

export function CaseStudyClientFeedback({
  testimonial,
  note,
}: {
  testimonial?: Testimonial | null;
  note?: string;
}) {
  if (!testimonial && !note) return null;
  return (
    <section className="zach-block">
      <MaskedReveal as="h2" className="zach-heading">Client Feedback</MaskedReveal>
      {testimonial ? (
        <Reveal delay={80}>
          <TestimonialCard item={testimonial} className="mt-5 w-full max-w-[400px]" />
        </Reveal>
      ) : (
        <Reveal delay={80}>
          <p className="zach-draft zach-prose mt-5">{note}</p>
        </Reveal>
      )}
    </section>
  );
}

export function CaseStudyClose({
  reflection,
  showAllWork = true,
  proseClassName,
}: {
  reflection?: ReactNode;
  showAllWork?: boolean;
  proseClassName?: string;
}) {
  const body = typeof reflection === "string" ? reflection.trim() : reflection;
  if ((body == null || body === "") && !showAllWork) return null;
  return (
    <section className="zach-block zach-end">
      {body ? (
        <>
          <MaskedReveal as="h2" className="zach-heading">Reflection</MaskedReveal>
          <Reveal delay={80}>
            {typeof body === "string" ? (
              <p className={`zach-draft zach-prose mt-5${proseClassName ? ` ${proseClassName}` : ""}`}>{body}</p>
            ) : (
              body
            )}
          </Reveal>
        </>
      ) : null}
      {showAllWork ? (
        <Reveal delay={120}>
          <Link href="/work" className="zach-back">
            All work
          </Link>
        </Reveal>
      ) : null}
    </section>
  );
}

export function CaseStudyCta() {
  return (
    <section id="contact" className="px-4 py-20 text-center">
      <div className="mx-auto max-w-4xl">
        <MaskedReveal as="h2" className="mb-6 text-4xl md:text-5xl font-serif">Ready to start?</MaskedReveal>
        <Reveal delay={90}>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
            Tell me about your project and timelines — I’ll reply quickly with next steps.
          </p>
        </Reveal>
        <Reveal delay={170}>
          <div className="flex justify-center gap-3">
            <Button size="lg" variant="accent" className="rounded-full px-8" asChild>
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
                Let’s talk
              </a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
              <a href="mailto:shonsimhon@gmail.com?subject=Project%20Inquiry">
                Email me
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import PillNav from "@/components/PillNav";
import { MaskedReveal, Reveal } from "@/components/motion/Motion";
import type { Project } from "@/lib/projects";

const TAGS = ["Cover art", "Music", "Artwork"];
const HERO_TAGS = ["Cover art", "Music", "Artwork", "Branding", "Merchandise"];
const TRACK_DESIGN_INTRO =
  "After listening to the track, I built the visual direction around the feeling it gave me: an African sunset, warm colors, and a deep atmosphere. From there, I connected the music, the African-inspired visual language, and the landscape into one cohesive world.";

function scrollThreshold() {
  return Math.max(420, Math.round(window.innerHeight * 0.7));
}

function ZachBackToTop() {
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

const PROCESS = [
  {
    label: "Sketches",
    note: "Add early drawings of the figure, the ridge, and the title.",
  },
  {
    label: "Composition",
    note: "Add studies for how the portrait, sunset, and type share the square.",
  },
  {
    label: "Color",
    note: "Add the red, clay, and gold trials.",
  },
  {
    label: "Notes",
    note: "Add short notes on what the cover had to protect at a small size.",
  },
];

export default function ZachCaseStudy({ project }: { project: Project }) {
  return (
    <div className="zach-study min-h-screen bg-background text-foreground">
      <PillNav />

      <section className="zach-hero" aria-label="Salif Keita, Zach">
        <div className="zach-sky" aria-hidden="true">
          <img className="zach-sky-photo" src="/zach-hero-sky.jpg" alt="" />
          <span className="zach-sky-shade" />
          <span className="zach-haze" />
        </div>

        <div className="zach-hero-layout">
          <div className="zach-hero-copy">
            <Reveal>
              <ul className="zach-tags">
                {HERO_TAGS.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </Reveal>
            <MaskedReveal as="h1" className="zach-title">
              Salif Keita
            </MaskedReveal>
            <Reveal delay={70}>
              <p className="zach-title-sub">Zach</p>
            </Reveal>
          </div>

          <figure className="zach-hero-art">
            <img src={project.cover} alt="Salif Keita cover artwork for the ZACH remix" />
          </figure>
        </div>
      </section>

      <section className="zach-block">
        <div className="zach-overview">
          <div>
            <MaskedReveal as="h2" className="zach-heading">
              {project.title}
            </MaskedReveal>
            <Reveal delay={80}>
              <p className="zach-prose mt-5">{TRACK_DESIGN_INTRO}</p>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <dl className="zach-meta">
              <div>
                <dt>Tags</dt>
                <dd>{TAGS.join(" · ")}</dd>
              </div>
              <div>
                <dt>Year</dt>
                <dd>{project.year}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>Track cover</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd className="zach-draft">Add your role on this project.</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="zach-block">
        <MaskedReveal as="h2" className="zach-heading">Goal</MaskedReveal>
        <Reveal delay={80}>
          <p className="zach-draft zach-prose mt-5">
            Write the aim of the cover here. What the track needed listeners to feel, and what the artwork had to carry.
          </p>
        </Reveal>
      </section>

      <section className="zach-block">
        <MaskedReveal as="h2" className="zach-heading">Constraints</MaskedReveal>
        <Reveal delay={80}>
          <p className="zach-draft zach-prose mt-5">
            Write the limits here. Format, deadline, what had to stay readable, and anything the cover was not allowed to lose.
          </p>
        </Reveal>
      </section>

      <section className="zach-block">
        <MaskedReveal as="h2" className="zach-heading">Role</MaskedReveal>
        <Reveal delay={80}>
          <p className="zach-draft zach-prose mt-5">
            Write what you owned on this project. Design, art direction, type, or collaboration with the producer.
          </p>
        </Reveal>
      </section>

      <section className="zach-block zach-block-wide">
        <MaskedReveal as="h2" className="zach-heading">Visual direction</MaskedReveal>
        <Reveal delay={80}>
          <div className="zach-split mt-6">
            <p className="zach-prose">
              The cover treats the remix as a passage through a red sunset. Warm sky, haze, and a quiet strip of land carry the place the music points toward, while the portrait is held in the same light so the producer and the landscape feel like one image.
            </p>
            <p className="zach-prose">
              The color stays inside ember, clay, and gold. A tree, animals, and a figure on the ridge keep the scene readable at cover size, without turning the land into a postcard.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="zach-block zach-block-wide">
        <MaskedReveal as="h2" className="zach-heading">Process</MaskedReveal>
        <Reveal delay={80}>
          <p className="zach-draft zach-prose mt-5 max-w-2xl">
            This row is ready for the exploration. Replace each frame with a sketch, a composition study, a color trial, or a short note.
          </p>
        </Reveal>
        <div className="zach-process">
          {PROCESS.map((slot) => (
            <Reveal key={slot.label}>
              <figure className="zach-slot">
                <div className="zach-slot-frame" aria-hidden="true" />
                <figcaption>
                  <span>{slot.label}</span>
                  <p className="zach-draft">{slot.note}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="zach-block zach-block-wide">
        <MaskedReveal as="h2" className="zach-heading">Final outcome</MaskedReveal>
        <Reveal delay={80}>
          <p className="zach-prose mt-5 max-w-2xl">
            The finished cover, presented as one continuous piece.
          </p>
        </Reveal>
        <Reveal media className="zach-outcome">
          <img src={project.longImage} alt="Final Salif Keita and Zach cover presentation" />
        </Reveal>
      </section>

      <section className="zach-block zach-end">
        <MaskedReveal as="h2" className="zach-heading">Reflection</MaskedReveal>
        <Reveal delay={80}>
          <p className="zach-draft zach-prose mt-5">
            Write what held the concept together, what you would refine, and why this cover feels like the track.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <Link href="/work" className="zach-back">
            All work
          </Link>
        </Reveal>
      </section>
      <ZachBackToTop />
    </div>
  );
}

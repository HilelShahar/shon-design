"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import PillNav from "@/components/PillNav";
import SalifVinylVideo from "@/components/SalifVinylVideo";
import SiteFooter from "@/components/SiteFooter";
import TestimonialCard from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";
import { MaskedReveal, Reveal } from "@/components/motion/Motion";
import type { Project } from "@/lib/projects";
import { WHATSAPP_HREF } from "@/lib/social";
import { ZACH_CLIENT_FEEDBACK } from "@/lib/testimonials";

const HERO_TAGS = ["Cover art", "Art direction", "Visual identity", "Merchandise"];
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
    label: "Exploration",
    note: "I researched African safari landscapes, red sunsets, and visual references that matched the feeling of the track.",
  },
  {
    label: "Composition",
    note: "I tested several layouts until the character, landscape, and sunset felt balanced and focused.",
  },
  {
    label: "Color & Typography",
    note: "The palette came directly from the deep red African sunset, paired with typography that supported the African atmosphere.",
  },
  {
    label: "Refinement",
    note: "I refined the character, hierarchy, and small details until the cover felt clear, atmospheric, and cohesive.",
  },
];

function ZachSkyVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const armed = useRef(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || video.error) {
      setFailed(true);
      return;
    }

    const reveal = () => setReady(true);
    const arm = () => {
      if (armed.current) return;
      if (typeof video.requestVideoFrameCallback === "function") {
        armed.current = true;
        video.requestVideoFrameCallback(() => reveal());
        return;
      }
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        armed.current = true;
        reveal();
      }
    };

    arm();
    video.addEventListener("loadeddata", arm);
    video.addEventListener("canplay", arm);
    video.addEventListener("playing", arm);
    const onError = () => setFailed(true);
    video.addEventListener("error", onError);
    return () => {
      video.removeEventListener("loadeddata", arm);
      video.removeEventListener("canplay", arm);
      video.removeEventListener("playing", arm);
      video.removeEventListener("error", onError);
    };
  }, []);

  if (failed) return null;

  return (
    <video
      ref={ref}
      className={ready ? "zach-sky-video is-ready" : "zach-sky-video"}
      src="/media/salif/safari-sunset-loop.mp4"
      poster="/media/salif/safari-sunset-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onCanPlay={(event) => {
        const video = event.currentTarget;
        video.muted = true;
        if (video.paused) video.play().catch(() => undefined);
      }}
    />
  );
}

export default function ZachCaseStudy({ project }: { project: Project }) {
  return (
    <div className="zach-study min-h-screen bg-background text-foreground">
      <PillNav />

      <section className="zach-hero" aria-label="Salif Keita, Zach">
        <div className="zach-sky" aria-hidden="true">
          <img
            className="zach-sky-photo"
            src="/media/salif/safari-sunset-poster.jpg"
            alt=""
            width={1024}
            height={576}
            fetchPriority="high"
            decoding="async"
          />
          <ZachSkyVideo />
          <span className="zach-sky-shade" />
          <span className="zach-haze" />
        </div>

        <SalifVinylVideo />

        <div className="zach-hero-layout">
          <div className="zach-hero-copy">
            <Reveal>
              <ul className="zach-tags">
                {HERO_TAGS.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </Reveal>
            <div className="zach-hero-names">
              <MaskedReveal as="h1" className="zach-title">
                Salif Keita
              </MaskedReveal>
              <Reveal delay={70}>
                <p className="zach-title-sub">Zach</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="zach-block">
        <div className="zach-overview">
          <div>
            <MaskedReveal as="h2" className="zach-heading">
              Overview
            </MaskedReveal>
            <Reveal delay={80}>
              <p className="zach-prose mt-5">{TRACK_DESIGN_INTRO}</p>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <dl className="zach-meta">
              <div>
                <dt>Role</dt>
                <dd>Art Direction &amp; Cover Design</dd>
              </div>
              <div>
                <dt>Year</dt>
                <dd>{project.year}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>Music Visual Identity</dd>
              </div>
              <div>
                <dt>Deliverables</dt>
                <dd>Cover Art / Poster / Social Media / Merch / Spotify Assets</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="zach-block">
        <MaskedReveal as="h2" className="zach-heading">Goal</MaskedReveal>
        <Reveal delay={80}>
          <p className="zach-draft zach-prose mt-5">
            The goal was to translate the feeling of the track into a visual experience that feels like a natural extension of the music.
          </p>
        </Reveal>
      </section>

      <section className="zach-block">
        <MaskedReveal as="h2" className="zach-heading">Constraints</MaskedReveal>
        <Reveal delay={80}>
          <p className="zach-draft zach-prose mt-5">
            Keep the African influence clear while making sure the key details still work at small sizes, such as Spotify and in-car displays.
          </p>
        </Reveal>
      </section>

      <section className="zach-block zach-block-wide">
        <MaskedReveal as="h2" className="zach-heading">Creative Direction</MaskedReveal>
        <Reveal delay={80}>
          <div className="zach-split mt-6">
            <p className="zach-prose">
              The direction came from the track&apos;s African sound. I imagined a woman overlooking the safari at a deep red sunset, and built the visual world around that feeling.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="zach-block zach-block-wide">
        <MaskedReveal as="h2" className="zach-heading">Process</MaskedReveal>
        <Reveal delay={80}>
          <p className="zach-draft zach-prose mt-5 max-w-2xl">
            I started by listening to the track several times and letting the music shape the visual direction. From there, I researched African safari imagery, explored compositions, and refined the color, typography, and character.
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
        <MaskedReveal as="h2" className="zach-heading">Final Work</MaskedReveal>
        <Reveal delay={80}>
          <p className="zach-draft zach-prose mt-5 max-w-2xl">
            The final direction expanded beyond the cover into a wider visual identity, including merchandise, artist posters, vinyl and CD mockups, stickers, tags, and Spotify applications.
          </p>
        </Reveal>
        <Reveal media className="zach-outcome">
          <img src={project.longImage} alt="Final Salif Keita and Zach cover presentation" />
        </Reveal>
      </section>

      <section className="zach-block">
        <MaskedReveal as="h2" className="zach-heading">Outcome</MaskedReveal>
        <Reveal delay={80}>
          <p className="zach-draft zach-prose mt-5">
            The client was very happy with the result and released the track on SoundCloud. The visual direction also received positive feedback from his colleagues, some of whom reached out to me directly after seeing the work. He especially liked how the project expanded beyond the cover into a complete visual world.
          </p>
        </Reveal>
      </section>

      <section className="zach-block">
        <MaskedReveal as="h2" className="zach-heading">Client Feedback</MaskedReveal>
        {ZACH_CLIENT_FEEDBACK ? (
          <Reveal delay={80}>
            <TestimonialCard item={ZACH_CLIENT_FEEDBACK} className="mt-5 w-full max-w-[400px]" />
          </Reveal>
        ) : null}
      </section>

      <section className="zach-block zach-end">
        <MaskedReveal as="h2" className="zach-heading">Reflection</MaskedReveal>
        <Reveal delay={80}>
          <p className="zach-draft zach-prose mt-5">
            This project showed me how music can be translated into a visual experience that carries the same emotion. Following the client&apos;s request to listen first helped me trust the feeling of the track and turn it into a strong visual direction, especially through color.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <Link href="/work" className="zach-back">
            All work
          </Link>
        </Reveal>
      </section>

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

      <SiteFooter />
      <ZachBackToTop />
    </div>
  );
}

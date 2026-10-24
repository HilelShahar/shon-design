import type { ReactNode } from "react";
import Link from "next/link";
import AboutImage from "@/components/about/AboutImage";
import PersonalWorld from "@/components/about/PersonalWorld";
import { MaskedReveal, Reveal } from "@/components/motion/Motion";
import { Button } from "@/components/ui/button";
import { WHATSAPP_HREF } from "@/lib/social";

/*
 * Story sections under the About hero. Typography scale used throughout:
 *   eyebrow  -> .about-eyebrow
 *   heading  -> .about-heading (serif, balanced)
 *   lead     -> .about-lead (serif)
 *   body     -> .about-body (sans, ~60ch, pretty wrap)
 * Section spacing is whitespace; hairlines are used only where they carry meaning.
 */

function SectionHead({
  index,
  title,
  className = "",
  headingClassName = "",
}: {
  index: string;
  title: ReactNode;
  className?: string;
  headingClassName?: string;
}) {
  return (
    <header className={`about-story-head ${className}`}>
      <Reveal as="p" className="about-eyebrow">
        {index}
      </Reveal>
      <MaskedReveal as="h2" className={`about-heading mt-5${headingClassName ? ` ${headingClassName}` : ""}`}>
        {title}
      </MaskedReveal>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* 01 · A Little About Me                                              */
/* ------------------------------------------------------------------ */

export function LittleAboutMe() {
  return (
    <section className="border-t border-border px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-12 md:gap-x-12">
        <div className="max-md:order-1 md:col-span-5">
          <SectionHead index="01" title="A Little About Me" />
          <div className="mt-9 space-y-6">
            <Reveal as="p" className="about-body" delay={80}>
              I actually found design through a dropshipping business I started. I needed ads, opened
              Canva, started experimenting, and the positive response made me curious enough to learn the
              craft properly.
            </Reveal>
            <Reveal as="p" className="about-body" delay={140}>
              Since then, my focus has grown from visual design into UI, digital products, AI and vibe
              coding. I&apos;m especially interested in understanding what a design needs to communicate,
              not just how it should look, and turning ideas into clear, useful experiences.
            </Reveal>
          </div>
        </div>

        <Reveal media className="max-md:order-2 md:col-span-6 md:col-start-7">
          <AboutImage
            src="/about/shon-about-personal.jpg"
            alt="Shon Simhon, relaxed and candid"
            ratio="4 / 5"
            sizes="(min-width: 768px) 46vw, 100vw"
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 02 · Beyond Design                                                  */
/* ------------------------------------------------------------------ */

export function BeyondDesign() {
  return (
    <section className="px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-12 md:gap-x-12">
          <SectionHead index="02" title="Beyond Design" className="md:col-span-5" />
          <Reveal as="p" delay={90} className="about-body md:col-span-6 md:col-start-7 md:pt-12">
            Design follows me outside of work too. I notice it in the things I collect, the games I play,
            and even the way I think at a poker table.
          </Reveal>
        </div>

        <Reveal media className="mt-6 md:mt-4">
          <PersonalWorld
            pokemonShelf={
              <AboutImage
                src="/about/pokemon-shelf.jpg"
                alt="My Pokémon collection on its shelf"
                ratio="4 / 3"
                sizes="(min-width: 768px) 58vw, 100vw"
              />
            }
            pokemonCards={
              <AboutImage
                src="/about/pokemon-cards.jpg"
                alt="A few favourite Pokémon cards, up close"
                ratio="1 / 1"
                sizes="(min-width: 768px) 22vw, 60vw"
              />
            }
            pokemonApp={
              <AboutImage
                src="/about/pokemon-collection-app.jpg"
                alt="Screenshot of my Pokémon collection app"
                ratio="9 / 19"
                sizes="(min-width: 768px) 12vw, 32vw"
              />
            }
            gaming={
              <AboutImage
                src="/about/gaming-shon.jpg"
                alt="Me playing"
                ratio="5 / 4"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            }
            pokerTable={
              <AboutImage
                src="/about/poker-table.jpg"
                alt="A poker table"
                ratio="4 / 5"
                sizes="(min-width: 768px) 40vw, 100vw"
              />
            }
            pokerChips={
              <AboutImage
                src="/about/poker-chips.jpg"
                alt="Poker chips, close up"
                ratio="4 / 3"
                sizes="(min-width: 768px) 24vw, 60vw"
              />
            }
            pokerStudy={
              <AboutImage
                src="/about/poker-study.jpg"
                alt="Poker strategy study on a solver screen"
                ratio="4 / 3"
                sizes="(min-width: 768px) 24vw, 60vw"
              />
            }
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 03 · How I Think & Work                                             */
/* ------------------------------------------------------------------ */

const PRINCIPLES: { n: string; title: ReactNode; body: string }[] = [
  {
    n: "A",
    title: "Think Before Making",
    body: "I care about what the design needs to say, not just how it looks. I like to understand the message first, simplify the information, and then turn it into something clear and visual.",
  },
  {
    n: "B",
    title: "Learn From People",
    body: "I'm curious, open to feedback, and always looking to improve. I enjoy working with people who challenge me, teach me something new, and push the work forward.",
  },
  {
    n: "C",
    title: (
      <>
        Use Technology <span className="about-heading-keep">With Purpose</span>
      </>
    ),
    body: "AI and vibe coding are a natural part of how I work. I use them to explore faster, test ideas, and solve small problems that can save real time in everyday work.",
  },
];

export function HowIThinkAndWork() {
  return (
    <section className="px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          index="03"
          headingClassName="about-heading-think"
          title={<span className="about-heading-keep">How I Think &amp; Work</span>}
        />

        <ol className="mt-14 md:mt-20">
          {PRINCIPLES.map((item) => (
            <li key={item.n} className="border-t border-white/10 first:border-t-0">
              <Reveal className="grid gap-4 py-10 md:grid-cols-12 md:gap-x-12 md:py-14">
                <p className="about-numeral md:col-span-2" aria-hidden="true">
                  {item.n}
                </p>
                <h3 className="about-principle md:col-span-5">{item.title}</h3>
                <p className="about-body md:col-span-5">{item.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 04 · Where I'm Heading                                              */
/* ------------------------------------------------------------------ */

export function WhereImHeading() {
  return (
    <section className="px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12 md:gap-x-12">
        <SectionHead index="04" title="Where I'm Heading" className="md:col-span-5" />

        <div className="md:col-span-7">
          <Reveal as="p" className="about-lead" delay={80}>
            I&apos;m looking for a place where I can contribute, learn from strong people around me, and
            keep becoming a better designer.
          </Reveal>
          <Reveal as="p" className="about-body mt-8 md:mt-10" delay={150}>
            I&apos;m especially drawn to teams that care about good work, honest feedback, and constant
            improvement. If that happens to be in gaming or another world I genuinely connect with, even
            better.
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 05 · Final CTA                                                      */
/* ------------------------------------------------------------------ */

export function AboutCta() {
  return (
    <section className="border-t border-border px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="about-cta-title">
          <MaskedReveal as="h2" className="about-heading about-heading-xl">
            That&apos;s a little about me.
          </MaskedReveal>
        </div>
        <Reveal as="p" className="about-lead about-lead-muted mt-6" delay={90}>
          Now you can see what I make.
        </Reveal>

        <Reveal delay={170} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-5">
          <Button size="lg" variant="accent" className="rounded-full px-8" asChild>
            <Link href="/work">View My Work</Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
            <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
              Let&apos;s Talk
            </a>
          </Button>
          <Link
            href="/resume"
            className="font-sans text-sm text-muted-foreground underline decoration-white/20 underline-offset-[6px] transition-colors hover:text-foreground hover:decoration-white/60"
          >
            Resume
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

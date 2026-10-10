import { MaskedReveal, Reveal, Stagger } from "@/components/motion/Motion";
import { Button } from "@/components/ui/button";
import { WHATSAPP_HREF } from "@/lib/social";
import PersonalWorld from "@/components/about/PersonalWorld";

/*
 * Story sections that continue under the About hero.
 * All copy below is PLACEHOLDER and meant to be rewritten in Shon's own voice.
 */

function SectionHead({
  index,
  title,
  className = "",
}: {
  index: string;
  title: string;
  className?: string;
}) {
  return (
    <header className={`about-story-head ${className}`}>
      <Reveal
        as="p"
        className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white/50"
      >
        {index}
      </Reveal>
      <MaskedReveal as="h2" className="mt-4 font-serif text-3xl leading-[1.08] md:text-5xl">
        {title}
      </MaskedReveal>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* 1. How I got here                                                   */
/* ------------------------------------------------------------------ */

const STORY_BEATS = [
  {
    title: "Starting with visuals",
    body: "Graphic design taught me to see: spacing, rhythm, contrast, and the quiet decisions that make a layout feel intentional.",
  },
  {
    title: "Growing into UX/UI",
    body: "I moved into digital products because I like how things work as much as how they look. I find the friction, then fix it.",
  },
  {
    title: "Designing with new tools",
    body: "I bring design thinking together with AI and vibe coding, so I can test ideas faster and stay close to what actually ships.",
  },
];

export function HowIGotHere() {
  return (
    <section className="border-t border-border px-4 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12 md:gap-10">
        <SectionHead index="01" title="How I got here" className="md:col-span-5" />

        <div className="md:col-span-7">
          <Reveal as="p" className="font-serif text-2xl leading-snug text-foreground md:text-[2rem]">
            I started as a graphic designer, pulled in by color, typography, and the small details that
            make something feel right.
          </Reveal>

          <Stagger className="mt-12 divide-y divide-white/10 border-y border-white/10">
            {STORY_BEATS.map((beat) => (
              <div key={beat.title} className="grid gap-2 py-6 sm:grid-cols-[13rem_1fr] sm:gap-8">
                <h3 className="font-sans text-sm font-medium text-foreground">{beat.title}</h3>
                <p className="font-sans text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {beat.body}
                </p>
              </div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Beyond design                                                    */
/* ------------------------------------------------------------------ */

export function BeyondDesign() {
  return (
    <section className="px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-12 md:gap-10">
          <SectionHead index="02" title="Beyond design" className="md:col-span-5" />
          <Reveal delay={80} className="md:col-span-7 md:pt-10">
            <p className="max-w-md font-sans text-base leading-relaxed text-muted-foreground">
              The things outside the work that shape how I see it. Open the Poké Ball to take a look.
            </p>
          </Reveal>
        </div>

        <Reveal media className="mt-10 md:mt-6">
          <PersonalWorld />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. How I think & work                                               */
/* ------------------------------------------------------------------ */

const PRINCIPLES = [
  {
    title: "Easy to work with",
    body: "I communicate early, stay open, and make collaboration feel simple for designers, developers, and clients.",
  },
  {
    title: "Feedback makes it better",
    body: "I take feedback seriously, ask the right follow-ups, and turn it into a clearly stronger next version.",
  },
  {
    title: "A step ahead",
    body: "I like thinking ahead, spotting what could go wrong, and taking initiative before I'm asked.",
  },
  {
    title: "Design plus AI",
    body: "Design thinking, problem solving, and AI tools sit in one workflow, so ideas move faster without losing care.",
  },
];

export function HowIThinkAndWork() {
  return (
    <section className="border-t border-border px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHead index="03" title="How I think & work" />

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16">
          {PRINCIPLES.map((item, i) => (
            <article
              key={item.title}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8"
            >
              <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-white/40">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-6 font-serif text-xl md:text-2xl">{item.title}</h3>
              <p className="mt-3 font-sans text-[0.9375rem] leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </article>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Where I'm heading                                                */
/* ------------------------------------------------------------------ */

const DIRECTIONS = [
  "Growing as a UX/UI designer",
  "Learning inside a strong team",
  "Building meaningful digital work",
];

export function WhereImHeading() {
  return (
    <section className="border-t border-border px-4 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12 md:gap-10">
        <SectionHead index="04" title="Where I'm heading" className="md:col-span-5" />

        <div className="md:col-span-7">
          <Reveal
            as="p"
            className="font-serif text-2xl leading-snug text-foreground md:text-[2rem] md:leading-[1.25]"
          >
            I want to keep growing as a UX/UI designer, inside a team that pushes me, building digital
            products that matter. Games and interactive worlds are a direction I&apos;m quietly drawn
            to.
          </Reveal>

          <Stagger className="mt-10 flex flex-col gap-3">
            {DIRECTIONS.map((item) => (
              <p
                key={item}
                className="flex items-center gap-3 font-sans text-sm text-muted-foreground"
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-primary)]"
                />
                {item}
              </p>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Final CTA                                                        */
/* ------------------------------------------------------------------ */

export function AboutCta() {
  return (
    <section className="border-t border-border px-4 py-24 text-center md:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="about-cta-title">
          <MaskedReveal as="h2" className="font-serif text-4xl leading-[1.08] md:text-6xl">
            Let&apos;s make something good.
          </MaskedReveal>
        </div>
        <Reveal delay={90}>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            If something here resonated, I&apos;d love to hear from you.
          </p>
        </Reveal>
        <Reveal delay={170}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button size="lg" variant="accent" className="rounded-full px-8" asChild>
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
                Let&apos;s talk
              </a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
              <a href="mailto:shonsimhon@gmail.com?subject=Hello%20Shon">Email me</a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

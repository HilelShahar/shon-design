import { existsSync } from "node:fs";
import { join } from "node:path";
import type { CSSProperties, HTMLAttributes } from "react";
import Link from "next/link";
import PillNav from "@/components/PillNav";
import SiteFooter from "@/components/SiteFooter";
import { MaskedReveal, Reveal, Stagger } from "@/components/motion/Motion";
import { Button } from "@/components/ui/button";
import { WHATSAPP_HREF } from "@/lib/social";

// Final resume file: /public/shon-simhon-resume.pdf
// It is served at /shon-simhon-resume.pdf. Until that file is in public/,
// the control stays inactive so the browser does not download this page as HTML.
const RESUME_HREF = "/shon-simhon-resume.pdf";
const resumePdfReady = existsSync(join(process.cwd(), "public", "shon-simhon-resume.pdf"));

const EXPERIENCE = [
  {
    title: "Freelance Graphic Designer",
    date: "2025 - Today",
    description:
      "Branding, visual identity, and design for digital and print across client projects. Developing concepts from understanding the need through to final execution.",
  },
  {
    title: "Tal Hashmal | Part-time",
    date: "2026 - Today",
    description:
      "Managing orders and maintaining the company website. Integrating AI tools to streamline workflows and supporting the website migration to a new platform.",
  },
  {
    title: "Makom Tov BaEmtza",
    date: "2022 - 2024",
    description:
      "Day-to-day management, operational responsibility, customer service, and team management.",
  },
];

const EDUCATION = {
  title: "Studio 6B",
  date: "2023 - 2025",
  description:
    "Studies in Graphic Design and UX/UI, including branding, typography, digital design, and user experience.",
};

const MILITARY = {
  title: "IDF | Company Sergeant Assistant",
  date: "2018 - 2021",
  description:
    "Responsible for discipline, coordinating soldiers, and maintaining order and organization.",
};

const PROFILE = [
  {
    label: "Keywords",
    items: [
      "UX/UI Design",
      "Graphic Design",
      "Branding & Visual Identity",
      "Visual Design",
      "Typography",
      "Responsive Design",
      "Prototyping",
    ],
  },
  {
    label: "Tools",
    items: ["Figma", "Illustrator", "Photoshop", "After Effects", "Cursor", "ChatGPT"],
  },
  {
    label: "Personal Skills",
    items: ["Problem Solving", "Attention to Detail", "Creative Thinking", "Client Communication"],
  },
  {
    label: "My Vibe",
    vibe: true,
    items: [
      "Curious",
      "Proactive",
      "Always Learning & Growing",
      "Open to New Technologies",
      "Positive & Easy to Work With",
      "Pokémon & Gaming Culture",
    ],
  },
  {
    label: "Languages",
    items: ["Hebrew - Native", "English - Good Proficiency"],
  },
];

function TimelineEntry({
  title,
  date,
  description,
  className,
  style,
  ...rest
}: {
  title: string;
  date: string;
  description: string;
  className?: string;
  style?: CSSProperties;
} & HTMLAttributes<HTMLElement>) {
  return (
    <article
      {...rest}
      style={style}
      className={className ?? "max-w-2xl"}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
        <h3 className="font-sans text-base font-medium leading-snug text-foreground md:text-lg">{title}</h3>
        <p className="shrink-0 font-sans text-sm tabular-nums text-muted-foreground">{date}</p>
      </div>
      <p className="mt-1.5 font-sans text-sm leading-relaxed text-muted-foreground">{description}</p>
    </article>
  );
}

function ProfileCard({
  label,
  items,
  vibe = false,
  className,
  style,
  ...rest
}: {
  label: string;
  items: string[];
  vibe?: boolean;
  className?: string;
  style?: CSSProperties;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      style={style}
      className={className ?? "rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3.5"}
    >
      <h3 className="font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-white/70">{label}</h3>
      <ul className={vibe ? "mt-3 space-y-1.5" : "mt-2.5 space-y-1"}>
        {items.map((item) => (
          <li
            key={item}
            className="font-sans text-sm leading-snug text-foreground/90"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PillNav />

      <section className="px-4 pb-2 pt-28 sm:pt-32">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10">
          <div className="max-w-xl">
            <MaskedReveal as="h1" className="font-serif text-5xl font-medium leading-[0.95] tracking-tight md:text-6xl">
              SHON SIMHON
            </MaskedReveal>
            <Reveal delay={70}>
              <p className="mt-3 font-sans text-base text-muted-foreground md:text-lg">
                Graphic Designer | Junior UX/UI Designer
              </p>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="mt-5 font-serif text-[1.75rem] font-medium tracking-tight md:text-[2rem]">About Me</h2>
              <p className="mt-2 font-sans text-sm leading-relaxed text-foreground/85 md:text-base">
                Graphic designer with a strong eye for color, typography, and detail, currently developing and specializing in UX/UI and digital products. I enjoy identifying problems, solving them, and integrating AI and vibe coding tools into my workflow.
              </p>
            </Reveal>
          </div>
          <Reveal delay={160} className="shrink-0">
            {resumePdfReady ? (
              <Button size="lg" variant="accent" className="rounded-full px-8" asChild>
                <a href={RESUME_HREF} download="shon-simhon-resume.pdf">
                  Download Resume
                </a>
              </Button>
            ) : (
              <Button size="lg" variant="accent" className="rounded-full px-8" disabled>
                Download Resume
              </Button>
            )}
          </Reveal>
        </div>
      </section>

      <section className="px-4 pb-4 pt-8 md:pt-10">
        <div className="mx-auto grid max-w-6xl items-start gap-10 md:grid-cols-[minmax(0,1fr)_15.5rem] md:gap-x-8 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-x-14">
          <div className="flex min-w-0 flex-col gap-10 md:gap-12">
            <div>
              <MaskedReveal className="font-serif text-[1.75rem] font-medium tracking-tight md:text-[2rem]">
                Professional Experience
              </MaskedReveal>
              <Stagger className="mt-5 flex flex-col gap-6">
                {EXPERIENCE.map((role) => (
                  <TimelineEntry key={role.title} {...role} />
                ))}
              </Stagger>
            </div>
            <div>
              <MaskedReveal className="font-serif text-[1.75rem] font-medium tracking-tight md:text-[2rem]">
                Education
              </MaskedReveal>
              <Reveal className="mt-5">
                <TimelineEntry {...EDUCATION} />
              </Reveal>
            </div>
            <div>
              <MaskedReveal className="font-serif text-[1.75rem] font-medium tracking-tight md:text-[2rem]">
                Military Service
              </MaskedReveal>
              <Reveal className="mt-5">
                <TimelineEntry {...MILITARY} />
              </Reveal>
            </div>
          </div>

          <aside aria-label="Skills and profile" className="min-w-0 md:-mt-[167px]">
            <Stagger className="flex flex-col gap-3">
              {PROFILE.map((group) => (
                <ProfileCard key={group.label} label={group.label} items={group.items} vibe={group.vibe} />
              ))}
            </Stagger>
          </aside>
        </div>
      </section>

      <section className="px-4 pb-16 pt-8 md:pb-20 md:pt-10">
        <Reveal className="mx-auto flex max-w-6xl flex-wrap gap-3">
          <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
            <Link href="/work">View My Work</Link>
          </Button>
          <Button size="lg" variant="accent" className="rounded-full px-8" asChild>
            <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
              Let&apos;s Talk
            </a>
          </Button>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}

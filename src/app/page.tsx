'use client'
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useMemo, useRef, Suspense } from "react";
import PillNav from "@/components/PillNav";
import { useSearchParams } from "next/navigation";
import { projects } from "@/lib/projects";
import ProjectView from "@/components/ProjectView";
import { useHeroPortraitReveal } from "@/hooks/useHeroPortraitReveal";
import RecentWorkShowcase from "@/components/RecentWorkShowcase";
import FaqSection from "@/components/FaqSection";
import FeedbackSpotlight from "@/components/FeedbackSpotlight";
import SiteFooter from "@/components/SiteFooter";
import SiteMark from "@/components/SiteMark";
import SocialIconLinks from "@/components/SocialIconLinks";
import { MaskedReveal, Reveal } from "@/components/motion/Motion";
import { WHATSAPP_HREF } from "@/lib/social";

/* ---------- Overlay driven by ?project=... (wrapped in Suspense) ---------- */
function RecentProjectOverlay() {
  const search = useSearchParams();
  const q = search?.get("project") ?? null;
  const activeProject = projects.find(p => p.slug === q);
  if (!activeProject) return null;

  return (
    <ProjectView
      overlay
      title={activeProject.title}
      year={activeProject.year}
      description={activeProject.shortDescription}
      descriptionRtl={activeProject.shortDescriptionRtl}
      descriptionFooter={activeProject.descriptionFooter}
      longImage={activeProject.longImage}
      closeHref="/#work"
    />
  );
}

/* =========================
   Logo Marquee (your current version)
   ========================= */
function LogoMarquee({
  logos,
  speed = 60,
  gap = 56,
  box = { w: 150, h: 60 },
}: {
  logos: string[];
  speed?: number; // px/s
  gap?: number;   // px
  box?: { w: number; h: number };
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const trackLogos = useMemo(() => {
    const base = logos.length ? logos : ["/logos/figma.svg"];
    const minItems = Math.max(6, 14 / Math.max(1, base.length));
    return Array.from({ length: Math.ceil(minItems) }, () => base).flat();
  }, [logos]);

  useEffect(() => {
    const el = trackRef.current;
    const wrap = wrapperRef.current;
    if (!el || !wrap) return;

    const itemCount = trackLogos.length;
    const trackWidth = itemCount * box.w + (itemCount - 1) * gap;
    const durationSec = Math.max(6, trackWidth / Math.max(20, speed));

    wrap.style.setProperty("--track-w", `${trackWidth}px`);
    wrap.style.setProperty("--duration", `${durationSec}s`);
  }, [trackLogos, speed, gap, box.w]);

  return (
    <div
      ref={wrapperRef}
      className="marquee"
      style={
        {
          "--gap": `${gap}px`,
          "--logo-w": `${box.w}px`,
          "--logo-h": `${box.h}px`,
        } as React.CSSProperties
      }
    >
      <div className="marquee-fade-l" />
      <div className="marquee-fade-r" />

      <div ref={trackRef} className="marquee-track">
        {trackLogos.map((src, i) => (
          <div className="logo-item" key={`t1-${i}-${src}`}>
            <img
              src={src}
              alt={src.split("/").pop() || "Tool logo"}
              className={src.endsWith("openai.png") ? "logo-img logo-dim logo-img-match" : "logo-img logo-dim"}
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
          </div>
        ))}
      </div>

      <div className="marquee-track second" aria-hidden="true">
        {trackLogos.map((src, i) => (
          <div className="logo-item" key={`t2-${i}-${src}`}>
            <img
              src={src}
              alt=""
              className={src.endsWith("openai.png") ? "logo-img logo-dim logo-img-match" : "logo-img logo-dim"}
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("home");
  const heroRef = useHeroPortraitReveal<HTMLElement>();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "work", "testimonials", "faq", "contact"];
      const y = window.scrollY + 120;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.offsetTop, h = el.offsetHeight;
        if (y >= top && y < top + h) { setActiveSection(id); break; }
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Preload Recent work long images after page is idle (doesn't block initial load)
  useEffect(() => {
    const preload = () => {
      ["/single_long.jpg", "/studio_long.jpg", "/zach_long.jpg"].forEach((src) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = src;
        document.head.appendChild(link);
      });
    };
    if (typeof requestIdleCallback !== "undefined") {
      requestIdleCallback(preload, { timeout: 2000 });
    } else {
      setTimeout(preload, 2000);
    }
  }, []);

  const scrollToSection = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="relative min-h-screen bg-background text-foreground" data-hero-entrance="run">

      <SiteMark />

      <SocialIconLinks
        iconSize={20}
        className="absolute top-4 right-10 z-40 hidden h-14 items-center gap-[18px] md:flex md:h-16"
        linkClassName="inline-flex items-center justify-center text-muted-foreground opacity-80 transition-[color,opacity,transform] duration-200 ease-out hover:text-foreground hover:opacity-100 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:stroke-current"
      />

      {/* Frosted pill nav */}
      <PillNav onJump={scrollToSection} activeSection={activeSection} />

      {/* HERO */}
      <section ref={heroRef} id="home" className="min-h-screen flex items-center justify-center px-4 pt-28 sm:pt-32">
        <div className="mx-auto w-full max-w-6xl text-center">
          <div className="mb-10 flex flex-wrap justify-center gap-2 md:gap-3 hero-chips">
            <Badge variant="secondary" className="rounded-full px-3 py-2 text-xs md:text-sm">Branding</Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-2 text-xs md:text-sm">Web graphics</Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-2 text-xs md:text-sm">Print</Badge>
          </div>

          <h1 className="mb-4 font-serif hero-title">
            <span className="hero-line hero-line-name">
              <span className="hero-name">Shon Simhon,</span>
            </span>
            <span className="hero-line hero-line-sub">
              <span className="hero-sub italic">Graphic designer</span>
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-base sm:text-lg text-muted-foreground hero-para">
            <span className="hero-phrase hero-phrase-a">Sharp design.</span>
            {"  "}
            <span className="hero-phrase hero-phrase-b">Creative thinking.</span>
            {"  "}
            <span className="hero-phrase hero-phrase-c">Work that stands out.</span>
          </p>

          <div className="mb-14 flex flex-col sm:flex-row items-center justify-center gap-3 hero-cta">
            <Button size="lg" variant="accent" onClick={() => scrollToSection("work")} className="rounded-full px-6">
              See work
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollToSection("contact")} className="rounded-full px-6">
              Get in touch
            </Button>
          </div>

          <div className="relative mx-auto max-w-lg hero-portrait">
            <div className="hero-portrait-reveal">
              <Image
                src="/edited_Shon.png"
                alt="Shon portrait"
                width={800}
                height={1000}
                quality={100}
                className="h-auto w-full rounded-3xl transition-transform duration-500 hover:scale-[1.02]"
                priority
              />
            </div>
          </div>
        </div>
        <div className="hero-scroll-hint" aria-hidden="true">
          <span>Scroll to reveal</span>
          <span className="hero-scroll-line">
            <span className="hero-scroll-stroke" />
          </span>
        </div>
      </section>

      {/* RECENT WORK */}
      <section id="work">
        <RecentWorkShowcase />
      </section>

      <FeedbackSpotlight />

      <FaqSection />

      {/* LOGO MARQUEE (tools) */}
      <section aria-label="Design tools" className="px-4 py-16">
        <Reveal className="mx-auto max-w-6xl">
          <LogoMarquee
            logos={[
              "/logos/figma.svg",
              "/logos/kling.svg",
              "/logos/mid.svg",
              "/logos/ps.svg",
              "/logos/pp.svg",
              "/logos/ai.svg",
              "/logos/ae.svg",
              "/logos/indesign.svg",
              "/logos/cursor.svg",
              "/logos/openai.png",
            ]}
            speed={60}
            gap={56}
            box={{ w: 150, h: 60 }}
          />
        </Reveal>
      </section>

      {/* CONTACT / FOOTER CTA */}
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
            {/* WhatsApp (no prefilled message) */}
            <Button size="lg" variant="accent" className="rounded-full px-8" asChild>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
              >
                Let’s talk
              </a>
            </Button>

            {/* Email */}
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

      {/* URL-driven overlay must be inside Suspense */}
      <Suspense fallback={null}>
        <RecentProjectOverlay />
      </Suspense>
    </div>
  );
}
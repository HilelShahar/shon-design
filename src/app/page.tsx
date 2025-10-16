'use client'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useMemo, useRef } from "react";
import { Home, LayoutGrid, MessageCircle, Mail } from "lucide-react";


/* =========================
   Frosted Pill Navigation
   ========================= */
function PillNav({
  active,
  onJump,
}: {
  active: string;
  onJump: (id: string) => void;
}) {
  const items = [
    { id: "home", label: "Home", Icon: Home },
    { id: "work", label: "Work", Icon: LayoutGrid },     // portfolio/grid
    { id: "testimonials", label: "Testimonials", Icon: MessageCircle },  // clean chat bubble
    { id: "contact", label: "Contact", Icon: Mail },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className="
          relative flex items-center gap-1 md:gap-2 p-2
          rounded-[80px]
          bg-white/5 backdrop-blur-xl
          border border-white/10
          shadow-[0_-8px_24px_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.5)]
        "
      >
        {items.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onJump(id)}
              aria-label={label}
              className={`relative inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full transition-colors ${isActive ? "bg-white/15" : "hover:bg-white/10"
                }`}
            >
              <Icon
                size={22}
                strokeWidth={1.8}
                className={isActive ? "text-white" : "text-white/70"}
                aria-hidden
              />
              {isActive && (
                <>
                  <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/20" />
                  <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_24px_rgba(255,255,255,0.18)]" />
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
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

  // build one track; if you have 1–2 logos, repeat them so it doesn't look empty
  const trackLogos = useMemo(() => {
    const base = logos.length ? logos : ["/logos/figma.svg"];
    const minItems = Math.max(6, 14 / Math.max(1, base.length)); // heuristic
    return Array.from({ length: Math.ceil(minItems) }, () => base).flat();
  }, [logos]);

  useEffect(() => {
    const el = trackRef.current;
    const wrap = wrapperRef.current;
    if (!el || !wrap) return;

    // compute exact pixel width of one track
    // each item contributes box.w + gap, except last which doesn't add gap
    const itemCount = trackLogos.length;
    const trackWidth = itemCount * box.w + (itemCount - 1) * gap;

    // compute duration from speed (px/s)
    const durationSec = Math.max(6, trackWidth / Math.max(20, speed)); // min duration cap

    // set CSS custom props on wrapper so both tracks use identical values
    wrap.style.setProperty("--track-w", `${trackWidth}px`);
    wrap.style.setProperty("--duration", `${durationSec}s`);
  }, [trackLogos, speed, gap, box.w]);

  return (
    <div
      ref={wrapperRef}
      className="marquee"
      style={
        {
          // keep CSS vars in sync with props; JS will overwrite after measure
          "--gap": `${gap}px`,
          "--logo-w": `${box.w}px`,
          "--logo-h": `${box.h}px`,
        } as React.CSSProperties
      }
    >
      {/* edge fades */}
      <div className="marquee-fade-l" />
      <div className="marquee-fade-r" />

      {/* first track */}
      <div ref={trackRef} className="marquee-track">
        {trackLogos.map((src, i) => (
          <div className="logo-item" key={`t1-${i}-${src}`}>
            <img
              src={src}
              alt={src.split("/").pop() || "Tool logo"}
              className="logo-img logo-dim"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
          </div>
        ))}
      </div>

      {/* second track (identical), positioned exactly after the first */}
      <div className="marquee-track second" aria-hidden="true">
        {trackLogos.map((src, i) => (
          <div className="logo-item" key={`t2-${i}-${src}`}>
            <img
              src={src}
              alt=""
              className="logo-img logo-dim"
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

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "work", "testimonials", "faq", "contact"];
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

  const scrollToSection = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NEW frosted pill nav */}
      <PillNav active={activeSection} onJump={scrollToSection} />

      {/* HERO */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-28 sm:pt-32">
        <div className="mx-auto w-full max-w-6xl text-center">
          {/* tags */}
          <div className="mb-10 flex flex-wrap justify-center gap-2 md:gap-3 reveal-up">
            <Badge variant="secondary" className="rounded-full px-3 py-2 text-xs md:text-sm">Branding</Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-2 text-xs md:text-sm">Web graphics</Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-2 text-xs md:text-sm">Print</Badge>
          </div>

          {/* title */}
          <h1 className="mb-4 text-4xl sm:text-6xl md:text-7xl font-serif leading-tight reveal-up delay-100">
            Shon Simhon,<br /> <span className="italic">Graphic designer</span>
          </h1>

          {/* subtitle placeholder */}
          <p className="mx-auto mb-10 max-w-2xl text-base sm:text-lg text-muted-foreground reveal-up delay-200">
            I am the greatest designer alive, and Shahar is my King
          </p>

          {/* CTAs */}
          <div className="mb-14 flex flex-col sm:flex-row items-center justify-center gap-3 reveal-up delay-300">
            <Button size="lg" onClick={() => scrollToSection("work")} className="rounded-full px-6">
              See recent work
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollToSection("contact")} className="rounded-full px-6">
              Get in touch
            </Button>
          </div>

          {/* hero image */}
          <div className="relative mx-auto max-w-lg reveal-scale delay-400">
            <Image
              src="/p2.png"
              alt="Shon portrait"
              width={800}
              height={1000}
              className="h-auto w-full rounded-3xl transition-transform duration-500 hover:scale-[1.02]"
              priority
            />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-3xl md:text-4xl font-serif">About me</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="p-6 md:p-8">
              <h3 className="mb-3 text-xl font-medium">Approach</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                I design clean, minimal visuals that communicate clearly. Fast iterations, honest feedback,
                and crisp delivery files are my default. From brand identities to web heroes and posters,
                I aim for work that feels refined and practical.
              </p>
            </Card>
            <Card className="p-6 md:p-8">
              <h3 className="mb-3 text-xl font-medium">Capabilities</h3>
              <ul className="list-disc space-y-2 pl-5 text-sm md:text-base text-muted-foreground">
                <li>Brand identity (logos, palettes, type)</li>
                <li>Web graphics & hero visuals</li>
                <li>Marketing assets (posters, social kits, decks)</li>
                <li>Production-ready exports & tidy source files</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* RECENT WORK */}
      <section id="work" className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl md:text-4xl font-serif">Recent work</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { src: "/p2.png", title: "Poster Series", tag: "Print" },
              { src: "/p2.png", title: "Brand System", tag: "Branding" },
              { src: "/p2.png", title: "Web Graphics", tag: "Web" },
              // { src: "/p2.png", title: "Campaign Kit", tag: "Marketing" },
            ].map((item, i) => (
              <Card key={i} className="overflow-hidden group">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{item.title}</p>
                    <span className="text-xs opacity-60">{item.tag}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* LOGO MARQUEE (tools) */}
      <section aria-label="Design tools" className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <LogoMarquee
            logos={[
              "/logos/figma.svg",
              "/logos/ai.svg",
              "/logos/ps.svg",
              "/logos/canva.svg",
              "/logos/lr.svg",
              "/logos/indesign.svg",
              "/logos/blender.svg",
              "/logos/c4d.svg",
            ]}
            speed={60}
            gap={56}
            box={{ w: 150, h: 60 }}
          />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-3xl md:text-4xl font-serif">What others say</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                text: "Shon’s work exceeded all expectations. Fresh ideas and an exceptional finish.",
                name: "Jordan P.", title: "Startup Founder",
                avatar: "https://ext.same-assets.com/4129804017/849432527.jpeg",
              },
              {
                text: "From concept to completion, the portfolio reflects our brand perfectly.",
                name: "Samantha R.", title: "Creative Director",
                avatar: "https://ext.same-assets.com/4129804017/3647061311.png",
              },
              {
                text: "Unique approach, smooth process, polished and cohesive results.",
                name: "Nina S.", title: "Marketing Manager",
                avatar: "https://ext.same-assets.com/4129804017/3065586418.jpeg",
              },
              {
                text: "Innovative designs that align with our identity and perform.",
                name: "Lucas M.", title: "Photographer",
                avatar: "https://ext.same-assets.com/4129804017/3647061311.png",
              },
              {
                text: "Transformed our vision into reality with creativity and care.",
                name: "Juno C.", title: "Small Business Owner",
                avatar: "https://ext.same-assets.com/4129804017/3065586418.jpeg",
              },
            ].map((t, i) => (
              <Card key={i} className="p-6">
                <div className="mb-3 flex">
                  {[...Array(5)].map((_, idx) => (
                    <svg key={idx} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mb-6 text-sm">“{t.text}”</blockquote>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full" />
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.title}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                q: "What’s your typical timeline for projects?",
                a: "Most branding or small site graphics wrap in 1–3 weeks. Larger systems or multi-asset campaigns can run 4–6 weeks. I’ll give you a clear schedule before we start."
              },
              {
                q: "How do we collaborate and share feedback?",
                a: "I work in short, focused rounds with async check-ins. We use comments (Figma/PDF) and a shared doc for decisions. You’ll always know what’s next."
              },
              {
                q: "What files do I receive on delivery?",
                a: "You get tidy, organized sources (AI/PSD/FIG as relevant), web exports (SVG/PNG/JPG), and a short handoff note with colors, type, and usage."
              },
              {
                q: "Do you offer ongoing support?",
                a: "Yes. I can stay on for monthly design support or ad-hoc updates. We’ll tailor the cadence to your pace."
              },
              {
                q: "How many revisions are included?",
                a: "Each round includes feedback and refinements. Most projects land within 2–3 rounds because we align early with references and goals."
              },
              {
                q: "Can you help with print or web production?",
                a: "Yep—prepress for print, and optimized assets for web/social. If a developer or printer needs anything special, I coordinate directly."
              },
            ].map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-card border border-border rounded-2xl px-6"
              >
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CONTACT / FOOTER CTA */}
      <section id="contact" className="px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-4xl md:text-5xl font-serif">Ready to start?</h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
            Tell me about your project and timelines — I’ll reply quickly with next steps.
          </p>
          <div className="flex justify-center gap-3">
            <Button size="lg" className="rounded-full px-8">Let’s talk</Button>
            <Button size="lg" variant="outline" className="rounded-full px-8">Book a call</Button>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-border px-4 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} Shon Simhon</div>
          <div className="flex items-center gap-4">
            <button onClick={() => scrollToSection("work")} className="hover:text-foreground">Work</button>
            <button onClick={() => scrollToSection("about")} className="hover:text-foreground">About</button>
            <button onClick={() => scrollToSection("contact")} className="hover:text-foreground">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

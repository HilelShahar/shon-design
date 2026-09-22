'use client'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useMemo, useRef, Suspense } from "react";
import PillNav from "@/components/PillNav";
import IntroOverlay from "@/components/IntroOverlay";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { projects } from "@/lib/projects";
import {
  HERO_REVEAL_AT_MS,
  HERO_REVEAL_EVENT,
  INTRO_SEEN_KEY,
} from "@/lib/introSequence";
import ProjectView from "@/components/ProjectView";
import { useHeroPortraitReveal } from "@/hooks/useHeroPortraitReveal";
import RecentWorkShowcase from "@/components/RecentWorkShowcase";
import { MaskedReveal, Reveal, Stagger } from "@/components/motion/Motion";

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
      description={activeProject.description}
      descriptionRtl={activeProject.descriptionRtl}
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
              className="logo-img logo-dim"
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
  const [heroEntrance, setHeroEntrance] = useState<"armed" | "run">("armed");
  const heroRef = useHeroPortraitReveal<HTMLElement>();

  // Hero entrance waits for the intro curtain to clear the hero. Without the
  // intro (already seen this session, or reduced motion) it runs on mount.
  useEffect(() => {
    const start = () => setHeroEntrance("run");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || sessionStorage.getItem(INTRO_SEEN_KEY) === "1") {
      start();
      return;
    }

    window.addEventListener(HERO_REVEAL_EVENT, start, { once: true });
    const failsafe = window.setTimeout(start, HERO_REVEAL_AT_MS + 1200);

    return () => {
      window.removeEventListener(HERO_REVEAL_EVENT, start);
      window.clearTimeout(failsafe);
    };
  }, []);

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
    <div className="relative min-h-screen bg-background text-foreground" data-hero-entrance={heroEntrance}>

      {/* Opening mark. It lives at the top of the page and scrolls away. */}
      <Link
        href="/"
        aria-label="Home"
        className="absolute top-4 left-6 z-40 hidden items-center md:flex"
      >
        <img
          src="/icon.png"
          alt="Shon Simhon"
          className="h-14 w-auto md:h-16"
        />
      </Link>

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

      {/* TESTIMONIALS */}
      <section id="testimonials" className="px-4 py-20" dir="rtl">
        <div className="mx-auto max-w-6xl">
          <MaskedReveal className="mb-12 text-3xl md:text-4xl font-serif">מה אומרים עליי</MaskedReveal>
          <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                text: "פניתי לשון לעיצוב עטיפה למוזיקה והוא הצליח לתרגם את האווירה של השיר בצורה ויזואלית ממש יפה. העיצוב עם השקיעות והאווירה האפריקאית יצא מאוד מיוחד",
                name: "מיסטיקן.", title: "יוצר מוזיקה",
                stars: 5,
              },
              {
                text: "שון עובד איתי על עיצוב קטלוג והוא מאוד מסודר ומקצועי בתהליך. הוא שולח סקיצות, מקשיב לפידבק ותמיד זמין לשינויים. העבודה איתו נעימה והתוצאה נראית מצוין",
                name: "מיה ר.", title: "בעלת עסק",
                stars: 4,
              },
              {
                text: "שון הגיע לסטודיו כדי להבין את האווירה והסגנון שלי, וזה ממש הורגש בתוצאה. דרך התמונות והשיחה בינינו הוא הצליח למצוא כיוון ללוגו שמרגיש מאוד מדויק לעסק",
                name: "יעל ק.", title: "בעלת סטודיו",
                stars: 5,
              },
              {
                text: "מה שאהבתי אצל שון זה הגישה הנעימה והמקצועית. הוא מקשיב, מציע רעיונות משלו ומצליח להביא משהו קצת אחר מהרגיל",
                name: "נועם ש.", title: "יזם",
                stars: 4,
              },
              {
                text: "שון הגיע לפגישה איתי כדי להבין את העסק והכיוון למיתוג, וזה ממש עזר לתהליך. הוא הביא כמה רעיונות מעניינים ללוגו ובסוף הצלחנו להגיע לפתרון שמרגיש נכון למותג",
                name: "עומר ל.", title: "בעל מותג",
                stars: 5,
              },
              {
                text: "עבדתי עם שון על תהליך מיתוג והוא ליווה אותי גם בבחירות לקראת ההדפסה הוא הסביר על החומרים, הצבעים ומה יעבוד הכי טוב בפועל הרגשתי שיש מישהו שממש חושב עד הפרטים הקטנים ולא רק על העיצוב עצמו.",
                name: "יוסי זוהר",
                title: "בעל עסק",
                stars: 5,
              },
            ].map((t, i) => (
              <Card key={i} className="p-6">
                <div className="mb-3 flex">
                  {[...Array(t.stars)].map((_, idx) => (
                    <svg key={idx} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mb-6 text-sm">“{t.text}”</blockquote>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.title}</div>
                </div>
              </Card>
            ))}
          </Stagger>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 py-20" dir="rtl">
        <div className="mx-auto max-w-4xl">
          <Stagger nested className="mx-auto max-w-4xl">
          <Accordion type="multiple" className="space-y-4">
            {[
              {
                q: "מה זמן העבודה הממוצע על פרויקט?",
                a: "זה משתנה מפרויקט לפרויקט, אבל בדרך כלל אני עובד בטווח של שבוע עד שלושה.\nאני שואף לעבוד בצורה יעילה, בלי לוותר על איכות.\n\nבמקרים של פרויקטים מורכבים או מיתוגים רחבים, לוח הזמנים יכול להתארך – בהתאם לצורך ולתיאום מראש."
              },
              {
                q: "איך מתבצע התהליך מולך? איך מעבירים הערות?",
                a: "במה שנוח לך – וואטסאפ, מייל, שיחת טלפון.\nאני זמין, מקשיב, משתף אותך בשלבים, והכי חשוב – גורם לך להרגיש חלק מהתהליך."
              },
              {
                q: "אילו קבצים אני מקבל בסיום העבודה?",
                a: "כל מה שצריך: לוגואים בפורמטים שונים (SVG, PNG, PDF), קבצים לרשתות חברתיות, חומרים להדפסה וכל מה שסוכם מראש.\nמסודר, מוכן, ונוח לשימוש."
              },
              {
                q: "אתה נותן גם ליווי אחרי שהפרויקט נגמר?",
                a: "כן, לגמרי.\nגם אחרי שהפרויקט מסתיים אני כאן אם צריך התאמה, שינוי קטן, או סתם עוד עין מקצועית."
              },
              {
                q: "כמה סבבי תיקונים כלולים?",
                a: "בדרך כלל 2–3 סבבים, אבל אני פחות סופר ויותר דואג שיצא מדויק.\nהמטרה היא שזה ירגיש טוב ונכון לשני הצדדים."
              },
              {
                q: "אתה גם עוזר בהכנה להדפסה או לאתר?",
                a: "כן.\nאם צריך – אני עובד מול בתי דפוס או מתכנתים כדי לוודא שהתוצאה יוצאת כמו שצריך – גם בדיגיטל וגם בדפוס."
              },
            ].map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                data-motion-item=""
                style={{ animationDelay: `${Math.min(i, 5) * 85}ms` }}
                className="bg-card border border-border rounded-2xl px-6"
              >
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent className="whitespace-pre-line">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          </Stagger>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <MaskedReveal className="mb-10 text-3xl md:text-4xl font-serif">About me</MaskedReveal>
          <Stagger className="grid gap-8 md:grid-cols-2">
            <Card className="p-6 md:p-8">
              <h3 className="mb-3 text-xl font-medium">Approach</h3>
              <div className="space-y-3 text-sm md:text-base text-muted-foreground">
                <p>
                  I focus on creating visual identities and designs that feel clear, memorable, and refined.
                </p>
                <p>
                  My work combines clean aesthetics with strong visual thinking, turning ideas into bold and distinctive visual solutions.
                </p>
                <p>
                  From brand identities and logos to posters and creative visuals, I aim to design work that communicates clearly, stands out, and leaves a lasting impression.
                </p>
              </div>
            </Card>
            <Card className="p-6 md:p-8">
              <h3 className="mb-3 text-xl font-medium">Capabilities</h3>
              <ul className="list-disc space-y-2 pl-5 text-sm md:text-base text-muted-foreground">
                <li>Brand identity design (logos, color palettes, typography)</li>
                <li>Visual branding systems</li>
                <li>Poster design & creative campaigns</li>
                <li>Cover art & promotional visuals</li>
                <li>Organized, production-ready design files</li>
              </ul>
            </Card>
          </Stagger>
        </div>
      </section>

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
                href="https://wa.me/972502739221"
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

      {/* Minimal Footer */}
      <footer className="border-t border-border px-4 py-10">
        <Reveal className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} Shon Simhon</div>
          <div className="flex items-center gap-4">
            <button onClick={() => scrollToSection("work")} className="hover:text-foreground">Work</button>
            <button onClick={() => scrollToSection("about")} className="hover:text-foreground">About</button>
            <button onClick={() => scrollToSection("contact")} className="hover:text-foreground">Contact</button>
          </div>
        </Reveal>
      </footer>

      {/* URL-driven overlay must be inside Suspense */}
      <Suspense fallback={null}>
        <RecentProjectOverlay />
      </Suspense>

      <IntroOverlay />
    </div>
  );
}
import PillNav from "@/components/PillNav";
import SiteFooter from "@/components/SiteFooter";
import { MaskedReveal, Reveal } from "@/components/motion/Motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PillNav />

      <section className="px-4 pb-20 pt-28 sm:pt-32">
        <div className="mx-auto w-full max-w-6xl">
          <MaskedReveal as="h1" className="font-serif text-4xl leading-tight tracking-tight sm:text-6xl">
            About
          </MaskedReveal>
          <Reveal delay={90}>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
              A place for the story behind the work. The page is ready for that to be written.
            </p>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

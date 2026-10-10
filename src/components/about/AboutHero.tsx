import Image from "next/image";
import { MaskedReveal, Reveal } from "@/components/motion/Motion";

const ROLE = "Graphic Designer | Junior UX/UI Designer";

/**
 * About hero. DOM order is the mobile reading order (name, role, portrait);
 * on larger screens each piece is placed on one shared stage so the name runs
 * in front of the portrait.
 */
export default function AboutHero() {
  return (
    <section className="about-hero" aria-labelledby="about-hero-name">
      <div className="about-hero-inner">
        <div className="about-name">
          <h1 id="about-hero-name" className="sr-only">
            Shon Simhon
          </h1>
          <div className="about-name-text font-serif" aria-hidden="true">
            <MaskedReveal as="span" className="about-name-line">
              Shon
            </MaskedReveal>
            <MaskedReveal as="span" className="about-name-line about-name-line-2">
              Simhon
            </MaskedReveal>
          </div>
        </div>

        <Reveal as="p" className="about-role" delay={420}>
          {ROLE}
        </Reveal>

        <div className="about-portrait">
          <div className="about-portrait-drift">
            <div className="about-portrait-media">
              <Image
                src="/about/shon-about-hero.png"
                alt="Portrait of Shon Simhon, a graphic and UX/UI designer, in a black t-shirt"
                width={682}
                height={1024}
                priority
                quality={90}
                sizes="(min-width: 1024px) 38vw, (min-width: 768px) 46vw, 100vw"
                className="about-portrait-img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

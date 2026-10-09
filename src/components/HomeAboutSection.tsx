import { Card } from "@/components/ui/card";
import { MaskedReveal, Stagger } from "@/components/motion/Motion";

/**
 * Former homepage About block (Approach + Capabilities).
 * Kept unused after the section moved off the homepage, so the copy
 * is still here when the dedicated About page is written.
 */
export default function HomeAboutSection() {
  return (
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
  );
}

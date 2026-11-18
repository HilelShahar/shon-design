import {
  CaseStudyClientFeedback,
  CaseStudyClose,
  CaseStudyCreativeDirection,
  CaseStudyFinalWork,
  CaseStudyFrame,
  CaseStudyOverview,
  CaseStudyProcess,
  CaseStudyText,
  CaseStudyTitleHero,
  type CaseStudyProcessStep,
} from "@/components/case-studies/CaseStudySections";
import CaseStudyHeroMedia from "@/components/case-studies/CaseStudyHeroMedia";
import type { Project } from "@/lib/projects";
import { TESTIMONIALS } from "@/lib/testimonials";

const PLACEHOLDER = {
  overview:
    "Placeholder - A short introduction to the project, the context behind it, and the main idea that shaped the final direction.",
  role: "Placeholder - Your role on the project.",
  category: "Placeholder - Project category.",
  deliverables: "Placeholder - Final assets.",
  goal: "Placeholder - Describe what the project needed to achieve and the main objective behind the work.",
  constraints:
    "Placeholder - Highlight the key limitations or requirements that influenced the project.",
  direction:
    "Placeholder - Explain the visual idea behind the project and how it connects back to the goal.",
  process:
    "Placeholder - Show the key stages that shaped the final result, from early exploration through refinement.",
  finalWork:
    "Placeholder - The final design presented across its key applications and deliverables.",
  outcome:
    "Placeholder - Summarize what the project achieved and how the final work was used.",
  feedback:
    "Placeholder - Add an authentic client or collaborator quote for this project.",
  reflection:
    "Placeholder - Share what you learned from the project, what worked well, and what you would refine.",
};

/** Existing carousel entries that belong to a project. Same objects, not copied quotes. */
const CLIENT_FEEDBACK_BY_SLUG: Record<string, string> = {
  "dolev-dadon-single-cover": "דולב דדון",
  "studio-movimiento-branding": "יעל ק.",
};

const PROCESS_PLACEHOLDERS: CaseStudyProcessStep[] = [
  { label: "Exploration", note: "Placeholder - Early ideas, references, and visual experiments." },
  { label: "Composition", note: "Placeholder - Layout studies around hierarchy, balance, and focus." },
  { label: "Color & Typography", note: "Placeholder - Color and type choices for the visual language." },
  { label: "Refinement", note: "Placeholder - Final adjustments that brought the direction together." },
];

/** Hero media per project: a still that paints first, and a video that plays over it. */
const HERO_MEDIA_BY_SLUG: Record<
  string,
  {
    still: string;
    video: string;
    lockup?: { at: number; headline: string; rest: string };
    grain?: boolean;
    /** Soft crossfade between two copies. Movimiento only. */
    crossfade?: boolean;
  }
> = {
  "dolev-dadon-single-cover": {
    still: "/media/dolev/hero-clean-frame.jpg",
    video: "/media/dolev/wedding-hero-camera.mp4",
  },
  "ice-cream-branding-selek": {
    still: "/media/selek/selek-hero-start.jpg",
    video: "/media/selek/selek-hero.mp4",
  },
  "studio-movimiento-branding": {
    still: "/media/movimiento/movimiento-hero-start.jpg",
    video: "/media/movimiento/movimiento-hero.mp4",
    lockup: {
      at: 8.15,
      headline: "Find your flow.",
      rest: "/media/movimiento/movimiento-hero-end.jpg",
    },
    grain: true,
    crossfade: true,
  },
};

type CaseStudyCopy = Partial<
  Pick<
    typeof PLACEHOLDER,
    "goal" | "direction" | "outcome" | "reflection" | "constraints" | "process" | "finalWork"
  >
> & {
  processSteps?: CaseStudyProcessStep[];
};

const COPY_BY_SLUG: Record<string, CaseStudyCopy> = {
  "dolev-dadon-single-cover": {
    goal:
      "The goal was to translate the song’s romantic and powerful emotion into a warm, intimate visual that connects love with a sense of eternity.",
    constraints:
      "Dolev came to me with an existing cover that felt dated and didn’t express what he wanted. The new artwork needed to work in a square format for YouTube and Instagram while communicating romance, warmth, and a wedding atmosphere.",
    direction:
      "The direction grew from my conversation with Dolev and the feeling he wanted the song to communicate. A silhouetted couple, floral framing, and warm sunset tones shaped the romantic atmosphere.",
    process:
      "After speaking with Dolev and reviewing the previous cover, I had a clear sense of what needed to change. I used that as the starting point for a warmer, more emotional direction.",
    processSteps: [
      {
        label: "Exploration",
        note: "I looked at a focused set of wedding, sunset, and floral references. Since the direction was already clear, the exploration was mainly about refining the right mood.",
        image: "/media/dolev/exploration.png",
        alt: "Wedding at sunset inspiration collage for Dolev Dadon single cover",
      },
      {
        label: "Composition",
        note: "Because the song is about a couple, I made them the clear focal point. The flowers, canopy, and sunset support the story and emotion around them.",
        image: "/media/dolev/composition.png",
        alt: "Composition formula combining couple, chuppah, and location for the cover",
      },
      {
        label: "Color & Typography",
        note: "Warm sunset tones helped communicate romance and the feeling of a special moment. I paired them with delicate typography and refined its placement together with Dolev.",
        image: "/media/dolev/color-typography.png",
        alt: "Minimalist branding mood board with palette, typography, and texture",
      },
    ],
    finalWork:
      "The cover was presented across mobile streaming, vinyl, CD, and poster mockups while keeping a consistent visual identity.",
    outcome:
      "The final artwork became the official visual for the single and was used across YouTube, Instagram, and Facebook.",
    reflection:
      "This project reinforced how much stronger a visual can feel when it starts from emotion and message, not just style.",
  },
  "studio-movimiento-branding": {
    goal:
      "Create an identity that feels light, fresh, and welcoming while maintaining the confidence and professionalism expected from a Pilates studio.",
    constraints:
      "The brand needed to feel soft and approachable without becoming too delicate, while connecting naturally with the studio’s primarily female audience.",
    direction:
      "The concept began by studying different Pilates positions. One specific pose became the foundation for the logo, translating body movement into a flowing and recognizable symbol.",
    process:
      "The identity was developed from the relationship between physical movement and the atmosphere the studio wanted to create.",
    processSteps: [
      {
        label: "Exploration",
        note: "I explored different Pilates poses and body movements, looking for a form that could represent the studio in a simple and distinctive way.",
        image: "/media/movimiento/movimiento-exploration.png",
        alt: "A Pilates pose simplified step by step into the Movimiento symbol",
      },
      {
        label: "Composition",
        note: "The selected pose was simplified step by step into a fluid symbol, preserving the feeling of movement while creating a clean and memorable mark.",
        image: "/media/movimiento/movimiento-composition.png",
        alt: "Primary, secondary, and logomark variations of the Movimiento logo",
      },
      {
        label: "Color & Typography",
        note: "Deep brown and burgundy bring warmth and stability, while soft pink adds freshness and softness. Clean typography keeps the identity modern and approachable.",
        image: "/media/movimiento/movimiento-color-typography.png",
        alt: "Movimiento palette and Heebo type samples",
      },
      {
        label: "Graphic Language",
        note: "The flowing forms of the identity were extended into a repeating pattern, creating a recognizable graphic element that could carry across different brand touchpoints.",
        image: "/media/movimiento/movimiento-graphic-language.png",
        alt: "Repeating wave pattern built from the Movimiento mark",
      },
    ],
    finalWork: "",
    outcome:
      "The result is a cohesive visual identity that combines movement, warmth, and professionalism across the studio’s brand touchpoints.",
    reflection:
      "This project showed me how a strong visual idea can come directly from the service itself. Turning a real Pilates movement into the logo gave the identity a clear connection to the studio experience.",
  },
  "ice-cream-branding-selek": {
    goal:
      "Create a memorable boutique ice cream brand with a distinctive identity and a campaign strong enough to stand out in the street.",
    constraints:
      "Balance a delicate French-inspired boutique feel with a playful advertising language while keeping the brand consistent.",
    direction:
      "French boutique elegance meets bold, color-driven advertising. The campaign exaggerates the flavor experience by letting the beet color take over the people enjoying it.",
    process:
      "The identity grew from a boutique visual world into a system that works across packaging, retail and advertising.",
    processSteps: [
      {
        label: "Exploration",
        note: "I explored French boutiques, food branding and color-driven campaigns to balance elegance with personality.",
        image: "/media/selek/selek-exploration-1448x1086.png",
        alt: "Selek Cream mood board of a French boutique, beet ice cream, and packaging",
      },
      {
        label: "Color & Typography",
        note: "Beet-inspired pinks create strong recognition, while green connects to the leaves and natural character of the product. Refined typography keeps the identity feeling boutique.",
        image: "/media/selek/selek-color-typography-1448x1086.png",
        alt: "Selek Cream wordmarks and beet, pink, and green color swatches",
      },
    ],
    finalWork:
      "The identity was applied across packaging, store signage and outdoor advertising, creating a cohesive and distinctive brand experience.",
    outcome: "",
    reflection: "",
  },
};

export default function PortfolioCaseStudy({ project }: { project: Project }) {
  const heroMedia = HERO_MEDIA_BY_SLUG[project.slug];
  const copy = COPY_BY_SLUG[project.slug];
  const hasDescription = Boolean(project.shortDescription?.trim());
  const feedbackName = CLIENT_FEEDBACK_BY_SLUG[project.slug];
  const feedback = feedbackName
    ? TESTIMONIALS.find((item) => item.name === feedbackName)
    : undefined;
  return (
    <CaseStudyFrame>
      <CaseStudyTitleHero
        title={project.title}
        tags={project.tags}
        media={
          heroMedia ? (
            <CaseStudyHeroMedia
              still={heroMedia.still}
              video={heroMedia.video}
              lockup={heroMedia.lockup}
              grain={heroMedia.grain}
              crossfade={heroMedia.crossfade}
            />
          ) : undefined
        }
      />
      <CaseStudyOverview
        intro={hasDescription ? project.shortDescription : PLACEHOLDER.overview}
        introRtl={hasDescription ? project.shortDescriptionRtl : false}
        preserveBreaks={hasDescription}
        note={project.descriptionFooter}
        meta={[
          { label: "Role", value: project.role ?? PLACEHOLDER.role },
          { label: "Year", value: project.year },
          { label: "Category", value: project.category ?? PLACEHOLDER.category },
          { label: "Deliverables", value: project.deliverables ?? PLACEHOLDER.deliverables },
        ]}
      />
      <CaseStudyText title="Goal">{copy?.goal ?? PLACEHOLDER.goal}</CaseStudyText>
      <CaseStudyText title="Constraints">{copy?.constraints ?? PLACEHOLDER.constraints}</CaseStudyText>
      <CaseStudyCreativeDirection>{copy?.direction ?? PLACEHOLDER.direction}</CaseStudyCreativeDirection>
      <CaseStudyProcess
        intro={copy?.process ?? PLACEHOLDER.process}
        steps={copy?.processSteps ?? PROCESS_PLACEHOLDERS}
        mediaFrameClass={project.slug === "dolev-dadon-single-cover" ? "dolev-process-media" : undefined}
        processClassName={project.slug === "dolev-dadon-single-cover" ? "dolev-process-three" : undefined}
      />
      <CaseStudyFinalWork
        intro={copy?.finalWork ?? PLACEHOLDER.finalWork}
        image={
          project.slug === "studio-movimiento-branding"
            ? "/media/movimiento/movimiento-final-work.jpg"
            : project.longImage
        }
        alt={project.title}
      />
      <CaseStudyText title="Outcome">{copy?.outcome ?? PLACEHOLDER.outcome}</CaseStudyText>
      <CaseStudyClientFeedback
        testimonial={feedback}
        note={
          feedback || project.slug === "ice-cream-branding-selek"
            ? undefined
            : PLACEHOLDER.feedback
        }
      />
      <CaseStudyClose reflection={copy?.reflection ?? PLACEHOLDER.reflection} />
    </CaseStudyFrame>
  );
}


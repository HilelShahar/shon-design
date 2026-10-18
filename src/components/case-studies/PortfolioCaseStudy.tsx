"use client";

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
};

const PROCESS_PLACEHOLDERS = [
  { label: "Exploration", note: "Placeholder - Early ideas, references, and visual experiments." },
  { label: "Composition", note: "Placeholder - Layout studies around hierarchy, balance, and focus." },
  { label: "Color & Typography", note: "Placeholder - Color and type choices for the visual language." },
  { label: "Refinement", note: "Placeholder - Final adjustments that brought the direction together." },
];

/** Hero media per project: a still that paints first, and a video that plays over it. */
const HERO_MEDIA_BY_SLUG: Record<string, { still: string; video: string }> = {
  "dolev-dadon-single-cover": {
    still: "/media/dolev/hero-clean-frame.jpg",
    video: "/media/dolev/wedding-hero-camera.mp4",
  },
};

type CaseStudyCopy = Partial<
  Pick<
    typeof PLACEHOLDER,
    "goal" | "direction" | "outcome" | "reflection" | "constraints" | "process" | "finalWork"
  >
> & {
  processSteps?: { label: string; note: string }[];
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
      {
        label: "Refinement",
        note: "The first version evolved through changes to the colors, characters, typography, and placement until the composition felt more cohesive.",
      },
    ],
    finalWork:
      "The cover was presented across mobile streaming, vinyl, CD, and poster mockups while keeping a consistent visual identity.",
    outcome:
      "The final artwork became the official visual for the single and was used across YouTube, Instagram, and Facebook.",
    reflection:
      "This project reinforced how much stronger a visual can feel when it starts from emotion and message, not just style.",
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
            <CaseStudyHeroMedia still={heroMedia.still} video={heroMedia.video} />
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
      />
      <CaseStudyFinalWork
        intro={copy?.finalWork ?? PLACEHOLDER.finalWork}
        image={project.longImage}
        alt={project.title}
      />
      <CaseStudyText title="Outcome">{copy?.outcome ?? PLACEHOLDER.outcome}</CaseStudyText>
      <CaseStudyClientFeedback
        testimonial={feedback}
        note={feedback ? undefined : PLACEHOLDER.feedback}
      />
      <CaseStudyClose reflection={copy?.reflection ?? PLACEHOLDER.reflection} />
    </CaseStudyFrame>
  );
}

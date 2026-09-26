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

export default function PortfolioCaseStudy({ project }: { project: Project }) {
  const hasDescription = Boolean(project.description?.trim());
  const feedbackName = CLIENT_FEEDBACK_BY_SLUG[project.slug];
  const feedback = feedbackName
    ? TESTIMONIALS.find((item) => item.name === feedbackName)
    : undefined;
  return (
    <CaseStudyFrame>
      <CaseStudyTitleHero title={project.title} tags={project.tags} />
      <CaseStudyOverview
        intro={hasDescription ? project.description : PLACEHOLDER.overview}
        introRtl={hasDescription ? project.descriptionRtl : false}
        preserveBreaks={hasDescription}
        note={project.descriptionFooter}
        meta={[
          { label: "Role", value: PLACEHOLDER.role },
          { label: "Year", value: project.year },
          { label: "Category", value: PLACEHOLDER.category },
          { label: "Deliverables", value: PLACEHOLDER.deliverables },
        ]}
      />
      <CaseStudyText title="Goal">{PLACEHOLDER.goal}</CaseStudyText>
      <CaseStudyText title="Constraints">{PLACEHOLDER.constraints}</CaseStudyText>
      <CaseStudyCreativeDirection>{PLACEHOLDER.direction}</CaseStudyCreativeDirection>
      <CaseStudyProcess intro={PLACEHOLDER.process} steps={PROCESS_PLACEHOLDERS} />
      <CaseStudyFinalWork
        intro={PLACEHOLDER.finalWork}
        image={project.longImage}
        alt={project.title}
      />
      <CaseStudyText title="Outcome">{PLACEHOLDER.outcome}</CaseStudyText>
      <CaseStudyClientFeedback
        testimonial={feedback}
        note={feedback ? undefined : PLACEHOLDER.feedback}
      />
      <CaseStudyClose reflection={PLACEHOLDER.reflection} />
    </CaseStudyFrame>
  );
}

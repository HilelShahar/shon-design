// Server Component (no "use client")
import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import ProjectView from "@/components/ProjectView";

type Params = { slug: string };
type Props = { params?: Promise<Params> }; // matches Vercel’s PageProps

export default async function ProjectPage({ params }: Props) {
  const resolved = params ? await params : undefined;
  const slug = resolved?.slug;
  if (!slug) notFound();

  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  // Same look as before; just adds the X and outside-click to close.
  return (
    <ProjectView
      title={project.title}
      year={project.year}
      description={project.description}
      longImage={project.longImage}
      closeHref="/work"
    />
  );
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

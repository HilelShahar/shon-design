// Server Component (no "use client")
import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import PortfolioCaseStudy from "@/components/case-studies/PortfolioCaseStudy";
import ZachCaseStudy from "@/components/case-studies/ZachCaseStudy";

type Params = { slug: string };
type Props = { params?: Promise<Params> }; // matches Vercel’s PageProps

export default async function ProjectPage({ params }: Props) {
  const resolved = params ? await params : undefined;
  const slug = resolved?.slug;
  if (!slug) notFound();

  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  if (slug === "zach-track-design") {
    return <ZachCaseStudy project={project} />;
  }

  return <PortfolioCaseStudy project={project} />;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

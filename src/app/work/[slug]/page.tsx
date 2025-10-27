// keep this as a Server Component (no "use client")
import Image from "next/image";
import { notFound } from "next/navigation";
import { projects } from "@/lib/projects"; // adjust path if needed

type Params = { slug: string };
type Props = { params?: Promise<Params> }; // ← matches Vercel’s generated PageProps

export default async function ProjectPage({ params }: Props) {
  // unwrap both "promise" and "possibly undefined"
  const resolved = params ? await params : undefined;
  const slug = resolved?.slug;
  if (!slug) notFound();

  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="px-4 pt-28 sm:pt-32 pb-16">
        <div className="mx-auto w-full max-w-4xl">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-serif">{project.title}</h1>
            <span className="text-sm text-muted-foreground">{project.year}</span>
          </header>

          {project.description && (
            <p className="mb-8 text-muted-foreground">{project.description}</p>
          )}

          <div className="overflow-hidden rounded-2xl border border-border">
            <Image
              src={project.longImage}   // e.g. "/work/zach/long.jpg"
              alt={project.title}
              width={2000}
              height={6000}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

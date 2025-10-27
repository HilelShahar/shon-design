"use client";

import Image from "next/image";
import Link from "next/link";
import PillNav from "@/components/PillNav";
import { projects } from "@/lib/projects";
import { Card, CardContent } from "@/components/ui/card";

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PillNav />

      <section className="px-4 pt-28 sm:pt-32 pb-16">
        <div className="mx-auto w-full max-w-6xl">
          <header className="mb-10 text-center">
            <h1 className="text-4xl sm:text-6xl font-serif leading-tight">Work</h1>
            <p className="mt-3 text-muted-foreground">
              Selected projects & explorations.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Link key={p.slug} href={`/work/${p.slug}`} className="group">
                <Card className="overflow-hidden">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={p.cover}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{p.title}</p>
                      <span className="text-xs opacity-60">{p.year}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

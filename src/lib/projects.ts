// src/lib/projects.ts
export type Project = {
  slug: string;
  title: string;
  year: string | number;
  cover: string;     // small/regular card image
  longImage: string; // long scrollable image
  description: string;
};

export const projects: Project[] = [
  // === Matches Home → Recent work ===
  {
    slug: "dolev-dadon-single-cover",
    title: "Single Cover — Dolev Dadon",
    year: 2025,
    cover: "/single.jpg",
    longImage: "/projects/dolev-dadon-long.jpg",
    description:
      "Cover art exploration and final exports for streaming platforms and socials.",
  },
  {
    slug: "studio-movimiento-branding",
    title: "Branding — Studio Movimiento",
    year: 2025,
    cover: "/studio.jpg",
    longImage: "/studio_long.jpg",
    description:
      "Core identity, color, type, and reusable social templates.",
  },
  {
    slug: "zach-track-design",
    title: "ZACH — Track Design",
    year: 2025,
    cover: "/zach.jpg",
    longImage: "/projects/zach-long.jpg",
    description:
      "Visual direction and key art for the ZACH release; bold type and high-contrast assets for web and print.",
  },

  // === Extra placeholders — swap titles/years/images when ready ===
  {
    slug: "poster-series-a",
    title: "Poster Series A",
    year: 2024,
    cover: "/work/poster-a/cover.jpg",
    longImage: "/projects/poster-a-long.jpg",
    description:
      "Type-led poster study exploring rhythm, spacing, and negative space.",
  },
  {
    slug: "brand-system-b",
    title: "Brand System B",
    year: 2024,
    cover: "/work/brand-b/cover.jpg",
    longImage: "/projects/brand-b-long.jpg",
    description:
      "Compact identity system: logo suite, color tokens, typography, and usage rules.",
  },
  {
    slug: "web-graphics-c",
    title: "Web Graphics C",
    year: 2023,
    cover: "/work/web-c/cover.jpg",
    longImage: "/projects/web-c-long.jpg",
    description:
      "Hero visuals and responsive social cut-downs optimized for load and clarity.",
  },
  {
    slug: "campaign-kit-d",
    title: "Campaign Kit D",
    year: 2023,
    cover: "/work/campaign-d/cover.jpg",
    longImage: "/projects/campaign-d-long.jpg",
    description:
      "OOH, stories, and paid placements with a consistent visual thread.",
  },
  {
    slug: "editorial-e",
    title: "Editorial E",
    year: 2022,
    cover: "/work/editorial-e/cover.jpg",
    longImage: "/projects/editorial-e-long.jpg",
    description:
      "Grid-first editorial exploration balancing dense copy with strong typography.",
  },
  {
    slug: "logo-lab-f",
    title: "Logo Lab F",
    year: 2022,
    cover: "/work/logo-f/cover.jpg",
    longImage: "/projects/logo-f-long.jpg",
    description:
      "Series of marks/monograms with alternates and black/white lockups.",
  },
  {
    slug: "packaging-g",
    title: "Packaging G",
    year: 2021,
    cover: "/work/packaging-g/cover.jpg",
    longImage: "/projects/packaging-g-long.jpg",
    description:
      "Shelf presence study, dielines, and print-ready exports.",
  },
  {
    slug: "motion-h",
    title: "Motion H",
    year: 2021,
    cover: "/work/motion-h/cover.jpg",
    longImage: "/projects/motion-h-long.jpg",
    description:
      "Short loops for reels/stories with simple kinetic type.",
  },
  {
    slug: "identity-i",
    title: "Identity I",
    year: 2020,
    cover: "/work/identity-i/cover.jpg",
    longImage: "/projects/identity-i-long.jpg",
    description:
      "Lean identity package built for small-biz speed and clarity.",
  },
];

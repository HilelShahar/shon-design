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
    longImage: "/single_long.jpg",
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
    longImage: "/zach_long.jpg",
    description:
      "Visual direction and key art for the ZACH release; bold type and high-contrast assets for web and print.",
  },
  {
    slug: "wedding-design",
    title: "Wessing & Events Invitation Design",
    year: 2025,
    cover: "/wedding_long.jpg",
    longImage: "/wedding_long.jpg",
    description:
      "Wedding invitation suite, signage, and social announcements with a modern yet timeless aesthetic.",
  },
  {
    slug: "barbershop-design",
    title: "Hair Stylist — Logo Design",
    year: 2024, 
    cover: "/barbershop.jpg",
    longImage: "/barbershop_long.jpg",
    description:
      "Brand identity, signage, and promotional materials for a modern barbershop.",
  },
  {
    slug: "clothing-brand-design",
    title: "Branding — VALOREA",
    year: 2024,
    cover: "/valorea.jpg",
    longImage: "/valorea_long.jpg",
    description:
    ""
  },


  // === Extra placeholders — swap titles/years/images when ready ===

/*
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
*/];
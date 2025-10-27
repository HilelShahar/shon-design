export type Project = {
  slug: string;
  title: string;
  year: string | number;
  cover: string;     // small/regular card image
  longImage: string; // long scrollable image
  description: string;
};

export const projects: Project[] = [
  {
    slug: "zach-track-design",
    title: "ZACH – Track Design",
    year: 2024,
    cover: "/example.jpg",
    longImage: "/projects/zach-long.jpg",
    description:
      "Visual identity and track graphics for ZACH. Clean shapes, crisp type, and a bold contrast system tailored for social and large-format print.",
  },
  {
    slug: "poster-series",
    title: "Poster Series",
    year: 2023,
    cover: "/p2.png",
    longImage: "/projects/poster-series-long.jpg",
    description:
      "A minimal poster series exploring rhythm and negative space. Delivered as production-ready files for online and print.",
  },
  {
    slug: "brand-system",
    title: "Brand System",
    year: 2023,
    cover: "/p2.png",
    longImage: "/projects/brand-system-long.jpg",
    description:
      "Core identity assets, color, typography, and usage rules for a compact, practical brand system.",
  },
];

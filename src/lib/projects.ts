// src/lib/projects.ts
export type Project = {
  slug: string;
  /** Project-facing name. Recent Work and the case study hero both read this. */
  title: string;
  /** Second hero line, when the case study shows one. Recent Work shows `title` only. */
  subtitle?: string;
  year: string | number;
  cover: string;     // small/regular card image
  longImage: string; // long scrollable image
  /**
   * Teaser shared by Recent Work and the case study overview.
   * Existing text stays until an approved short description is written.
   */
  shortDescription: string;
  shortDescriptionRtl?: boolean;
  /** True when this project still needs an approved short description. */
  shortDescriptionPending?: boolean;
  descriptionFooter?: string; // smaller watermark text at end (e.g. "עבודה סטודנטיאלית")
  /**
   * Discipline labels shared by Recent Work and the case study hero.
   * Fill with real disciplines only, for example "Branding" or "Print".
   */
  tags?: string[];
};

export const projects: Project[] = [
  // === Matches Home → Recent work ===
  {
    slug: "dolev-dadon-single-cover",
    title: "Single Cover — Dolev Dadon",
    year: 2025,
    cover: "/single.jpg",
    longImage: "/single_long.jpg",
    shortDescription:
      "עיצוב עטיפת סינגל המבטא את המסר הרומנטי והעוצמתי של השיר, המטרה הייתה ליצור דימוי שמחבר בין אהבה לנצחיות, תוך שמירה על אווירה חמה ומרגשת.",
    shortDescriptionRtl: true,
    shortDescriptionPending: true,
    tags: [],
  },
  {
    slug: "studio-movimiento-branding",
    title: "Branding — Studio Movimiento",
    year: 2025,
    cover: "/studio.jpg",
    longImage: "/studio_long.jpg",
    shortDescription: "",
    shortDescriptionPending: true,
    tags: ["Branding"],
  },
  {
    slug: "zach-track-design",
    title: "Salif Keita",
    subtitle: "Zach",
    year: 2025,
    cover: "/zach.jpg",
    longImage: "/zach_long.jpg",
    shortDescription:
      "After listening to the track, I built the visual direction around the feeling it gave me: an African sunset, warm colors, and a deep atmosphere. From there, I connected the music, the African-inspired visual language, and the landscape into one cohesive world.",
    tags: ["Cover art", "Art direction", "Visual identity", "Merchandise"],
  },
  {
    slug: "ice-cream-branding-selek",
    title: "Ice Cream Branding - Selek",
    year: 2025,
    cover: "/selek.png",
    longImage: "/selek_long.jpg",
    shortDescription:
      "בפרויקט זה, עסקתי במיתוג כולל לגלידת בוטיק צרפתית, שכולל את כל האלמנטים החזותיים מהאריזות ועד לשלטי החנות והפרסום. המטרה הייתה ליצור מיתוג ייחודי שמחבר את הקהל עם חוויית הגלידה בצורה מרהיבה. בנוסף יצרתי קמפיין פרסומי שיעביר את התחושה של התמכרות לטעם הייחודי של הגלידה.",
    shortDescriptionRtl: true,
    shortDescriptionPending: true,
    descriptionFooter: "עבודה סטודנטיאלית",
    tags: ["Branding", "Packaging"],
  },
  {
    slug: "album-design-human",
    title: "Album Design - HUMAN",
    year: 2025,
    cover: "/human.png",
    longImage: "/human_long.jpg",
    shortDescription:
      "פוסטר המעוצב מנקודת המבט האישית שלי, המשלב גוונים עמוקים של שחור ואדום כהה, נוצר בהשראת שיר המתמקד בצדדים המורכבים והאפלים של נפש האדם. העבודה מתבוננת במראה פנימית ומזכירה לנו שלפעמים, במעמקי הנשמה, אנו מגלים חלקים פחות טובים בעצמנו. כי בסופו של דבר, כולנו בני אדם, ולעיתים המורכבות הזו דורשת חשבון נפש.\n\nעיצבתי וסידרתי את הטיפוגרפיה של מילות השיר בצורה הפוכה, כמו השתקפות במראה. כדי להעביר את המסר והמשמעות והדבר מדגיש את המסר שאנו לפעמים רואים את עצמנו בצורה הפוכה מהמציאות, במיוחד כאשר אנו מתעמקים במבט פנימי ועמוק.",
    shortDescriptionRtl: true,
    shortDescriptionPending: true,
    descriptionFooter: "עבודה סטודנטיאלית",
    tags: ["Print"],
  },
  {
    slug: "forbidden-love-valentine",
    title: "Valentine Day Poster - Forbidden Love",
    year: 2025,
    cover: "/valentine.jpg",
    longImage: "/valentine_long.jpg",
    shortDescription:
      "הפוסטר \"אהבה אסורה\" מעביר תחושת ניגודיות עזה, עם דימויים של השטן והמלך מחזיקים ידיים, ובכך מייצגים את השילוב הבלתי אפשרי בין שני הפכים מוחלטים. האלמנט התלת-ממדי, המורכב מהמילים יום האהבה (באנגלית), משדר תחושת עומק ומעורר את התחושה של משהו נעלם וייחודי. הצבעים הכהים של הוורוד והדארק, בשילוב עם הזרקור הלבן שמאיר על הדמויות, יוצרות דינמיקה של משיכה והשלמה, כשהן ממקדות את העין על האהבה שמנצחת את כל המכשולים. הרקע של העננים הוורודים והעדינים מוסיף תחושת קלילות ומרמז על האפשרות שמה שנראה בלתי אפשרי יכול לקרות, וכי אפילו האהבה בין ניגודים יכולה לפרוח.",
    shortDescriptionRtl: true,
    shortDescriptionPending: true,
    tags: ["Print"],
  },
  {
    slug: "faith-vibe-eyewear",
    title: "Luxury Eyewear - Faith vibe & Co.",
    year: 2025,
    cover: "/eyewear.jpg",
    longImage: "/eyewear_long.jpg",
    shortDescription:
      "האייקון עוצב עבור מותג משקפי שמש ונבנה מתוך ראשי התיבות של המותג – FV. בתהליך העיצוב חיפשתי ליצור סמל שיהיה זכיר, יוקרתי וייחודי, אך יחד עם זאת ישדר וייב צעיר ורענן. הצורניות שנבחרה משלבת בין האותיות לבין אלמנטים מעולם האופטיקה – צורה המרמזת לעין עם ריסים, לצד קרניים המזכירות אור שמש, המתחברות באופן טבעי לעולם משקפי השמש. כך נוצר אייקון מינימליסטי בעל אופי ברור, המשלב אלגנטיות עם תחושת חופש ואור.",
    shortDescriptionRtl: true,
    shortDescriptionPending: true,
    tags: [],
  },
  {
    slug: "wedding-design",
    title: "Wedding & Events Invitation Design",
    year: 2025,
    cover: "/wedding_cover.png",
    longImage: "/wedding_long.jpg",
    shortDescription:
      "בעבודות האלו בחרתי לשלב בין אלגנטיות, טיפוגרפיה מדויקת וחומרים ויזואליים שמעבירים תחושת יוקרה ורוך – תוך התאמה אישית לסיפור ולרוח של כל זוג ואירוע.\n\nההזמנות עוצבו מתוך הקשבה אמיתית לצרכים של כל לקוח, במטרה ליצור חוויה שמתחילה עוד לפני שהאירוע עצמו מתחיל.\n\nכל הזמנה מביאה איתה עולם אחר – רומנטי, מסורתי, טבעי או מודרני – ומעוצבת בקפידה תוך שימת דגש על איזון, קומפוזיציה וסטייל.",
    shortDescriptionRtl: true,
    shortDescriptionPending: true,
  },
  {
    slug: "barbershop-design",
    title: "Hair Stylist — Logo Design",
    year: 2024, 
    cover: "/barbershop.jpg",
    longImage: "/barbershop_long.jpg",
    shortDescription:
      "לוגו יוקרתי וחדשני שעוצב עבור מעצב שיער, תוך שילוב יצירתי בין אותיות שמו של הלקוח. העיצוב משלב אלמנטים צעירים ואסתטיקה יוקרתית, המשקפים את חזון הלקוח ואת הערכים של המותג שלו. צורניות האותיות נבנתה בקפידה כדי לשדר סטייל, רעננות וייחודיות, ומתאימה לשימוש הן במיתוג המספרה והן במוצרים שהלקוח מתכנן לשווק.",
    shortDescriptionRtl: true,
    shortDescriptionPending: true,
  },
  {
    slug: "clothing-brand-design",
    title: "Branding — VALOREA",
    year: 2024,
    cover: "/valorea.jpg",
    longImage: "/valorea_long.jpg",
    shortDescription:
      "מותג אופנה מודרני המשלב אלגנטיות על-זמנית עם לבישות יומיומית. המותג משדר יוקרה שקטה, קווים נקיים ומינימליזם מוקפד, ומציע פריטים ורסטיליים שנוצרו לחיים האמיתיים.\n\nהאייקון שואב השראה מצורות טבעיות וסימטריות, המזכירות גם עלה עדין וגם רקמה יוקרתית, והופך למרקם עשיר המעצים את חוויית המותג.\n\nפלטת הצבעים, בהשראת ניואנסים טבעיים של אדמה, יוצרת מראה אחיד ומתוחכם בכל יישומי המותג – מתוויות בד ועד אריזות.",
    shortDescriptionRtl: true,
    shortDescriptionPending: true,
  },

  // === Extra placeholders — swap titles/years/images when ready ===

/*
  {
    slug: "brand-system-b",
    title: "Brand System B",
    year: 2024,
    cover: "/work/brand-b/cover.jpg",
    longImage: "/projects/brand-b-long.jpg",
    shortDescription:
      "Compact identity system: logo suite, color tokens, typography, and usage rules.",
  },
  {
    slug: "editorial-e",
    title: "Editorial E",
    year: 2022,
    cover: "/work/editorial-e/cover.jpg",
    longImage: "/projects/editorial-e-long.jpg",
    shortDescription:
      "Grid-first editorial exploration balancing dense copy with strong typography.",
  },
  {
    slug: "logo-lab-f",
    title: "Logo Lab F",
    year: 2022,
    cover: "/work/logo-f/cover.jpg",
    longImage: "/projects/logo-f-long.jpg",
    shortDescription:
      "Series of marks/monograms with alternates and black/white lockups.",
  },
  {
    slug: "packaging-g",
    title: "Packaging G",
    year: 2021,
    cover: "/work/packaging-g/cover.jpg",
    longImage: "/projects/packaging-g-long.jpg",
    shortDescription:
      "Shelf presence study, dielines, and print-ready exports.",
  },
  {
    slug: "motion-h",
    title: "Motion H",
    year: 2021,
    cover: "/work/motion-h/cover.jpg",
    longImage: "/projects/motion-h-long.jpg",
    shortDescription:
      "Short loops for reels/stories with simple kinetic type.",
  },
  {
    slug: "identity-i",
    title: "Identity I",
    year: 2020,
    cover: "/work/identity-i/cover.jpg",
    longImage: "/projects/identity-i-long.jpg",
    shortDescription:
      "Lean identity package built for small-biz speed and clarity.",
  },
];
*/];
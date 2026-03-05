// src/lib/projects.ts
export type Project = {
  slug: string;
  title: string;
  year: string | number;
  cover: string;     // small/regular card image
  longImage: string; // long scrollable image
  description: string;
  descriptionRtl?: boolean; // true for Hebrew/RTL descriptions
  descriptionFooter?: string; // smaller watermark text at end (e.g. "עבודה סטודנטיאלית")
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
      "עיצוב עטיפת סינגל המבטא את המסר הרומנטי והעוצמתי של השיר, המטרה הייתה ליצור דימוי שמחבר בין אהבה לנצחיות, תוך שמירה על אווירה חמה ומרגשת.",
    descriptionRtl: true,
  },
  {
    slug: "studio-movimiento-branding",
    title: "Branding — Studio Movimiento",
    year: 2025,
    cover: "/studio.jpg",
    longImage: "/studio_long.jpg",
    description: "",
  },
  {
    slug: "zach-track-design",
    title: "ZACH — Track Design",
    year: 2025,
    cover: "/zach.jpg",
    longImage: "/zach_long.jpg",
    description:
      "בעבודה זו יצרתי עטיפת טראק הלוקחת את המאזינים למסע מרגש באפריקה, דרך צלילים שעוטפים את שקיעותיה האדומות. העיצוב משלב את הסגנון האפריקאי עם תווי המוזיקה בצורה הרמונית, כך שהתחושה היא של שקיעה מרהיבה במקום שבו המוזיקה והטבע מתמזגים. הפרויקט הזה גם חושף את סיפורו של המפיק המוזיקלי ומעורר סקרנות לעוד מוזיקה שתגיע...",
    descriptionRtl: true,
  },
  {
    slug: "ice-cream-branding-selek",
    title: "Ice Cream Branding - Selek",
    year: 2025,
    cover: "/selek.png",
    longImage: "/selek_long.jpg",
    description:
      "בפרויקט זה, עסקתי במיתוג כולל לגלידת בוטיק צרפתית, שכולל את כל האלמנטים החזותיים מהאריזות ועד לשלטי החנות והפרסום. המטרה הייתה ליצור מיתוג ייחודי שמחבר את הקהל עם חוויית הגלידה בצורה מרהיבה. בנוסף יצרתי קמפיין פרסומי שיעביר את התחושה של התמכרות לטעם הייחודי של הגלידה.",
    descriptionRtl: true,
    descriptionFooter: "עבודה סטודנטיאלית",
  },
  {
    slug: "album-design-human",
    title: "Album Design - HUMAN",
    year: 2025,
    cover: "/human.png",
    longImage: "/human_long.jpg",
    description:
      "פוסטר המעוצב מנקודת המבט האישית שלי, המשלב גוונים עמוקים של שחור ואדום כהה, נוצר בהשראת שיר המתמקד בצדדים המורכבים והאפלים של נפש האדם. העבודה מתבוננת במראה פנימית ומזכירה לנו שלפעמים, במעמקי הנשמה, אנו מגלים חלקים פחות טובים בעצמנו. כי בסופו של דבר, כולנו בני אדם, ולעיתים המורכבות הזו דורשת חשבון נפש.\n\nעיצבתי וסידרתי את הטיפוגרפיה של מילות השיר בצורה הפוכה, כמו השתקפות במראה. כדי להעביר את המסר והמשמעות והדבר מדגיש את המסר שאנו לפעמים רואים את עצמנו בצורה הפוכה מהמציאות, במיוחד כאשר אנו מתעמקים במבט פנימי ועמוק.",
    descriptionRtl: true,
    descriptionFooter: "עבודה סטודנטיאלית",
  },
  {
    slug: "forbidden-love-valentine",
    title: "Valentine Day Poster - Forbidden Love",
    year: 2025,
    cover: "/valentine.jpg",
    longImage: "/valentine_long.jpg",
    description:
      "הפוסטר \"אהבה אסורה\" מעביר תחושת ניגודיות עזה, עם דימויים של השטן והמלך מחזיקים ידיים, ובכך מייצגים את השילוב הבלתי אפשרי בין שני הפכים מוחלטים. האלמנט התלת-ממדי, המורכב מהמילים יום האהבה (באנגלית), משדר תחושת עומק ומעורר את התחושה של משהו נעלם וייחודי. הצבעים הכהים של הוורוד והדארק, בשילוב עם הזרקור הלבן שמאיר על הדמויות, יוצרות דינמיקה של משיכה והשלמה, כשהן ממקדות את העין על האהבה שמנצחת את כל המכשולים. הרקע של העננים הוורודים והעדינים מוסיף תחושת קלילות ומרמז על האפשרות שמה שנראה בלתי אפשרי יכול לקרות, וכי אפילו האהבה בין ניגודים יכולה לפרוח.",
    descriptionRtl: true,
  },
  {
    slug: "faith-vibe-eyewear",
    title: "Luxury Eyewear - Faith vibe & Co.",
    year: 2025,
    cover: "/eyewear.jpg",
    longImage: "/eyewear_long.jpg",
    description:
      "האייקון עוצב עבור מותג משקפי שמש ונבנה מתוך ראשי התיבות של המותג – FV. בתהליך העיצוב חיפשתי ליצור סמל שיהיה זכיר, יוקרתי וייחודי, אך יחד עם זאת ישדר וייב צעיר ורענן. הצורניות שנבחרה משלבת בין האותיות לבין אלמנטים מעולם האופטיקה – צורה המרמזת לעין עם ריסים, לצד קרניים המזכירות אור שמש, המתחברות באופן טבעי לעולם משקפי השמש. כך נוצר אייקון מינימליסטי בעל אופי ברור, המשלב אלגנטיות עם תחושת חופש ואור.",
    descriptionRtl: true,
  },
  {
    slug: "wedding-design",
    title: "Wedding & Events Invitation Design",
    year: 2025,
    cover: "/wedding_long.jpg",
    longImage: "/wedding_long.jpg",
    description:
      "בעבודות האלו בחרתי לשלב בין אלגנטיות, טיפוגרפיה מדויקת וחומרים ויזואליים שמעבירים תחושת יוקרה ורוך – תוך התאמה אישית לסיפור ולרוח של כל זוג ואירוע.\n\nההזמנות עוצבו מתוך הקשבה אמיתית לצרכים של כל לקוח, במטרה ליצור חוויה שמתחילה עוד לפני שהאירוע עצמו מתחיל.\n\nכל הזמנה מביאה איתה עולם אחר – רומנטי, מסורתי, טבעי או מודרני – ומעוצבת בקפידה תוך שימת דגש על איזון, קומפוזיציה וסטייל.",
    descriptionRtl: true,
  },
  {
    slug: "barbershop-design",
    title: "Hair Stylist — Logo Design",
    year: 2024, 
    cover: "/barbershop.jpg",
    longImage: "/barbershop_long.jpg",
    description:
      "לוגו יוקרתי וחדשני שעוצב עבור מעצב שיער, תוך שילוב יצירתי בין אותיות שמו של הלקוח. העיצוב משלב אלמנטים צעירים ואסתטיקה יוקרתית, המשקפים את חזון הלקוח ואת הערכים של המותג שלו. צורניות האותיות נבנתה בקפידה כדי לשדר סטייל, רעננות וייחודיות, ומתאימה לשימוש הן במיתוג המספרה והן במוצרים שהלקוח מתכנן לשווק.",
    descriptionRtl: true,
  },
  {
    slug: "clothing-brand-design",
    title: "Branding — VALOREA",
    year: 2024,
    cover: "/valorea.jpg",
    longImage: "/valorea_long.jpg",
    description:
      "מותג אופנה מודרני המשלב אלגנטיות על-זמנית עם לבישות יומיומית. המותג משדר יוקרה שקטה, קווים נקיים ומינימליזם מוקפד, ומציע פריטים ורסטיליים שנוצרו לחיים האמיתיים.\n\nהאייקון שואב השראה מצורות טבעיות וסימטריות, המזכירות גם עלה עדין וגם רקמה יוקרתית, והופך למרקם עשיר המעצים את חוויית המותג.\n\nפלטת הצבעים, בהשראת ניואנסים טבעיים של אדמה, יוצרת מראה אחיד ומתוחכם בכל יישומי המותג – מתוויות בד ועד אריזות.",
    descriptionRtl: true,
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
export type Testimonial = {
  text: string;
  name: string;
  title: string;
  stars: number;
  image?: string;
  initials?: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    text: "פניתי לשון לעיצוב עטיפה למוזיקה והוא הצליח לתרגם את האווירה של השיר בצורה ויזואלית ממש יפה. העיצוב עם השקיעות והאווירה האפריקאית יצא מאוד מיוחד",
    name: "מיסטיקן.",
    title: "יוצר מוזיקה",
    stars: 5,
    image: "/testimonials/mistikan.jpg",
  },
  {
    text: "שון עובד איתי על עיצוב קטלוג והוא מאוד מסודר ומקצועי בתהליך. הוא שולח סקיצות, מקשיב לפידבק ותמיד זמין לשינויים. העבודה איתו נעימה והתוצאה נראית מצוין",
    name: "מיה ר.",
    title: "בעלת עסק",
    stars: 4,
    image: "/testimonials/mia.jpg",
  },
  {
    text: "שון הגיע לסטודיו כדי להבין את האווירה והסגנון שלי, וזה ממש הורגש בתוצאה. דרך התמונות והשיחה בינינו הוא הצליח למצוא כיוון ללוגו שמרגיש מאוד מדויק לעסק",
    name: "יעל ק.",
    title: "בעלת סטודיו",
    stars: 5,
    image: "/testimonials/yael.jpg",
  },
  {
    text: "מה שאהבתי אצל שון זה הגישה הנעימה והמקצועית. הוא מקשיב, מציע רעיונות משלו ומצליח להביא משהו קצת אחר מהרגיל",
    name: "נועם ש.",
    title: "יזם",
    stars: 4,
    image: "/testimonials/noam.jpg",
  },
  {
    text: "שון הגיע לפגישה איתי כדי להבין את העסק והכיוון למיתוג, וזה ממש עזר לתהליך. הוא הביא כמה רעיונות מעניינים ללוגו ובסוף הצלחנו להגיע לפתרון שמרגיש נכון למותג",
    name: "עומר ל.",
    title: "בעל מותג",
    stars: 5,
    image: "/testimonials/omer.jpg",
  },
  {
    text: "עבדתי עם שון על תהליך מיתוג והוא ליווה אותי גם בבחירות לקראת ההדפסה הוא הסביר על החומרים, הצבעים ומה יעבוד הכי טוב בפועל הרגשתי שיש מישהו שממש חושב עד הפרטים הקטנים ולא רק על העיצוב עצמו.",
    name: "יוסי זוהר",
    title: "בעל עסק",
    stars: 5,
    image: "/testimonials/yossi.jpg",
  },
  {
    text: "שון עיצב עבורי עטיפת סינגל ליוטיוב, והצליח לבטא בצורה מדויקת את האווירה הרומנטית והעוצמתית של השיר. העיצוב חיבר יפה בין אהבה לנצחיות, עם תחושה חמה, מרגשת ונעימה לעין.",
    name: "דולב דדון",
    title: "זמר",
    stars: 5,
    image: "/testimonials/dolev-dadon.png",
  },
];

export function testimonialInitials(name: string) {
  const parts = name
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
}

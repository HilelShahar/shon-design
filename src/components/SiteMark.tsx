import Link from "next/link";

/** Homepage SHONS mark. Sits in the page header and scrolls away with it. Hidden below md. */
export default function SiteMark() {
  return (
    <Link
      href="/"
      aria-label="Home"
      className="absolute top-4 left-6 z-40 hidden items-center md:flex"
    >
      <img src="/icon.png" alt="Shon Simhon" className="h-14 w-auto md:h-16" />
    </Link>
  );
}

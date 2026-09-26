import SocialIconLinks from "@/components/SocialIconLinks";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border px-4 py-10 sm:py-11">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 text-center">
        <SocialIconLinks className="flex items-center justify-center gap-4 sm:gap-5" />
        <p className="max-w-lg px-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          © 2026 Shon&apos;s Design. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

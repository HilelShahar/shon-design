import PillNav from "@/components/PillNav";
import SiteFooter from "@/components/SiteFooter";
import AboutHero from "@/components/about/AboutHero";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PillNav />
      <AboutHero />
      <SiteFooter />
    </div>
  );
}

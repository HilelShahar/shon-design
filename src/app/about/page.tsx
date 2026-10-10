import PillNav from "@/components/PillNav";
import SiteFooter from "@/components/SiteFooter";
import AboutHero from "@/components/about/AboutHero";
import {
  AboutCta,
  BeyondDesign,
  HowIGotHere,
  HowIThinkAndWork,
  WhereImHeading,
} from "@/components/about/AboutSections";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PillNav />
      <AboutHero />
      <HowIGotHere />
      <BeyondDesign />
      <HowIThinkAndWork />
      <WhereImHeading />
      <AboutCta />
      <SiteFooter />
    </div>
  );
}

import PillNav from "@/components/PillNav";
import SiteFooter from "@/components/SiteFooter";
import AboutHero from "@/components/about/AboutHero";
import {
  AboutCta,
  BeyondDesign,
  LittleAboutMe,
  HowIThinkAndWork,
  WhereImHeading,
} from "@/components/about/AboutSections";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground" lang="en" dir="ltr">
      <PillNav />
      <AboutHero />
      <LittleAboutMe />
      <BeyondDesign />
      <HowIThinkAndWork />
      <WhereImHeading />
      <AboutCta />
      <SiteFooter />
    </div>
  );
}

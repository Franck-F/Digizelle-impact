import { Hero } from "@/components/sections/Hero";
import { AboutSection } from "@/components/sections/AboutSection";
import { SpeakersPreview } from "@/components/sections/SpeakersPreview";
import { ProgrammePreview } from "@/components/sections/ProgrammePreview";
import { SponsorsSection } from "@/components/sections/SponsorsSection";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <SpeakersPreview />
      <ProgrammePreview />
      <SponsorsSection />
      <CTASection />
    </>
  );
}

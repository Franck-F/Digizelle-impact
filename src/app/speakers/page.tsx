import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SpeakerGrid } from "@/components/speakers/SpeakerGrid";
import { speakers } from "@/lib/data/speakers";

export const metadata: Metadata = {
  title: "Speakers",
  description:
    "Découvrez les intervenants du Digizelle Impact Event 2026. Des leaders de Microsoft, Google, AXA et X-HEC Entrepreneurs.",
};

export default function SpeakersPage() {
  return (
    <section className="min-h-screen bg-cream pt-24 pb-16 sm:pt-32 sm:pb-24">
      <Container>
        <SectionTitle
          label="Intervenants"
          title="Nos Speakers"
          description="Des leaders d'exception réunis pour inspirer, partager et construire l'avenir de la tech ensemble."
        />

        <SpeakerGrid speakers={speakers} />
      </Container>
    </section>
  );
}

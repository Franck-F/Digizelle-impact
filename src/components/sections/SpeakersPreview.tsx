"use client";

import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { SpeakerGrid } from "@/components/speakers/SpeakerGrid";
import { FadeIn } from "@/components/animations/FadeIn";
import { speakers } from "@/lib/data/speakers";

export function SpeakersPreview() {
  return (
    <section className="bg-cream py-16 sm:py-24">
      <Container>
        <SectionTitle
          label="Intervenants"
          title="Nos Speakers"
          description="Des leaders d'exception de Microsoft, Epitech, Allianz, X-HEC Entrepreneurs et New Deal Founders."
        />

        <SpeakerGrid speakers={speakers} limit={5} />

        <FadeIn delay={0.3}>
          <div className="mt-10 text-center sm:mt-12">
            <Button href="/speakers" variant="outline">
              Voir tous les speakers
            </Button>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}

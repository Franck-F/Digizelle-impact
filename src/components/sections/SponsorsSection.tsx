"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/FadeIn";

const strategicPartners = [
  { name: "AXA" },
  { name: "Microsoft" },
  { name: "Google" },
];

export function SponsorsSection() {
  return (
    <section className="bg-cream py-16 sm:py-24">
      <Container>
        <SectionTitle
          label="L'alliance stratégique"
          title="Nos Partenaires"
          description="Une coalition d'acteurs majeurs unis pour l'innovation."
        />

        <StaggerContainer className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-6 sm:gap-12">
          {strategicPartners.map((partner) => (
            <StaggerItem key={partner.name}>
              <div className="group flex h-20 w-32 items-center justify-center rounded-sm border border-border bg-surface p-4 transition-all duration-300 hover:border-gold hover:shadow-md sm:h-24 sm:w-40 sm:p-6">
                <span className="font-serif text-xl font-bold text-heading/40 transition-colors group-hover:text-heading sm:text-2xl">
                  {partner.name}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.3}>
          <div className="mt-8 flex flex-col items-center gap-3 sm:mt-12">
            <Image
              src="/images/mascotte/mascotte1.png"
              alt="Digizelle"
              width={180}
              height={180}
              className="h-24 w-auto opacity-50 sm:h-32"
            />
            <p className="text-sm italic text-body">
              Logos des partenaires à venir
            </p>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}

"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/FadeIn";

const strategicPartners = [
  { name: "Epitech", linkedin: "https://www.linkedin.com/school/epitech---european-institute-of-technology/" },
  { name: "Microsoft", linkedin: "https://www.linkedin.com/company/microsoft/" },
  { name: "AWS", linkedin: "https://www.linkedin.com/company/amazon-web-services/" },
  { name: "Allianz", linkedin: "https://www.linkedin.com/company/allianz/" },
  { name: "X-HEC", linkedin: "https://www.linkedin.com/company/x-hec-entrepreneurs/" },
  { name: "New Deal Founders", linkedin: "https://www.linkedin.com/company/newdeal-founders/" },
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

        <StaggerContainer className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-6 sm:gap-10">
          {strategicPartners.map((partner) => (
            <StaggerItem key={partner.name}>
              <a
                href={partner.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-20 w-36 items-center justify-center rounded-sm border border-border bg-surface p-4 transition-all duration-300 hover:border-purple hover:shadow-md sm:h-24 sm:w-44 sm:p-6"
              >
                <span className="text-center font-serif text-lg font-bold text-heading/40 transition-colors group-hover:text-heading sm:text-xl">
                  {partner.name}
                </span>
              </a>
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
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}

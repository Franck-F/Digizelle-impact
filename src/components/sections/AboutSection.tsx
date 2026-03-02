"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/FadeIn";
import { PILLARS, EVENT } from "@/lib/constants";

const pillarIcons: Record<string, React.ReactNode> = {
  award: (
    <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-4.5A3.375 3.375 0 0 0 13.125 10.875h-2.25A3.375 3.375 0 0 0 7.5 14.25v4.5m4.5-15a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5Z" />
    </svg>
  ),
  mountain: (
    <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 21 6.75-9 3 4.5L18 9l3 12H3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.25 3.75 1.5-1.5 1.5 1.5M15.75 2.25v3" />
    </svg>
  ),
  lightbulb: (
    <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  circuit: (
    <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  ),
};

export function AboutSection() {
  return (
    <section className="relative bg-section py-16 sm:py-24">
      {/* Mascotte accent — floating right */}
      <div className="pointer-events-none absolute right-2 top-8 sm:right-6 sm:top-12 lg:right-12 lg:top-16">
        <Image
          src="/images/mascotte/mascotte4.png"
          alt=""
          width={160}
          height={160}
          className="h-16 w-auto opacity-20 sm:h-24 lg:h-32"
        />
      </div>

      <Container>
        <SectionTitle
          label="L'événement"
          title="Au cœur de l'échange"
          description={EVENT.description}
        />

        <FadeIn>
          <blockquote className="mx-auto mb-10 max-w-3xl border-l-4 border-purple py-2 pl-4 text-center font-serif text-lg italic text-heading sm:mb-16 sm:pl-6 sm:text-xl md:text-2xl">
            &ldquo;{EVENT.quote}&rdquo;
          </blockquote>
        </FadeIn>

        <StaggerContainer className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-6">
          {PILLARS.map((pillar) => (
            <StaggerItem key={pillar.title}>
              <div className="group h-full rounded-sm border border-border bg-cream p-5 transition-all duration-300 hover:border-purple hover:shadow-lg sm:p-6">
                <div className="mb-3 text-purple transition-colors group-hover:text-heading sm:mb-4">
                  {pillarIcons[pillar.icon]}
                </div>
                <h3 className="mb-2 font-serif text-base font-semibold text-heading sm:text-lg">
                  {pillar.title}
                </h3>
                <p className="text-xs leading-relaxed text-body sm:text-sm">
                  {pillar.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}

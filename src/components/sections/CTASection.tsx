"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/animations/FadeIn";
import { EVENT } from "@/lib/constants";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-navy py-16 sm:py-24">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute left-[-10%] top-[-20%] h-[300px] w-[300px] rounded-full border border-purple/10 sm:h-[400px] sm:w-[400px]" />
      <div className="pointer-events-none absolute bottom-[-20%] right-[-10%] h-[350px] w-[350px] rounded-full border border-purple/10 sm:h-[500px] sm:w-[500px]" />

      <Container className="relative z-10 text-center">
        <FadeIn>
          <Image
            src="/images/mascotte/mascotte1.png"
            alt="Digizelle Mascotte"
            width={280}
            height={280}
            className="mx-auto mb-6 h-36 w-auto sm:mb-8 sm:h-48 lg:h-56"
          />
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="mx-auto max-w-2xl font-serif text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
            Rejoignez-nous le {EVENT.displayDate}
          </h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <a
            href={EVENT.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm text-purple-light transition-colors hover:text-purple-light-light sm:mt-4 sm:text-base"
          >
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            {EVENT.locationFull}
          </a>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mx-auto mt-3 max-w-xl text-base text-white/60 sm:mt-4 sm:text-lg">
            Ce soir, on ne vient pas seulement écouter. On vient créer des
            connexions utiles. Transformer l&apos;inspiration en action.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-6 flex w-full flex-col items-center gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:justify-center sm:gap-4">
            <Button href="/contact" variant="secondary" size="lg">
              Réserver ma place
            </Button>
            <Button href="/a-propos" variant="accent" size="lg">
              En savoir plus
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.15em] text-purple-light sm:mt-8 sm:text-sm sm:tracking-[0.2em]">
            {EVENT.motto}
          </p>
        </FadeIn>
      </Container>
    </section>
  );
}

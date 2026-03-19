"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { FadeIn } from "@/components/animations/FadeIn";
import { EVENT } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-cream pt-14 sm:pt-16 lg:pt-20">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute right-[-15%] top-[10%] h-[250px] w-[250px] rounded-full border border-purple/20 sm:right-[-5%] sm:h-[500px] sm:w-[500px]" />
      <div className="pointer-events-none absolute right-[0%] top-[18%] hidden rounded-full border border-purple/30 sm:block sm:h-[350px] sm:w-[350px]" />
      <div className="pointer-events-none absolute right-[10%] top-[22%] hidden rounded-full border border-purple/20 md:block md:h-[200px] md:w-[200px]" />

      <Container className="relative z-10 flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-12 text-center sm:min-h-[calc(100vh-4rem)] sm:py-20 lg:min-h-[calc(100vh-5rem)]">
        <FadeIn>
          <span className="mb-3 inline-block text-xs font-medium uppercase tracking-[0.2em] text-purple sm:mb-4 sm:text-sm sm:tracking-[0.25em]">
            {EVENT.name}
          </span>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="max-w-4xl font-serif text-5xl font-extrabold leading-tight text-heading sm:text-7xl md:text-8xl lg:text-9xl">
            Votre avis compte !
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mt-6 max-w-2xl text-base text-purple dark:text-purple-light sm:mt-8 sm:text-lg md:text-xl mx-auto">
            Merci d’avoir participé à l’événement. Prenez 1 minute pour partager votre ressenti et contribuer à l’avenir de la communauté.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:gap-4 justify-center">
            <Button href="/survey" variant="secondary" size="lg">
              Donner mon avis
            </Button>
            <Button href="/event-images" variant="outline" size="lg">
              L'événement en images
            </Button>
          {/* Fin du bloc boutons */}
          </div>
        </FadeIn>

        {/* Mascotte — bottom right */}
        <FadeIn delay={0.6} direction="right">
          <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-8">
            <Image
              src="/images/mascotte/mascotte4.png"
              alt="Digizelle Mascotte"
              width={200}
              height={200}
              className="h-20 w-auto opacity-60 transition-opacity hover:opacity-100 sm:h-28 lg:h-40"
            />
          </div>
        </FadeIn>

        {/* Mascotte — top left accent */}
        <FadeIn delay={0.7} direction="left">
          <div className="absolute left-4 top-24 hidden sm:block sm:top-28 lg:left-8 lg:top-32">
            <Image
              src="/images/mascotte/mascotte3.png"
              alt="Digizelle"
              width={120}
              height={120}
              className="h-16 w-auto opacity-30 transition-opacity hover:opacity-70 lg:h-24"
            />
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}

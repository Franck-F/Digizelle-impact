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
          <h1 className="max-w-4xl font-serif text-3xl font-bold leading-tight text-heading sm:text-4xl md:text-5xl lg:text-7xl">
            Leadership & Innovation :{" "}
            <span className="text-purple dark:text-purple-light">construire l&apos;avenir ensemble</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-4 max-w-xl text-base text-body sm:mt-6 sm:text-lg">
            {EVENT.displayDate} &middot;{" "}
            <a
              href={EVENT.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-purple/40 underline-offset-2 transition-colors hover:text-purple"
            >
              {EVENT.locationFull}
            </a>
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-8 sm:mt-10">
            <CountdownTimer />
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:gap-4">
            <Button href="/contact" variant="secondary" size="lg">
              Réserver ma place
            </Button>
            <Button href="/programme" variant="outline" size="lg">
              Voir le programme
            </Button>
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

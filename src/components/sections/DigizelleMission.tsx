"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FadeIn } from "@/components/animations/FadeIn";

export function DigizelleMission() {
  return (
    <section className="bg-cream py-16 sm:py-24">
      <Container>
        <SectionTitle
          label="Qui sommes-nous"
          title="Notre Mission"
        />

        <div className="mx-auto max-w-4xl items-center gap-10 sm:gap-16 lg:flex">
          {/* Mascotte */}
          <FadeIn direction="left" className="mb-8 flex shrink-0 justify-center lg:mb-0">
            <Image
              src="/images/mascotte/mascotte.png"
              alt="Digizelle"
              width={200}
              height={200}
              className="h-32 w-auto sm:h-40 lg:h-48"
            />
          </FadeIn>

          {/* Text */}
          <FadeIn direction="right" delay={0.15} className="flex-1">
            <p className="text-justify text-base leading-relaxed text-body sm:text-lg">
              Digizelle a pour mission d&apos;inspirer, d&apos;éduquer et d&apos;accompagner
              les jeunes dans leur parcours vers le digital.
            </p>
            <p className="mt-4 text-justify text-base leading-relaxed text-body sm:mt-6 sm:text-lg">
              À travers cette association, nous avons à cœur de créer un environnement
              stimulant et bienveillant, permettant à chacun de développer son potentiel
              tout en contribuant à des projets concrets et à fort impact.
            </p>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}

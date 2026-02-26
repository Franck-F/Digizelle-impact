"use client";

import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/FadeIn";
import { programme } from "@/lib/data/programme";
import { clsx } from "clsx";

const typeStyles = {
  opening: "border-purple bg-purple/5",
  talk: "border-purple-light bg-purple-light/5",
  panel: "border-navy bg-navy/5 dark:bg-navy/20",
  networking: "border-navy-light bg-navy-light/5 dark:bg-navy-light/20",
  break: "border-border bg-cream",
};

const typeBadge = {
  opening: "bg-purple/20 text-purple dark:text-purple-light",
  talk: "bg-purple-light/20 text-purple dark:text-purple-light",
  panel: "bg-navy/20 text-navy dark:text-cream",
  networking: "bg-navy-light/20 text-navy-light dark:text-purple-light",
  break: "bg-border text-body",
};

export function ProgrammePreview() {
  return (
    <section className="bg-section py-16 sm:py-24">
      <Container>
        <SectionTitle
          label="Programme"
          title="Une soirée d'exception"
          description="De l'ouverture officielle au networking stratégique, chaque moment est pensé pour inspirer."
        />

        <StaggerContainer className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
          {programme.map((item) => (
            <StaggerItem key={item.time}>
              <div
                className={clsx(
                  "relative rounded-sm border-l-4 p-4 transition-all duration-300 hover:shadow-md sm:p-6",
                  typeStyles[item.type]
                )}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-6">
                  <span className="shrink-0 font-serif text-xl font-bold text-heading sm:text-2xl">
                    {item.time}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <h3 className="font-serif text-base font-semibold text-heading sm:text-lg">
                        {item.title}
                      </h3>
                      <span
                        className={clsx(
                          "rounded-full px-2 py-0.5 text-[10px] font-medium sm:text-xs",
                          typeBadge[item.type]
                        )}
                      >
                        {item.type === "opening" && "Ouverture"}
                        {item.type === "talk" && "Keynote"}
                        {item.type === "panel" && "Table Ronde"}
                        {item.type === "networking" && "Networking"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-body">
                      {item.description}
                    </p>
                    {item.speakers && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.speakers.map((name) => (
                          <span
                            key={name}
                            className="rounded-sm bg-cream px-2 py-1 text-xs font-medium text-heading"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.3}>
          <div className="mt-10 text-center sm:mt-12">
            <Button href="/programme" variant="outline">
              Programme complet
            </Button>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}

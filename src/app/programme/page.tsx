import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { programme } from "@/lib/data/programme";
import { EVENT } from "@/lib/constants";
import { clsx } from "clsx";

export const metadata: Metadata = {
  title: "Programme",
  description:
    "Découvrez le programme complet du Digizelle Impact Event 2026. Keynotes, table ronde et networking stratégique.",
};

const typeColors = {
  opening: "bg-purple text-white",
  talk: "bg-purple text-white",
  panel: "bg-navy text-white",
  networking: "bg-navy-light text-white",
  break: "bg-cream-dark text-heading",
};

// One mascot per programme item
const itemMascots = [
  { src: "/images/mascotte/mascotte3.png", alt: "Ouverture" },
  { src: "/images/mascotte/mascotte4.png", alt: "Keynote" },
  { src: "/images/mascotte/mascotte2.png", alt: "Table Ronde" },
  { src: "/images/mascotte/mascotte1.png", alt: "Networking" },
];

export default function ProgrammePage() {
  return (
    <section className="relative min-h-screen bg-cream pt-24 pb-16 sm:pt-32 sm:pb-24">
      {/* Floating mascot — top right */}
      <div className="pointer-events-none absolute right-2 top-28 sm:right-6 sm:top-36 lg:right-12 lg:top-40">
        <Image
          src="/images/mascotte/mascotte4.png"
          alt=""
          width={160}
          height={160}
          className="h-16 w-auto opacity-10 sm:h-24 lg:h-32"
        />
      </div>

      {/* Floating mascot — bottom left */}
      <div className="pointer-events-none absolute bottom-16 left-2 sm:bottom-24 sm:left-6 lg:left-12">
        <Image
          src="/images/mascotte/mascotte3.png"
          alt=""
          width={140}
          height={140}
          className="h-14 w-auto opacity-10 sm:h-20 lg:h-28"
        />
      </div>

      <Container>
        <SectionTitle
          label={EVENT.displayDate + " — " + EVENT.location}
          title="Programme de la soirée"
          description={
            <>
              De l&apos;ouverture officielle au networking stratégique, chaque moment est pensé pour inspirer et connecter.{" "}
              <a
                href={EVENT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-purple transition-colors hover:text-purple-light"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {EVENT.locationFull}
              </a>
            </>
          }
        />

        {/* Quote */}
        <blockquote className="mx-auto mb-10 max-w-3xl border-l-4 border-purple py-2 pl-4 text-center font-serif text-lg italic text-heading sm:mb-16 sm:pl-6 sm:text-xl md:text-2xl">
          &ldquo;{EVENT.quote}&rdquo;
        </blockquote>

        {/* Timeline */}
        <div className="mx-auto max-w-3xl">
          <div className="relative space-y-0">
            {/* Vertical line */}
            <div className="absolute left-7 top-0 h-full w-px bg-purple/30 sm:left-8 md:left-12" />

            {programme.map((item, index) => (
              <div key={item.time} className="relative flex gap-4 py-6 sm:gap-6 sm:py-8 md:gap-10">
                {/* Time circle */}
                <div className="relative z-10 flex shrink-0 flex-col items-center">
                  <div
                    className={clsx(
                      "flex h-14 w-14 items-center justify-center rounded-full text-center text-xs font-bold sm:h-16 sm:w-16 sm:text-sm md:h-24 md:w-24 md:text-lg",
                      typeColors[item.type]
                    )}
                  >
                    {item.time}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 rounded-sm border border-border bg-surface p-4 shadow-sm sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-serif text-lg font-semibold text-heading sm:text-xl md:text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-body sm:mt-3 sm:text-base">
                        {item.description}
                      </p>
                    </div>
                    {/* Mascot per item */}
                    {itemMascots[index] && (
                      <Image
                        src={itemMascots[index].src}
                        alt={itemMascots[index].alt}
                        width={80}
                        height={80}
                        className="h-10 w-auto shrink-0 opacity-40 sm:h-14"
                      />
                    )}
                  </div>
                  {item.speakers && (
                    <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
                      {item.speakers.map((name) => (
                        <span
                          key={name}
                          className="rounded-sm bg-cream px-2 py-1 text-xs font-medium text-heading sm:px-3 sm:text-sm"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom mascot */}
        <div className="mt-10 flex justify-center sm:mt-14">
          <Image
            src="/images/mascotte/mascotte1.png"
            alt="Digizelle"
            width={200}
            height={200}
            className="h-24 w-auto opacity-40 sm:h-32 lg:h-40"
          />
        </div>

        <div className="mt-6 text-center sm:mt-8">
          <Button href="/contact" variant="secondary" size="lg">
            Réserver ma place
          </Button>
        </div>
      </Container>
    </section>
  );
}

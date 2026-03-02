import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { EVENT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "À Propos",
  description:
    "Découvrez le Digizelle Impact Event 2026. Un événement élégant et moderne autour du leadership, de l'innovation et de la tech.",
};

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-cream pt-24 pb-16 sm:pt-32 sm:pb-24">
      <Container>
        <SectionTitle
          label="À Propos"
          title="Digizelle Impact Event 2026"
          description="Un événement professionnel, inspirant, inclusif et de haut niveau."
        />

        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 sm:gap-12 md:grid-cols-2">
            <div>
              <h3 className="mb-3 font-serif text-xl font-bold text-heading sm:mb-4 sm:text-2xl">
                Le Contexte
              </h3>
              <p className="text-justify text-sm leading-relaxed text-body sm:text-base">
                À l&apos;occasion de la Journée internationale des droits des
                femmes, Digizelle organise un événement d&apos;exception réunissant
                les acteurs majeurs de la tech. Le 8 mars est le contexte, pas le
                contenu. Nous parlons business et performance.
              </p>
            </div>
            <div>
              <h3 className="mb-3 font-serif text-xl font-bold text-heading sm:mb-4 sm:text-2xl">
                L&apos;Argument
              </h3>
              <p className="text-justify text-sm leading-relaxed text-body sm:text-base">
                La compétence. L&apos;ambition. L&apos;innovation. Nous invitons
                hommes et femmes à la même table. Un dialogue ouvert pour créer de
                vraies opportunités.
              </p>
            </div>
          </div>

          {/* Quote */}
          <blockquote className="my-10 border-l-4 border-purple py-3 pl-4 font-serif text-lg italic text-heading text-justify sm:my-16 sm:py-4 sm:pl-6 sm:text-xl md:text-2xl">
            &ldquo;{EVENT.quote}&rdquo;
          </blockquote>

          {/* Signature */}
          <div className="rounded-sm bg-surface p-6 shadow-sm sm:p-8">
            <h3 className="mb-4 font-serif text-xl font-bold text-heading sm:mb-6 sm:text-2xl">
              Une Signature : Élégant & Moderne
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {["Professionnelle", "Inspirante", "Inclusive", "Haut niveau"].map(
                (value) => (
                  <div
                    key={value}
                    className="flex items-center gap-2 rounded-sm border border-border p-3 sm:gap-3 sm:p-4"
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full bg-purple" />
                    <span className="text-sm font-medium text-heading sm:text-base">{value}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Audience */}
          <div className="mt-10 grid gap-8 sm:mt-16 sm:gap-12 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center rounded-sm bg-navy p-8 text-center sm:p-12">
              <div className="flex items-center gap-2 text-white">
                <svg className="h-8 w-8 text-purple sm:h-12 sm:w-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="font-serif text-4xl font-bold uppercase tracking-tighter sm:text-6xl">Impact</span>
              </div>
              <p className="mt-3 text-base text-cream-dark/70 sm:mt-4 sm:text-lg">
                Une audience mixte et sélective
              </p>
              <ul className="mt-3 space-y-1 text-sm text-purple-light sm:mt-4">
                <li>+ On parle inclusion</li>
                <li>+ On parle performance</li>
                <li>+ On valorise les femmes sans exclure</li>
              </ul>
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="mb-3 font-serif text-xl font-bold text-heading sm:mb-4 sm:text-2xl">
                Pourquoi ce format impacte
              </h3>
              <ul className="space-y-3">
                {[
                  "Nous parlons business et performance.",
                  "Nous invitons hommes et femmes à la même table.",
                  "Le 8 mars est le contexte, pas le contenu.",
                  "DIGIZELLE affirme sa maturité.",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-body sm:text-base">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mascotte */}
          <div className="mt-10 flex justify-center sm:mt-16">
            <Image
              src="/images/mascotte/mascotte1.png"
              alt="Digizelle Mascotte"
              width={160}
              height={160}
              className="opacity-70"
            />
          </div>

          <div className="mt-8 text-center sm:mt-12">
            <Button href="/contact" variant="secondary" size="lg">
              Réserver ma place
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

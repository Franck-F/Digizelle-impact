import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { AccessPlan3D } from "@/components/ui/AccessPlan3D";
import { EVENT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Infos pratiques",
  description:
    "Retrouvez le plan d'accès, l'entrée principale d'Epitech Paris et les informations pratiques pour rejoindre le Digizelle Impact Event 2026.",
};

export default function ContactPage() {
  return (
    <section className="min-h-screen bg-cream pt-24 pb-16 sm:pt-32 sm:pb-24">
      <Container>
        <SectionTitle
          label="Infos pratiques"
          title="Préparez votre arrivée"
          description={`${EVENT.displayDate} — ${EVENT.location}. Retrouvez ici l'entrée principale, le plan d'accès et les infos utiles pour rejoindre l'événement sereinement.`}
        />

        <div className="mx-auto max-w-6xl">
          <div className="mt-8 rounded-sm border border-border bg-surface p-5 shadow-sm sm:mt-10 sm:p-8">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple">Plan d&apos;accès</p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-heading">Entrée principale d&apos;Epitech Paris</h2>
              <p className="mt-2 text-sm leading-relaxed text-body sm:text-base">
                Pour l&apos;événement, l&apos;accès se fait par l&apos;entrée principale située au <strong className="text-heading">24 Rue Pasteur, 94270 Le Kremlin-Bicêtre</strong>.
              </p>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.8fr)] xl:items-start">
              <AccessPlan3D />

              <div className="space-y-3 rounded-sm border border-border bg-cream p-4 sm:p-5">
                <div className="rounded-sm border border-border bg-surface p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple">Adresse</p>
                  <p className="mt-1 text-sm font-medium text-heading sm:text-base">{EVENT.locationFull}</p>
                </div>

                <div className="rounded-sm border border-border bg-surface p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple">Point d&apos;entrée</p>
                  <p className="mt-1 text-sm text-body sm:text-base">Entrée principale sur Rue Pasteur</p>
                </div>

                <div className="rounded-sm border border-border bg-surface p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple">Conseil</p>
                  <p className="mt-1 text-sm text-body sm:text-base">Ouvre l&apos;itinéraire GPS avant d&apos;arriver pour te placer directement au bon accès.</p>
                </div>

                <Button href={EVENT.mapsUrl} variant="secondary" size="lg" className="w-full">
                  Ouvrir dans Google Maps
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

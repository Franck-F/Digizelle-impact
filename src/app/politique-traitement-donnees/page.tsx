import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "Politique de traitement des données",
  description:
    "Politique de traitement des données personnelles du Digizelle Impact Event 2026.",
};

export default function PolitiqueTraitementDonneesPage() {
  return (
    <section className="min-h-screen bg-cream pt-24 pb-16 sm:pt-32 sm:pb-24">
      <Container>
        <SectionTitle
          label="Documents"
          title="Politique de traitement des données personnelles"
          description="Informations relatives à la collecte et au traitement de vos données personnelles"
        />

        <div className="mx-auto max-w-3xl rounded-sm border border-border bg-surface p-5 text-body shadow-sm sm:p-8">
          <div className="space-y-4 text-sm leading-relaxed sm:text-base">
            <p>
              Les données collectées via le formulaire d&apos;inscription (nom, prénom, e-mail, statut majeur/mineur, message libre éventuel) sont utilisées exclusivement pour :
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>La gestion des inscriptions à l&apos;événement ;</li>
              <li>L&apos;envoi d&apos;informations organisationnelles relatives à l&apos;événement ;</li>
              <li>La communication post-événement (supports, compte-rendu, remerciements).</li>
            </ul>
            <p>
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et d&apos;opposition de vos données, en adressant votre demande à : contact@digizelle.fr.
            </p>
            <p>
              Les données ne sont pas cédées à des tiers à des fins commerciales.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

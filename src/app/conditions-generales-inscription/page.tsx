import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "Conditions Générales d'Inscription",
  description:
    "Conditions Générales d'Inscription au Digizelle Impact Event 2026.",
};

export default function ConditionsGeneralesInscriptionPage() {
  return (
    <section className="min-h-screen bg-cream pt-24 pb-16 sm:pt-32 sm:pb-24">
      <Container>
        <SectionTitle
          label="Documents"
          title="Conditions Générales d'Inscription"
          description="DIGIZELLE IMPACT EVENT 2026 — Leadership & Innovation : construire l'avenir ensemble"
        />

        <div className="mx-auto max-w-3xl rounded-sm border border-border bg-surface p-5 text-body shadow-sm sm:p-8">
          <div className="space-y-6 text-sm leading-relaxed sm:text-base">
            <p>
              Ces conditions s&apos;appliquent à toute personne s&apos;inscrivant à l&apos;événement « DIGIZELLE IMPACT EVENT 2026 - Leadership & Innovation : construire l&apos;avenir ensemble », organisé par l&apos;association.
            </p>
            <p>
              En validant son inscription, le participant reconnaît avoir pris connaissance et accepter sans réserve les présentes CGI.
            </p>

            <section>
              <h3 className="font-semibold text-heading">Article 1 – Présentation de l&apos;évènement</h3>
              <p className="mt-2">
                L&apos;association DIGIZELLE organise une table ronde intitulée : « DIGIZELLE IMPACT EVENT 2026 - Leadership & Innovation : construire l&apos;avenir ensemble ».
              </p>
              <p className="mt-2">
                Date : Vendredi<br />
                Lieu : Campus EPITECH Paris, 24 Rue Pasteur, 94270 Le Kremlin-Bicêtre, France
              </p>
              <p className="mt-2">
                Cet événement est gratuit et ouvert au public sous réserve d&apos;inscription préalable obligatoire.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-heading">Article 2 – Modalités d&apos;inscription</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>L&apos;inscription s&apos;effectue exclusivement via le formulaire en ligne disponible sur le site de l&apos;événement.</li>
                <li>Chaque inscription vaut pour une personne. Toute représentation ou inscription pour le compte d&apos;un tiers doit être mentionnée explicitement.</li>
                <li>L&apos;inscription est confirmée par l&apos;envoi d&apos;un e-mail de confirmation à l&apos;adresse indiquée lors de l&apos;inscription.</li>
              </ul>
              <p className="mt-2">
                Nombre de places limité à 70 personnes. Les inscriptions seront clôturées une fois ce seuil atteint.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-heading">Article 3 – Participants mineurs</h3>
              <p className="mt-2">
                Si le participant est mineur (moins de 18 ans), l&apos;inscription doit être réalisée par son représentant légal (parent ou tuteur), qui confirme avoir pris connaissance et accepté l&apos;ensemble des présentes CGI en son nom et au nom du mineur.
              </p>
              <p className="mt-2">
                Le représentant légal s&apos;engage à accompagner le mineur lors de l&apos;événement ou à désigner expressément un adulte responsable pour la durée de l&apos;événement.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-heading">Article 4 – Droit à l&apos;image</h3>
              <p className="mt-2">
                L&apos;événement fera l&apos;objet d&apos;une captation photographique et vidéographique à des fins de communication de l&apos;association (site internet, réseaux sociaux, rapport d&apos;activité, presse).
              </p>
              <h4 className="mt-3 font-medium text-heading">1. Participants adultes</h4>
              <p className="mt-1">
                En s&apos;inscrivant, le participant adulte consent expressément à ce que son image puisse être captée et utilisée dans le cadre décrit ci-dessus, sans contrepartie financière et pour une durée de 5 ans à compter de l&apos;événement.
              </p>
              <p className="mt-2">
                Ce consentement peut être retiré à tout moment par demande écrite adressée à l&apos;association. Le retrait du consentement ne remet pas en cause les utilisations antérieures.
              </p>
              <h4 className="mt-3 font-medium text-heading">2. Participants mineurs</h4>
              <p className="mt-1">
                Pour les participants mineurs, le consentement au droit à l&apos;image doit être accordé explicitement par le représentant légal lors de l&apos;inscription, via le champ de saisie libre « Message ».
              </p>
              <p className="mt-2">
                En l&apos;absence de consentement pour un mineur, l&apos;association s&apos;engage à prendre toutes les précautions nécessaires pour que le mineur ne soit pas identifiable sur les photos et vidéos diffusées.
              </p>
              <h4 className="mt-3 font-medium text-heading">3. Intervenants et speakers</h4>
              <p className="mt-1">
                Les intervenants font l&apos;objet d&apos;un accord spécifique relatif à leur droit à l&apos;image, formalisé dans leur convention de participation.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-heading">Article 5 – Collecte et traitement des données personnelles</h3>
              <p className="mt-2">
                Les données collectées lors de l&apos;inscription (nom, prénom, adresse courriel, et le cas échéant, représentant légal pour les mineurs) sont traitées conformément à la politique de confidentialité et aux mentions légales du site.
              </p>
              <p className="mt-2">Ces données sont utilisées exclusivement pour :</p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>La gestion et la confirmation des inscriptions ;</li>
                <li>La communication d&apos;informations relatives à l&apos;événement ;</li>
                <li>L&apos;envoi éventuel d&apos;un compte-rendu ou des supports présentés lors de l&apos;événement ;</li>
                <li>Aucune donnée ne sera cédée à des tiers à des fins commerciales.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-heading">Article 6 – Annulation et modifications</h3>
              <p className="mt-2">
                L&apos;association se réserve le droit d&apos;annuler ou de reporter l&apos;événement pour des raisons indépendantes de sa volonté (force majeure, décision administrative, etc.). Les inscrits en seront informés dans les meilleurs délais.
              </p>
              <p className="mt-2">
                En cas d&apos;annulation par l&apos;association, l&apos;événement étant gratuit, aucun remboursement n&apos;est dû.
              </p>
              <p className="mt-2">
                Annulation d&apos;inscription par le participant : merci de nous en informer dès que possible à l&apos;adresse contact@digizelle.fr afin de libérer la place pour d&apos;autres participants.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-heading">Article 7 – Responsabilités du participant</h3>
              <p className="mt-2">
                Le participant est responsable de son comportement lors de l&apos;événement et s&apos;engage à respecter la charte de bonne conduite disponible sur le site de l&apos;évènement : https://impact.digizelle.fr/
              </p>
              <p className="mt-2">
                L&apos;association décline toute responsabilité en cas de perte, vol ou dommage survenant lors de l&apos;événement.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-heading">Article 8 – Droit applicable et litiges</h3>
              <p className="mt-2">
                Les présentes CGI sont régies par le droit français. En cas de litige, les parties s&apos;engagent à rechercher une solution amiable avant tout recours judiciaire.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </section>
  );
}

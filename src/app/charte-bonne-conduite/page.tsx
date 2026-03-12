import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "Charte de bonne conduite",
  description:
    "Charte de bonne conduite du Digizelle Impact Event 2026.",
};

export default function CharteBonneConduitePage() {
  return (
    <section className="min-h-screen bg-cream pt-24 pb-16 sm:pt-32 sm:pb-24">
      <Container>
        <SectionTitle
          label="Documents"
          title="Charte de bonne conduite"
          description="DIGIZELLE IMPACT EVENT 2026 — Leadership & Innovation : construire l'avenir ensemble"
        />

        <div className="mx-auto max-w-3xl rounded-sm border border-border bg-surface p-5 text-body shadow-sm sm:p-8">
          <div className="space-y-6 text-sm leading-relaxed sm:text-base">
            <p>
              Cette charte s&apos;applique à l&apos;ensemble des participants, intervenants et membres de l&apos;organisation présents lors de l&apos;événement.
            </p>
            <p>
              L&apos;acceptation de cette charte est une condition d&apos;accès à l&apos;événement.
            </p>

            <section>
              <h3 className="font-semibold text-heading">1 - Respect mutuel et bienveillance</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>Toute forme de discrimination (liée au genre, à l&apos;origine, à la religion, à l&apos;orientation sexuelle, au handicap, ou à tout autre critère) est strictement interdite.</li>
                <li>Le harcèlement sous toutes ses formes, verbal ou non verbal, physique ou psychologique, est prohibé.</li>
                <li>Le langage irrespectueux, insultant ou agressif ne sera pas toléré.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-heading">2 - Respect du cadre et des intervenants</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>Les participants s&apos;engagent à respecter le programme de l&apos;événement et à ne pas perturber les prises de parole.</li>
                <li>Les questions et interventions du public se feront dans les créneaux prévus à cet effet.</li>
                <li>L&apos;utilisation des téléphones portables (sonneries, conversations téléphoniques) doit être limitée au maximum pendant les interventions.</li>
                <li>Les participants respectent les locaux de l&apos;établissement d&apos;accueil et laissent les espaces dans leur état initial.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-heading">3 - Enregistrement et captation privée</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>La captation officielle de l&apos;événement (photos, vidéos) est assurée par l&apos;association ou ses prestataires désignés.</li>
                <li>Toute captation personnelle (photos ou vidéos) par les participants est soumise au respect du droit à l&apos;image des intervenants et des autres participants.</li>
                <li>La diffusion de photos ou vidéos incluant des personnes identifiables est soumise à leur accord préalable.</li>
                <li>La diffusion de photos ou vidéos de mineurs identifiables est strictement interdite sans l&apos;accord écrit de leur représentant légal.</li>
                <li>Les participants s&apos;interdisent de diffuser des enregistrements audio ou vidéo des interventions sans accord préalable écrit de l&apos;association.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-heading">4 - Confidentialité des échanges</h3>
              <p className="mt-2">
                Dans le cadre de cet événement dédié au développement des compétences, les échanges peuvent porter sur des sujets professionnels ou personnels sensibles.
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>Les participants s&apos;engagent à ne pas divulguer les informations personnelles ou professionnelles partagées par d&apos;autres participants sans leur consentement explicite.</li>
                <li>La règle de la chambre de Chatham House peut être appliquée à la demande des intervenants : les informations partagées peuvent être utilisées, mais ni l&apos;identité ni l&apos;appartenance des contributeurs ne doivent être révélées.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-heading">5 - Sécurité et consignes</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>Les participants s&apos;engagent à respecter les consignes de sécurité de l&apos;établissement accueillant (signalétique d&apos;urgence, issues de secours).</li>
                <li>Toute situation dangereuse ou comportement inapproprié doit être immédiatement signalé à un membre de l&apos;organisation.</li>
                <li>L&apos;introduction de substances illicites, d&apos;alcool ou de tout objet dangereux sur le site est formellement interdite.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-heading">6 - Sanctions</h3>
              <p className="mt-2">
                Tout manquement à la présente charte pourra entraîner l&apos;exclusion immédiate du participant de l&apos;événement, sans recours possible. En cas de comportement grave, l&apos;association se réserve le droit d&apos;engager les poursuites appropriées.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-heading">7 - Engagement</h3>
              <p className="mt-2">
                En validant mon inscription, le participant reconnaît avoir lu et accepté sans réserve la présente charte de bonne conduite, ainsi que les conditions générales d&apos;inscription.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </section>
  );
}

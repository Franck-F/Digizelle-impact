import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "Mentions légales | Digizelle Impact Event",
  description: "Mentions légales du site Digizelle Impact Event.",
};

export default function MentionsLegalesPage() {
  return (
    <section className="min-h-screen bg-cream pt-24 pb-16 sm:pt-32 sm:pb-24">
      <Container>
        <SectionTitle
          label="Documents"
          title="Mentions légales"
          description="DIGIZELLE IMPACT EVENT 2026 — Leadership & Innovation : construire l'avenir ensemble"
        />

        <div className="mx-auto max-w-3xl rounded-sm border border-border bg-surface p-5 text-body shadow-sm sm:p-8">
          <div className="space-y-6 text-sm leading-relaxed sm:text-base">
            <section>
              <h3 className="font-semibold text-heading">Article 1 – Éditeur du site</h3>
              <p className="mt-2">
                Le présent site est édité par :
                <br />
                DIGIZELLE
                <br />
                Forme juridique : Association loi 1901
                <br />
                Siège social : 24 Rue Pasteur, 94270 Le Kremlin-Bicêtre, France
                <br />
                E-mail : contact@digizelle.fr
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-heading">Article 2 – Hébergement</h3>
              <p className="mt-2">
                Le site est hébergé par :
                <br />
                Vercel Inc.
                <br />
                440 N Barranca Ave #4133 Covina, CA 91723, États-Unis
                <br />
                Site web : https://vercel.com
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-heading">Article 3 – Propriété intellectuelle</h3>
              <p className="mt-2">
                L&apos;ensemble des contenus présents sur ce site (textes, images, logos, vidéos, documents, éléments graphiques) est la propriété exclusive de DIGIZELLE, sauf mention contraire.
              </p>
              <p className="mt-2">
                Toute reproduction, diffusion, modification ou exploitation, totale ou partielle, sans autorisation écrite préalable est strictement interdite et constitue une contrefaçon au sens du Code de la propriété intellectuelle.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-heading">Article 4 – Données personnelles</h3>
              <p className="mt-2">
                Les données collectées via le formulaire d&apos;inscription (nom, prénom, e-mail, statut majeur/mineur, message libre éventuel) sont utilisées exclusivement pour :
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>La gestion des inscriptions à l&apos;événement ;</li>
                <li>L&apos;envoi d&apos;informations organisationnelles relatives à l&apos;événement ;</li>
                <li>La communication post-événement (supports, compte-rendu, remerciements).</li>
              </ul>
              <p className="mt-2">Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et d&apos;opposition de vos données, en adressant votre demande à : contact@digizelle.fr.</p>
              <p className="mt-2">Les données ne sont pas cédées à des tiers à des fins commerciales.</p>
            </section>

            <section>
              <h3 className="font-semibold text-heading">Article 5 – Cookies</h3>
              <p className="mt-2">
                Le site peut utiliser des cookies techniques nécessaires à son bon fonctionnement.
              </p>
              <p className="mt-2">
                Aucun cookie publicitaire n&apos;est déposé sans votre consentement explicite.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-heading">Article 6 – Responsabilité</h3>
              <p className="mt-2">
                DIGIZELLE met tout en œuvre pour assurer la fiabilité des informations diffusées sur ce site. Toutefois, l&apos;association ne saurait être tenue responsable des erreurs, omissions ou interruptions de service.
              </p>
              <p className="mt-2">
                L&apos;utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-heading">Article 7 – Droit applicable</h3>
              <p className="mt-2">
                Le présent site et ses mentions légales sont soumis au droit français.
              </p>
              <p className="mt-2">
                En cas de litige, les tribunaux compétents seront ceux du ressort du siège social de l&apos;association, sauf disposition légale contraire.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </section>
  );
}

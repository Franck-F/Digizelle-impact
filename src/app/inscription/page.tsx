"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { CelebrationAnimation } from "@/components/animations/CelebrationAnimation";
import { EVENT } from "@/lib/constants";
import { clsx } from "clsx";

type ProfileType = "etudiant" | "entreprise";

interface FormState {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
  errors: string[];
}

export default function InscriptionPage() {
  const [profileType, setProfileType] = useState<ProfileType>("entreprise");
  const [form, setForm] = useState<FormState>({
    status: "idle",
    message: "",
    errors: [],
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setForm((prev) => ({ ...prev, status: "submitting", errors: [] }));

    const formData = new FormData(e.currentTarget);
    const payload = {
      type: profileType,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      company: profileType === "entreprise" ? (formData.get("company") as string) : "",
      school: profileType === "etudiant" ? (formData.get("school") as string) : "",
      role: profileType === "entreprise" ? (formData.get("role") as string) : "",
      message: formData.get("message") as string,
      acceptedTermsAndCharter: formData.get("acceptedTermsAndCharter") === "on",
      acceptedPrivacyPolicy: formData.get("acceptedPrivacyPolicy") === "on",
      acceptedImageRights: formData.get("acceptedImageRights") === "on",
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setForm({
          status: "success",
          message: data.message,
          errors: [],
        });
      } else {
        setForm((prev) => ({
          ...prev,
          status: "error",
          errors: data.errors || ["Une erreur est survenue."],
        }));
      }
    } catch {
      setForm((prev) => ({
        ...prev,
        status: "error",
        errors: ["Impossible de contacter le serveur. Vérifiez votre connexion."],
      }));
    }
  }

  const inputClasses =
    "w-full rounded-sm border border-border bg-cream px-3 py-2.5 text-sm text-heading outline-none transition-colors placeholder:text-body/50 focus:border-purple sm:px-4 sm:py-3 sm:text-base";

  return (
    <section className="min-h-screen bg-cream pt-24 pb-16 sm:pt-32 sm:pb-24">
      <Container>
        <SectionTitle
          label="Inscription"
          title="Réservez votre place"
          description={`${EVENT.displayDate} — ${EVENT.location}. Places limitées, une confirmation vous sera envoyée par email.`}
        />

        <div className="mx-auto max-w-2xl">
          {form.status === "success" ? (
            <CelebrationAnimation show message={form.message} />
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-sm bg-surface p-5 shadow-sm sm:space-y-6 sm:p-8 md:p-12"
            >
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setProfileType("etudiant")}
                  className={clsx(
                    "flex-1 rounded-sm border-2 px-4 py-2.5 text-sm font-medium transition-all sm:text-base",
                    profileType === "etudiant"
                      ? "border-purple bg-purple text-white"
                      : "border-border text-heading hover:border-purple/50"
                  )}
                >
                  Étudiant(e)
                </button>
                <button
                  type="button"
                  onClick={() => setProfileType("entreprise")}
                  className={clsx(
                    "flex-1 rounded-sm border-2 px-4 py-2.5 text-sm font-medium transition-all sm:text-base",
                    profileType === "entreprise"
                      ? "border-purple bg-purple text-white"
                      : "border-border text-heading hover:border-purple/50"
                  )}
                >
                  Salarié(e)
                </button>
              </div>

              {form.errors.length > 0 && (
                <div className="rounded-sm border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                  <ul className="space-y-1">
                    {form.errors.map((err, i) => (
                      <li key={i} className="text-sm text-red-700 dark:text-red-400">
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div>
                  <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-heading sm:mb-2">
                    Prénom *
                  </label>
                  <input type="text" id="firstName" name="firstName" required minLength={2} placeholder="Votre prénom" className={inputClasses} />
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-heading sm:mb-2">
                    Nom *
                  </label>
                  <input type="text" id="lastName" name="lastName" required minLength={2} placeholder="Votre nom" className={inputClasses} />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-heading sm:mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder={profileType === "etudiant" ? "prenom@ecole.fr" : "prenom@entreprise.com"}
                  className={inputClasses}
                />
              </div>

              {profileType === "etudiant" && (
                <div>
                  <label htmlFor="school" className="mb-1.5 block text-sm font-medium text-heading sm:mb-2">
                    École / Université *
                  </label>
                  <input type="text" id="school" name="school" required placeholder="Nom de votre établissement" className={inputClasses} />
                </div>
              )}

              {profileType === "entreprise" && (
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  <div>
                    <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-heading sm:mb-2">
                      Entreprise
                    </label>
                    <input type="text" id="company" name="company" placeholder="Nom de l'entreprise" className={inputClasses} />
                  </div>
                  <div>
                    <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-heading sm:mb-2">
                      Fonction
                    </label>
                    <input type="text" id="role" name="role" placeholder="Votre poste" className={inputClasses} />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-heading sm:mb-2">
                  Message (optionnel)
                </label>
                <textarea id="message" name="message" rows={3} placeholder="Une question ? Un message ?" className={inputClasses} />
              </div>

              <div className="space-y-3 rounded-sm border border-border bg-cream p-4 sm:p-5">
                <label className="flex items-start gap-2 text-sm text-heading sm:text-base">
                  <input
                    type="checkbox"
                    name="acceptedTermsAndCharter"
                    required
                    className="mt-1 h-4 w-4 rounded border-border text-purple focus:ring-purple"
                  />
                  <span>
                    J&apos;ai lu et j&apos;accepte les{" "}
                    <a href="/conditions-generales-inscription" target="_blank" rel="noopener noreferrer" className="font-semibold text-purple underline underline-offset-2">
                      Conditions Générales d&apos;Inscription
                    </a>{" "}
                    ainsi que la{" "}
                    <a href="/charte-bonne-conduite" target="_blank" rel="noopener noreferrer" className="font-semibold text-purple underline underline-offset-2">
                      Charte de bonne conduite
                    </a>
                    .
                  </span>
                </label>

                <label className="flex items-start gap-2 text-sm text-heading sm:text-base">
                  <input
                    type="checkbox"
                    name="acceptedPrivacyPolicy"
                    required
                    className="mt-1 h-4 w-4 rounded border-border text-purple focus:ring-purple"
                  />
                  <span>
                    J&apos;ai pris connaissance de la{" "}
                    <a href="/politique-traitement-donnees" target="_blank" rel="noopener noreferrer" className="font-semibold text-purple underline underline-offset-2">
                      politique de traitement des données personnelles
                    </a>{" "}
                    et consens au traitement de mes données dans le cadre de l&apos;organisation de l&apos;événement.
                  </span>
                </label>

                <label className="flex items-start gap-2 text-sm text-heading sm:text-base">
                  <input
                    type="checkbox"
                    name="acceptedImageRights"
                    required
                    className="mt-1 h-4 w-4 rounded border-border text-purple focus:ring-purple"
                  />
                  <span>
                    J&apos;accepte que mon image (photos et vidéos prises lors de l&apos;événement) soit utilisée par l&apos;association à des fins de communication non commerciale.
                  </span>
                </label>
              </div>

              <Button type="submit" variant="secondary" size="lg" className="w-full" disabled={form.status === "submitting"}>
                {form.status === "submitting" ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Envoi en cours...
                  </span>
                ) : (
                  "Confirmer mon inscription"
                )}
              </Button>

              <p className="text-center text-xs text-body">{EVENT.motto}</p>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}

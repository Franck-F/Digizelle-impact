"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { CelebrationAnimation } from "@/components/animations/CelebrationAnimation";
import { EVENT } from "@/lib/constants";

interface FormState {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
  errors: string[];
  spotsLeft: number | null;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    status: "idle",
    message: "",
    errors: [],
    spotsLeft: null,
  });

  // Fetch remaining spots on mount
  useEffect(() => {
    fetch("/api/register")
      .then((r) => r.json())
      .then((data) => setForm((prev) => ({ ...prev, spotsLeft: data.spotsLeft })))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setForm((prev) => ({ ...prev, status: "submitting", errors: [] }));

    const formData = new FormData(e.currentTarget);
    const payload = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      role: formData.get("role") as string,
      message: formData.get("message") as string,
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
          spotsLeft: data.spotsLeft,
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
    "w-full rounded-sm border border-border bg-cream px-3 py-2.5 text-sm text-heading outline-none transition-colors placeholder:text-body/50 focus:border-gold sm:px-4 sm:py-3 sm:text-base";

  return (
    <section className="min-h-screen bg-cream pt-24 pb-16 sm:pt-32 sm:pb-24">
      <Container>
        <SectionTitle
          label="Contact & Inscription"
          title="Réservez votre place"
          description={`${EVENT.displayDate} — ${EVENT.location}. Places limitées à 50 participants.`}
        />

        {/* Spots counter */}
        {form.spotsLeft !== null && form.status !== "success" && (
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
              <span className="text-sm font-medium text-heading">
                {form.spotsLeft > 0
                  ? `${form.spotsLeft} place${form.spotsLeft > 1 ? "s" : ""} restante${form.spotsLeft > 1 ? "s" : ""}`
                  : "Complet — liste d'attente"}
              </span>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-2xl">
          {form.status === "success" ? (
            <CelebrationAnimation
              show
              message={form.message}
              spotsLeft={form.spotsLeft}
            />
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-sm bg-surface p-5 shadow-sm sm:space-y-6 sm:p-8 md:p-12"
            >
              {/* Error display */}
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
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    minLength={2}
                    placeholder="Votre prénom"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-heading sm:mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    minLength={2}
                    placeholder="Votre nom"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-heading sm:mb-2">
                  Email professionnel *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="prenom@entreprise.com"
                  className={inputClasses}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div>
                  <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-heading sm:mb-2">
                    Entreprise
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    placeholder="Nom de l'entreprise"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-heading sm:mb-2">
                    Fonction
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    placeholder="Votre poste"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-heading sm:mb-2">
                  Message (optionnel)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder="Une question ? Un message ?"
                  className={inputClasses}
                />
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full"
                disabled={form.status === "submitting"}
              >
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

              <p className="text-center text-xs text-body">
                {EVENT.motto}
              </p>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}

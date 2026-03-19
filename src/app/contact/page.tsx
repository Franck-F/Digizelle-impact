"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { CelebrationAnimation } from "@/components/animations/CelebrationAnimation";

interface FormState {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
  errors: string[];
}

export default function ContactPage() {
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
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setForm({ status: "success", message: data.message, errors: [] });
      } else {
        setForm({ status: "error", message: data.message, errors: data.errors || [] });
      }
    } catch (error) {
      setForm({ status: "error", message: "Erreur lors de l'envoi.", errors: [] });
    }
  }

  return (
    <Container className="py-16 relative overflow-hidden">
      {/* Mascotte haut gauche */}
      <div className="absolute top-2 left-2 sm:top-8 sm:left-8 md:top-16 md:left-16 z-20 select-none pointer-events-none">
        <img src="/images/mascotte/mascotte2.png" alt="Mascotte Digizelle" width={40} height={40} className="opacity-70 hover:opacity-100 transition sm:w-[70px] sm:h-[70px] md:w-[90px] md:h-[90px] object-contain" style={{maxWidth:'90px',maxHeight:'90px'}} />
      </div>
      {/* Mascotte bas droite */}
      <div className="absolute bottom-2 right-2 sm:bottom-8 sm:right-8 md:bottom-16 md:right-16 z-20 select-none pointer-events-none">
        <img src="/images/mascotte/mascotte4.png" alt="Mascotte Digizelle" width={50} height={50} className="opacity-80 hover:opacity-100 transition sm:w-[90px] sm:h-[90px] md:w-[120px] md:h-[120px] object-contain" style={{maxWidth:'120px',maxHeight:'120px'}} />
      </div>
      {/* Animation d'envoi */}
      <CelebrationAnimation show={form.status === "submitting"} message="Envoi en cours..." />
      <SectionTitle label="Contact" title="Contactez-nous" description="Une question ? Un besoin ? Écrivez-nous !" />
      <div className="mx-auto max-w-2xl">
        {form.status === "success" ? (
          <CelebrationAnimation show message={form.message || "Message envoyé !"} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-cream dark:bg-navy/90 p-8 shadow-xl sm:space-y-8 sm:p-10 md:p-14">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-2 block text-base font-semibold text-heading dark:text-white">Prénom *</label>
                <input type="text" id="firstName" name="firstName" required minLength={2} placeholder="Votre prénom" className="w-full rounded-xl border border-purple/30 bg-white dark:bg-navy/80 text-heading dark:text-white placeholder:text-body/60 dark:placeholder:text-white focus:border-purple focus:ring-2 focus:ring-purple/30 outline-none transition text-base shadow-md py-3 px-4" />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-2 block text-base font-semibold text-heading dark:text-white">Nom *</label>
                <input type="text" id="lastName" name="lastName" required minLength={2} placeholder="Votre nom" className="w-full rounded-xl border border-purple/30 bg-white dark:bg-navy/80 text-heading dark:text-white placeholder:text-body/60 dark:placeholder:text-white focus:border-purple focus:ring-2 focus:ring-purple/30 outline-none transition text-base shadow-md py-3 px-4" />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-base font-semibold text-heading dark:text-white">Email *</label>
              <input type="email" id="email" name="email" required placeholder="prenom@exemple.com" className="w-full rounded-xl border border-purple/30 bg-white dark:bg-navy/80 text-heading dark:text-white placeholder:text-body/60 dark:placeholder:text-white focus:border-purple focus:ring-2 focus:ring-purple/30 outline-none transition text-base shadow-md py-3 px-4" />
            </div>
            <div>
              <label htmlFor="subject" className="mb-2 block text-base font-semibold text-heading dark:text-white">Sujet *</label>
              <input type="text" id="subject" name="subject" required minLength={2} placeholder="Sujet du message" className="w-full rounded-xl border border-purple/30 bg-white dark:bg-navy/80 text-heading dark:text-white placeholder:text-body/60 dark:placeholder:text-white focus:border-purple focus:ring-2 focus:ring-purple/30 outline-none transition text-base shadow-md py-3 px-4" />
            </div>
            <div>
              <label htmlFor="message" className="mb-2 block text-base font-semibold text-heading dark:text-white">Message</label>
              <textarea id="message" name="message" rows={4} placeholder="Votre message..." className="w-full rounded-xl border border-purple/30 bg-white dark:bg-navy/80 text-heading dark:text-white placeholder:text-body/60 dark:placeholder:text-white focus:border-purple focus:ring-2 focus:ring-purple/30 outline-none transition text-base shadow-md py-3 px-4 resize-none" required />
            </div>
            <Button type="submit" variant="secondary" size="lg" className="w-full bg-purple text-white rounded-lg text-lg font-semibold shadow-md hover:bg-purple/80 transition" disabled={form.status === "submitting"}>
              {form.status === "submitting" ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Envoi en cours...
                </span>
              ) : (
                "Envoyer le message"
              )}
            </Button>
            {form.status === "error" && (
              <p className="text-red-400 text-center mt-4">{form.message}</p>
            )}
          </form>
        )}
      </div>
    </Container>
  );
}

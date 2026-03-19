"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function SondagePage() {
  const [nom, setNom] = useState("");
  const [note, setNote] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!note) {
      setError("Merci de donner une note !");
      return;
    }
    const res = await fetch("/api/sondage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, note, commentaire }),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      setError("Erreur lors de l'envoi, réessayez.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-cream to-purple-50 dark:from-purple-900 dark:via-purple-800 dark:to-gray-900 transition-colors py-16">
        <div className="flex flex-col items-center gap-6 p-10 rounded-3xl shadow-2xl bg-white/90 dark:bg-gray-900/90 border border-purple-200 dark:border-purple-700 max-w-xl w-full">
          <Image src="/images/mascotte/mascotte2.png" alt="Mascotte Digizelle" width={120} height={120} className="mb-2" />
          <h1 className="text-3xl font-bold font-playfair text-purple dark:text-purple-200 text-center mb-2">Merci pour votre retour !</h1>
          <p className="text-lg text-center text-purple-900 dark:text-purple-100">Votre avis a bien été enregistré.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col justify-center bg-gradient-to-br from-purple-100 via-cream to-purple-50 dark:from-purple-900 dark:via-purple-800 dark:to-gray-900 transition-colors py-16">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-12">
        {/* Mascotte / illustration */}
        <div className="flex-1 flex flex-col items-center md:items-end">
          <Image src="/images/mascotte/mascotte3.png" alt="Mascotte Digizelle" width={220} height={220} className="mb-4 drop-shadow-xl" />
        </div>
        {/* Formulaire */}
        <div className="flex-1 max-w-lg w-full p-8 rounded-3xl shadow-2xl bg-white/95 dark:bg-gray-900/90 border border-purple-200 dark:border-purple-700">
          <h1 className="text-3xl font-bold font-playfair text-purple dark:text-purple-200 mb-6 text-center md:text-left">Votre avis compte pour l'avenir de Digizelle</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium text-purple-900 dark:text-purple-100">Nom (optionnel)</label>
              <input
                type="text"
                className="w-full border rounded-xl px-4 py-3 text-lg bg-cream dark:bg-gray-800 text-purple dark:text-purple-200"
                value={nom}
                onChange={e => setNom(e.target.value)}
                placeholder="Votre nom (optionnel)"
                title="Nom (optionnel)"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-purple-900 dark:text-purple-100">Note globale *</label>
              <select
                className="w-full border rounded-xl px-4 py-3 text-lg bg-cream dark:bg-gray-800 text-purple dark:text-purple-200"
                value={note}
                onChange={e => setNote(e.target.value)}
                required
                title="Note globale"
              >
                <option value="">Choisir une note</option>
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Très bien</option>
                <option value="3">3 - Moyen</option>
                <option value="2">2 - Décevant</option>
                <option value="1">1 - Nul</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-purple-900 dark:text-purple-100">Commentaire</label>
              <textarea
                className="w-full border rounded-xl px-4 py-3 text-lg bg-cream dark:bg-gray-800 text-purple dark:text-purple-200"
                value={commentaire}
                onChange={e => setCommentaire(e.target.value)}
                rows={4}
                placeholder="Votre commentaire..."
                title="Commentaire"
              />
            </div>
            {error && <div className="text-red-600">{error}</div>}
            <button
              type="submit"
              className="w-full bg-purple text-white px-8 py-4 rounded-xl font-semibold text-lg mt-4 hover:bg-purple-dark transition shadow-lg"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}



"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// Mapping for survey questions
const questionLabels = [
  "Comment évaluez-vous l'événement ?",
  "Qu'avez-vous préféré ?",
  "Un mot pour décrire ?",
  "Avez-vous appris quelque chose ?",
  "Recommanderiez-vous ?",
  "Suggestion ou commentaire",
  "Autre remarque"
];

function DashboardPage() {
  // Import chart component
  let SurveyCharts: any;
  try {
    SurveyCharts = require("@/components/dashboard/SurveyCharts").default;
  } catch {}
  // KPI calculations
  const [responses, setResponses] = useState<any[]>([]);
  const totalResponses = responses.length;
  const today = new Date().toISOString().slice(0, 10);
  const responsesToday = responses.filter(r => r.submitted_at?.slice(0, 10) === today).length;
  const hours = responses.map(r => r.submitted_at?.slice(11, 13)).filter(Boolean);
  const avgPerHour = hours.length > 0 ? (totalResponses / new Set(hours).size).toFixed(2) : "0";

  const [activeTab, setActiveTab] = useState<'survey' | 'contact'>('survey');
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const mobileMenuButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Auto-refresh contact messages
  useEffect(() => {
    async function fetchContactMessages() {
      const res = await fetch('/api/contact');
      const data = await res.json();
      setContactMessages(data.messages || []);
    }
    fetchContactMessages();
    if (autoRefresh) {
      const interval = setInterval(fetchContactMessages, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Auto-refresh responses
  useEffect(() => {
    async function fetchResponses() {
      setLoading(true);
      const res = await fetch("/api/survey");
      const data = await res.json();
      setResponses(data.responses || []);
      setLoading(false);
    }
    fetchResponses();
    if (autoRefresh) {
      const interval = setInterval(fetchResponses, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Filtrage
  const filtered = responses.filter(r => {
    if (filterDate && !r.submitted_at.startsWith(filterDate)) return false;
    if (search) {
      // Filter by question key or value
      const answers = r.answers || {};
      if (search === "") return true;
      // If search matches a question key, only show responses with that question
      return Object.keys(answers).some(k => {
        const idx = parseInt(k);
        const label = questionLabels[idx] || k;
        return label === search || (answers[k] && answers[k].toLowerCase().includes(search.toLowerCase()));
      });
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-cream text-heading">
      <header className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div>
          <Link
            href="/admin/dashboard"
            className="hidden rounded-lg border border-border px-3 py-1.5 text-xs text-body transition-all hover:border-purple/30 hover:text-purple sm:inline-flex"
          >
            Dashboard
          </Link>
          <button
            ref={mobileMenuButtonRef}
            onClick={() => setMobileMenuOpen((v: boolean) => !v)}
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            title={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            className="rounded-lg border border-border bg-surface p-2 text-body transition-all hover:border-purple/30 hover:text-purple sm:hidden"
          >
            {mobileMenuOpen ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("admin-token");
              // Optionally redirect or update state
            }}
            aria-label="Se déconnecter"
            title="Se déconnecter"
            className="hidden rounded-lg border border-border px-3 py-1.5 text-xs text-body transition-all hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400 sm:inline-flex"
          >
            <svg className="h-4 w-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>
      {mobileMenuOpen && (
        <div className="mx-auto max-w-7xl px-4 pb-3 sm:hidden">
          <div ref={mobileMenuRef} className="space-y-2 rounded-lg border border-border bg-surface p-3">
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg border border-border px-3 py-2 text-xs text-body transition-all hover:border-purple/30 hover:text-purple"
            >
              Dashboard
            </Link>
            <button
              onClick={() => {
                sessionStorage.removeItem("admin-token");
                setMobileMenuOpen(false);
              }}
              className="w-full rounded-lg border border-border px-3 py-2 text-left text-xs text-body transition-all hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400"
            >
              Déconnexion
            </button>
          </div>
        </div>
      )}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${activeTab === 'survey' ? 'bg-purple text-cream border-purple' : 'bg-surface border-border text-heading'}`}
            onClick={() => setActiveTab('survey')}
          >
            Sondages
          </button>
          <button
            className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${activeTab === 'contact' ? 'bg-purple text-cream border-purple' : 'bg-surface border-border text-heading'}`}
            onClick={() => setActiveTab('contact')}
          >
            Messages contact
          </button>
        </div>
        {activeTab === 'survey' ? (
          <>
            {/* KPIs row */}
            <div className="mb-6 flex flex-wrap gap-4">
              <div className="flex flex-col items-center justify-center rounded-xl border border-purple/20 bg-purple/10 p-4 min-w-[120px]">
                <span className="text-xs text-purple font-semibold">Total réponses</span>
                <span className="text-2xl font-bold text-purple mt-1">{totalResponses}</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-green-400/20 bg-green-400/10 p-4 min-w-[120px]">
                <span className="text-xs text-green-400 font-semibold">Aujourd'hui</span>
                <span className="text-2xl font-bold text-green-400 mt-1">{responsesToday}</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/10 p-4 min-w-[120px]">
                <span className="text-xs text-blue-400 font-semibold">Moyenne/heure</span>
                <span className="text-2xl font-bold text-blue-400 mt-1">{avgPerHour}</span>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-heading mb-6">Tableau de bord admin</h2>
            <div className="w-full max-w-4xl mb-6 flex flex-col sm:flex-row gap-4">
              {/* Custom date selector */}
              <select
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="rounded-lg border border-purple/30 px-3 py-2 text-base shadow-sm bg-surface text-heading"
                title="Filtrer par date"
              >
                <option value="">Toutes les dates</option>
                {/* Génère les dates uniques */}
                {Array.from(new Set(responses.map(r => r.submitted_at?.slice(0, 10)))).map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
              {/* Filtre par question */}
              <select
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="rounded-lg border border-purple/30 px-3 py-2 text-base shadow-sm bg-surface text-heading"
                title="Filtrer par question"
              >
                <option value="">Toutes les questions</option>
                {questionLabels.map((label, idx) => (
                  <option key={idx} value={label}>{label}</option>
                ))}
              </select>
            </div>
            <div className="w-full bg-white dark:bg-navy/80 rounded-xl shadow-md p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 overflow-x-auto mx-auto" style={{marginLeft: '2vw', marginRight: '2vw'}}>
              {loading ? (
                <div className="text-center text-purple w-full">Chargement...</div>
              ) : filtered.length === 0 ? (
                <div className="text-center text-body w-full">Aucune réponse trouvée.</div>
              ) : (
                <table className="min-w-max w-full text-xs sm:text-sm flex-1">
                  <thead>
                    <tr className="bg-purple/10">
                      <th className="p-1 sm:p-2 text-left whitespace-nowrap">Date</th>
                      {questionLabels.map((label, idx) => (
                        <th key={idx} className="p-1 sm:p-2 text-left whitespace-nowrap">{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(r => (
                      <tr key={r.id} className="border-b border-purple/10">
                        <td className="p-1 sm:p-2 whitespace-nowrap">{r.submitted_at?.slice(0, 16).replace("T", " ")}</td>
                        {questionLabels.map((label, idx) => (
                          <td key={idx} className="p-1 sm:p-2 whitespace-nowrap">
                            {r.answers && r.answers[idx] ? r.answers[idx] : <span className="text-body/30">—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {/* Chart row at end of page */}
            {SurveyCharts && (
              <div className="mt-8 max-w-full sm:max-w-4xl mx-auto px-2">
                <SurveyCharts responses={responses} questionLabels={questionLabels} />
              </div>
            )}
          </>
        ) : (
          <div className="w-full bg-white dark:bg-navy/80 rounded-xl shadow-md p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 overflow-x-auto mx-auto" style={{marginLeft: '2vw', marginRight: '2vw'}}>
            <div className="flex flex-col flex-1">
              <h2 className="text-base sm:text-lg font-bold mb-4">Messages reçus</h2>
              {contactMessages.length === 0 ? (
                <div className="text-center text-body w-full">Aucun message reçu.</div>
              ) : (
                <table className="min-w-max w-full text-xs sm:text-sm flex-1">
                  <thead>
                    <tr className="bg-purple/10">
                      <th className="p-1 sm:p-2 text-left whitespace-nowrap">Date</th>
                      <th className="p-1 sm:p-2 text-left whitespace-nowrap">Nom</th>
                      <th className="p-1 sm:p-2 text-left whitespace-nowrap">Email</th>
                      <th className="p-1 sm:p-2 text-left whitespace-nowrap">Sujet</th>
                      <th className="p-1 sm:p-2 text-left whitespace-nowrap">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactMessages.map(m => (
                      <tr key={m.id} className="border-b border-purple/10">
                        <td className="p-1 sm:p-2 whitespace-nowrap">{m.submitted_at?.slice(0, 16).replace("T", " ")}</td>
                        <td className="p-1 sm:p-2 whitespace-nowrap">{m.first_name} {m.last_name}</td>
                        <td className="p-1 sm:p-2 whitespace-nowrap">{m.email}</td>
                        <td className="p-1 sm:p-2 whitespace-nowrap">{m.subject}</td>
                        <td className="p-1 sm:p-2 whitespace-nowrap">{m.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;

"use client";
import { useEffect, useState } from "react";

interface SurveyFilterProps {
  onFilter: (filter: { date: string; qcm: string }) => void;
}

function SurveyFilters({ onFilter }: SurveyFilterProps) {
  const [date, setDate] = useState("");
  const [qcm, setQcm] = useState("");

  function handleFilter() {
    onFilter({ date, qcm });
  }

  return (
    <div className="flex gap-4 mb-6">
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
        placeholder="Date"
      />
      <input
        type="text"
        value={qcm}
        onChange={e => setQcm(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
        placeholder="Recherche QCM"
      />
      <button onClick={handleFilter} className="bg-purple text-white rounded px-4 py-2 font-semibold">Filtrer</button>
    </div>
  );
}

export default function SurveyAdminPage() {
  const [responses, setResponses] = useState<Array<{
    submitted_at?: string;
    answers?: any;
    [key: string]: any;
  }>>([]);
  const [filtered, setFiltered] = useState<Array<{
    submitted_at?: string;
    answers?: any;
    [key: string]: any;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSurvey() {
      try {
        const res = await fetch("/api/survey", { cache: "no-store" });
        const data = await res.json();
        if (data.success) {
          setResponses(data.responses || []);
          setFiltered(data.responses || []);
        } else {
          setError(data.error || "Erreur de chargement");
        }
      } catch (err) {
        setError("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    }
    fetchSurvey();
  }, []);

  function handleFilter({ date, qcm }: { date: string; qcm: string }) {
    let filtered = responses;
    if (date) {
      filtered = filtered.filter(r => r.submitted_at && r.submitted_at.startsWith(date));
    }
    if (qcm) {
      filtered = filtered.filter(r => JSON.stringify(r.answers).toLowerCase().includes(qcm.toLowerCase()));
    }
    setFiltered(filtered);
  }

  return (
    <div className="max-w-5xl mx-auto py-16">
      <h1 className="text-3xl font-bold mb-8 text-purple">Administration Sondages</h1>
      <SurveyFilters onFilter={handleFilter} />
      {loading ? (
        <div className="text-sm text-body">Chargement des sondages...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : !filtered.length ? (
        <div className="text-body">Aucune réponse enregistrée.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-purple/20 bg-white dark:bg-navy/80 shadow-lg">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-purple/10">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Réponses détaillées</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(resp => (
                <tr key={resp.id} className="border-t border-purple/10">
                  <td className="px-4 py-2 whitespace-nowrap text-xs">
                    {resp.submitted_at ? new Date(resp.submitted_at).toLocaleString("fr-FR") : "-"}
                  </td>
                  <td className="px-4 py-2">
                    <ul className="space-y-2">
                      {Object.entries(resp.answers).map(([key, value]) => (
                        <li key={key} className="bg-purple/5 rounded p-2 text-xs">
                          <span className="font-semibold text-purple mr-2">{key} :</span>
                          {typeof value === "string" ? value : Array.isArray(value) ? value.join(", ") : JSON.stringify(value)}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

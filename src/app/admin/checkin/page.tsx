"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface CheckinRegistration {
  id: string;
  type: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  school: string;
  role: string;
  addedManually: boolean;
  presentAt: string | null;
  registeredAt: string;
}

const REFRESH_INTERVAL = 7000;

export default function AdminCheckinPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrations, setRegistrations] = useState<CheckinRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualSaving, setManualSaving] = useState(false);
  const [manualError, setManualError] = useState("");
  const [confirmCheckinTarget, setConfirmCheckinTarget] = useState<CheckinRegistration | null>(null);
  const [confirmUncheckTarget, setConfirmUncheckTarget] = useState<CheckinRegistration | null>(null);
  const [confirmManualAdd, setConfirmManualAdd] = useState(false);
  const [manualForm, setManualForm] = useState({
    type: "entreprise",
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    school: "",
    role: "",
  });

  const fetchRegistrations = useCallback(async () => {
    const token = sessionStorage.getItem("admin-token");
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/checkin", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 401) {
          sessionStorage.removeItem("admin-token");
          setIsAuthenticated(false);
        }
        setError(data.error || "Impossible de charger les invités.");
      } else {
        setIsAuthenticated(true);
        setRegistrations(data.registrations as CheckinRegistration[]);
        setLastRefresh(new Date());
      }
    } catch {
      setError("Erreur de chargement des invités.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  useEffect(() => {
    if (!isAuthenticated || !autoRefresh) return;
    const interval = setInterval(fetchRegistrations, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [isAuthenticated, autoRefresh, fetchRegistrations]);

  useEffect(() => {
    const hasOpenModal = Boolean(confirmCheckinTarget || confirmUncheckTarget || confirmManualAdd);
    if (!hasOpenModal) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (manualSaving || savingId) return;

      setConfirmCheckinTarget(null);
      setConfirmUncheckTarget(null);
      setConfirmManualAdd(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [confirmCheckinTarget, confirmUncheckTarget, confirmManualAdd, manualSaving, savingId]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return registrations;

    return registrations.filter((r) => {
      const fullName = `${r.firstName} ${r.lastName}`.toLowerCase();
      return (
        fullName.includes(query) ||
        r.email.toLowerCase().includes(query) ||
        (r.company || "").toLowerCase().includes(query) ||
        (r.school || "").toLowerCase().includes(query) ||
        (r.role || "").toLowerCase().includes(query)
      );
    });
  }, [registrations, search]);

  const stats = useMemo(() => {
    const total = registrations.length;
    const present = registrations.filter((r) => Boolean(r.presentAt)).length;
    const manual = registrations.filter((r) => r.addedManually).length;
    const missing = total - present;

    return { total, present, manual, missing };
  }, [registrations]);

  const handleExportPresentCSV = () => {
    const presentRegistrations = registrations.filter((r) => Boolean(r.presentAt));
    if (presentRegistrations.length === 0) return;

    const escapeCell = (value: string) => value.replace(/"/g, '""');
    const headers = [
      "Type",
      "Nom",
      "Prenom",
      "Email",
      "Entreprise",
      "École",
      "Poste",
      "Ajout manuel",
      "Heure présence",
      "Date inscription",
    ];

    const rows = presentRegistrations.map((r) => [
      r.type === "etudiant" ? "Étudiant" : "Entreprise",
      r.lastName,
      r.firstName,
      r.email,
      r.company || "",
      r.school || "",
      r.role || "",
      r.addedManually ? "Oui" : "Non",
      r.presentAt ? new Date(r.presentAt).toLocaleString("fr-FR") : "",
      new Date(r.registeredAt).toLocaleString("fr-FR"),
    ]);

    const csv = [
      headers.join(";"),
      ...rows.map((row) => row.map((cell) => `"${escapeCell(String(cell))}"`).join(";")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `digizelle-presents-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCheckin = async (id: string) => {
    const token = sessionStorage.getItem("admin-token");
    if (!token) return;

    setSavingId(id);
    setError("");

    try {
      const res = await fetch("/api/admin/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "checkin", id }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Impossible de valider la présence.");
      } else {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === id ? (data.registration as CheckinRegistration) : r))
        );
      }
    } catch {
      setError("Erreur serveur lors de la validation.");
    } finally {
      setSavingId(null);
    }
  };

  const handleUncheckin = async (id: string) => {
    const token = sessionStorage.getItem("admin-token");
    if (!token) return;

    setSavingId(id);
    setError("");

    try {
      const res = await fetch("/api/admin/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "uncheckin", id }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Impossible d'annuler la présence.");
      } else {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === id ? (data.registration as CheckinRegistration) : r))
        );
      }
    } catch {
      setError("Erreur serveur lors de l'annulation.");
    } finally {
      setSavingId(null);
    }
  };

  const executeManualSubmit = async () => {
    const token = sessionStorage.getItem("admin-token");
    if (!token) return;

    setManualSaving(true);
    setManualError("");

    try {
      const res = await fetch("/api/admin/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "manual-add", ...manualForm }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setManualError(data.error || "Impossible d'ajouter l'invité.");
      } else {
        const created = data.registration as CheckinRegistration;
        setRegistrations((prev) => [created, ...prev]);
        setManualForm({
          type: "entreprise",
          firstName: "",
          lastName: "",
          email: "",
          company: "",
          school: "",
          role: "",
        });
        setManualOpen(false);
        setConfirmManualAdd(false);
      }
    } catch {
      setManualError("Erreur serveur lors de l'ajout manuel.");
    } finally {
      setManualSaving(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmManualAdd(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-body">
        Chargement du check-in...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream p-4">
        <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 text-center sm:p-8">
          <Image src="/images/mascotte/mascotte3.png" alt="Digizelle" width={72} height={72} className="mx-auto mb-4 h-16 w-auto" />
          <h1 className="font-serif text-2xl font-bold text-heading">Accès Check-in</h1>
          <p className="mt-2 text-sm text-body">{error || "Connecte-toi au back office pour accéder au check-in."}</p>
          <Link
            href="/admin"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-purple px-4 py-2.5 text-sm font-semibold text-cream transition-all hover:bg-purple-light"
          >
            Aller au back office
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-heading">
      <header className="sticky top-0 z-40 border-b border-border bg-cream/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Image src="/images/mascotte/mascotte3.png" alt="Digizelle" width={36} height={36} className="h-8 w-auto" />
            <div>
              <h1 className="text-sm font-bold sm:text-base">Check-in accueil</h1>
              <p className="text-[11px] text-body/60 sm:text-xs">Recherche, présence et ajout manuel</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh((v) => !v)}
              className={`rounded-lg border px-3 py-1.5 text-xs transition-all ${
                autoRefresh
                  ? "border-green-500/30 bg-green-500/10 text-green-600"
                  : "border-border bg-surface text-body"
              }`}
            >
              {autoRefresh ? "Live" : "Pause"}
            </button>
            <button
              onClick={fetchRegistrations}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-body transition-all hover:border-purple/30 hover:text-purple"
            >
              Rafraîchir
            </button>
            <Link
              href="/admin"
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-body transition-all hover:border-purple/30 hover:text-purple"
            >
              Back office
            </Link>
            <Link
              href="/admin/dashboard"
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-body transition-all hover:border-purple/30 hover:text-purple"
            >
              Dashboard
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:space-y-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Invités" value={stats.total} accent="text-purple" />
          <StatCard label="Présents" value={stats.present} accent="text-green-600" />
          <StatCard label="Absents" value={stats.missing} accent="text-orange-500" />
          <StatCard label="Ajouts manuels" value={stats.manual} accent="text-blue-500" />
        </div>

        <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, email, entreprise, école..."
              className="w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm outline-none transition-all focus:border-purple"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPresentCSV}
                disabled={stats.present === 0}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-body transition-all hover:border-purple/30 hover:text-purple disabled:cursor-not-allowed disabled:opacity-60"
              >
                Export présents (CSV)
              </button>
              <button
                onClick={() => setManualOpen((v) => !v)}
                className="rounded-lg bg-purple px-3 py-2 text-xs font-semibold text-cream transition-all hover:bg-purple-light"
              >
                {manualOpen ? "Fermer ajout manuel" : "Ajouter manuellement"}
              </button>
            </div>
          </div>

          {manualOpen && (
            <form onSubmit={handleManualSubmit} className="mt-4 grid gap-3 rounded-lg border border-border bg-cream p-3 sm:grid-cols-2">
              <select
                value={manualForm.type}
                onChange={(e) => setManualForm((prev) => ({ ...prev, type: e.target.value }))}
                aria-label="Type de profil"
                title="Type de profil"
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              >
                <option value="entreprise">Entreprise</option>
                <option value="etudiant">Étudiant</option>
              </select>
              <input
                value={manualForm.email}
                onChange={(e) => setManualForm((prev) => ({ ...prev, email: e.target.value }))}
                type="email"
                placeholder="Email (optionnel)"
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              />
              <input
                required
                minLength={2}
                value={manualForm.firstName}
                onChange={(e) => setManualForm((prev) => ({ ...prev, firstName: e.target.value }))}
                type="text"
                placeholder="Prénom"
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              />
              <input
                required
                minLength={2}
                value={manualForm.lastName}
                onChange={(e) => setManualForm((prev) => ({ ...prev, lastName: e.target.value }))}
                type="text"
                placeholder="Nom"
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              />
              <input
                value={manualForm.company}
                onChange={(e) => setManualForm((prev) => ({ ...prev, company: e.target.value }))}
                type="text"
                placeholder="Entreprise"
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              />
              <input
                value={manualForm.school}
                onChange={(e) => setManualForm((prev) => ({ ...prev, school: e.target.value }))}
                type="text"
                placeholder="École"
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              />
              <input
                value={manualForm.role}
                onChange={(e) => setManualForm((prev) => ({ ...prev, role: e.target.value }))}
                type="text"
                placeholder="Poste"
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm sm:col-span-2"
              />
              <div className="sm:col-span-2 flex items-center justify-between gap-3">
                <p className="text-xs text-body/70">L’invité sera tagué ajout manuel et marqué présent.</p>
                <button
                  type="submit"
                  disabled={manualSaving}
                  className="rounded-lg bg-purple px-3 py-2 text-xs font-semibold text-cream transition-all hover:bg-purple-light disabled:opacity-60"
                >
                  {manualSaving ? "Ajout..." : "Ajouter + valider présence"}
                </button>
              </div>
              {manualError && <p className="text-xs text-red-500 sm:col-span-2">{manualError}</p>}
            </form>
          )}

          {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
        </section>

        <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold sm:text-base">Invités ({filtered.length})</h2>
            <p className="text-[11px] text-body/60">Dernière mise à jour : {lastRefresh ? lastRefresh.toLocaleTimeString("fr-FR") : "-"}</p>
          </div>

          {filtered.length === 0 ? (
            <p className="text-sm text-body/60">Aucun résultat.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => {
                const isPresent = Boolean(item.presentAt);
                return (
                  <div key={item.id} className="rounded-lg border border-border bg-cream p-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-heading">
                            {item.firstName} {item.lastName}
                          </p>
                          <span className="rounded-full bg-purple/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-purple">
                            {item.type === "etudiant" ? "Étudiant" : "Entreprise"}
                          </span>
                          {item.addedManually && (
                            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                              Ajout manuel
                            </span>
                          )}
                          {isPresent ? (
                            <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-700">
                              Présent
                            </span>
                          ) : (
                            <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-700">
                              Non validé
                            </span>
                          )}
                        </div>

                        <p className="mt-1 truncate text-xs text-body/70">{item.email}</p>
                        <p className="mt-1 text-xs text-body/70">
                          {[item.company, item.school, item.role].filter((v) => (v || "").trim().length > 0).join(" • ") || "-"}
                        </p>
                        {item.presentAt && (
                          <p className="mt-1 text-[11px] text-green-700">
                            Validé à {new Date(item.presentAt).toLocaleTimeString("fr-FR")}
                          </p>
                        )}
                      </div>

                      {isPresent ? (
                        <button
                          onClick={() => setConfirmUncheckTarget(item)}
                          disabled={savingId === item.id}
                          className="rounded-lg border border-orange-600/30 bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-700 transition-all hover:border-orange-600/50 hover:bg-orange-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {savingId === item.id ? "Annulation..." : "Annuler présence"}
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmCheckinTarget(item)}
                          disabled={savingId === item.id}
                          className="rounded-lg bg-purple px-3 py-2 text-xs font-semibold text-cream transition-all hover:bg-purple-light disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {savingId === item.id ? "Validation..." : "Valider présence"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {confirmUncheckTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-heading/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-4 sm:p-5">
            <h3 className="text-base font-semibold text-heading">Confirmer l'annulation</h3>
            <p className="mt-2 text-sm text-body/80">
              Annuler la présence de <span className="font-semibold text-heading">{confirmUncheckTarget.firstName} {confirmUncheckTarget.lastName}</span> ?
            </p>
            <p className="mt-1 text-xs text-body/60">Cette action remettra l'invité en statut non validé.</p>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmUncheckTarget(null)}
                disabled={savingId === confirmUncheckTarget.id}
                className="rounded-lg border border-border bg-cream px-3 py-2 text-xs font-semibold text-body transition-all hover:border-purple/30 hover:text-purple disabled:cursor-not-allowed disabled:opacity-60"
              >
                Garder présent
              </button>
              <button
                onClick={async () => {
                  const id = confirmUncheckTarget.id;
                  await handleUncheckin(id);
                  setConfirmUncheckTarget(null);
                }}
                disabled={savingId === confirmUncheckTarget.id}
                className="rounded-lg border border-orange-600/30 bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-700 transition-all hover:border-orange-600/50 hover:bg-orange-500/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingId === confirmUncheckTarget.id ? "Annulation..." : "Confirmer l'annulation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmCheckinTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-heading/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-4 sm:p-5">
            <h3 className="text-base font-semibold text-heading">Confirmer la validation</h3>
            <p className="mt-2 text-sm text-body/80">
              Valider la présence de <span className="font-semibold text-heading">{confirmCheckinTarget.firstName} {confirmCheckinTarget.lastName}</span> ?
            </p>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmCheckinTarget(null)}
                disabled={savingId === confirmCheckinTarget.id}
                className="rounded-lg border border-border bg-cream px-3 py-2 text-xs font-semibold text-body transition-all hover:border-purple/30 hover:text-purple disabled:cursor-not-allowed disabled:opacity-60"
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  const id = confirmCheckinTarget.id;
                  await handleCheckin(id);
                  setConfirmCheckinTarget(null);
                }}
                disabled={savingId === confirmCheckinTarget.id}
                className="rounded-lg bg-purple px-3 py-2 text-xs font-semibold text-cream transition-all hover:bg-purple-light disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingId === confirmCheckinTarget.id ? "Validation..." : "Confirmer la présence"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmManualAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-heading/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-4 sm:p-5">
            <h3 className="text-base font-semibold text-heading">Confirmer l'ajout manuel</h3>
            <p className="mt-2 text-sm text-body/80">
              Ajouter <span className="font-semibold text-heading">{manualForm.firstName || "-"} {manualForm.lastName || "-"}</span> et valider sa présence maintenant ?
            </p>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmManualAdd(false)}
                disabled={manualSaving}
                className="rounded-lg border border-border bg-cream px-3 py-2 text-xs font-semibold text-body transition-all hover:border-purple/30 hover:text-purple disabled:cursor-not-allowed disabled:opacity-60"
              >
                Revenir au formulaire
              </button>
              <button
                onClick={executeManualSubmit}
                disabled={manualSaving}
                className="rounded-lg bg-purple px-3 py-2 text-xs font-semibold text-cream transition-all hover:bg-purple-light disabled:cursor-not-allowed disabled:opacity-60"
              >
                {manualSaving ? "Ajout..." : "Confirmer ajout + présence"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-body/50 sm:text-xs">{label}</p>
      <p className={`mt-1 font-serif text-2xl font-bold sm:text-3xl ${accent}`}>{value}</p>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
  message: string;
  registeredAt: string;
}

const REFRESH_INTERVAL = 5000; // 5 seconds

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [total, setTotal] = useState(0);
  const [spotsLeft, setSpotsLeft] = useState(50);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchRegistrations = useCallback(async () => {
    const storedToken = sessionStorage.getItem("admin-token");
    if (!storedToken) return;

    try {
      const res = await fetch("/api/register", {
        headers: { Authorization: `Bearer ${storedToken}` },
        cache: "no-store",
      });
      const data = await res.json();

      if (data.registrations) {
        setRegistrations(data.registrations);
        setTotal(data.total);
        setSpotsLeft(data.spotsLeft);
        setLastRefresh(new Date());
      } else {
        // Token invalid
        sessionStorage.removeItem("admin-token");
        setIsAuthenticated(false);
      }
    } catch {
      // Silent fail for auto-refresh
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const data = await res.json();

      if (data.registrations !== undefined) {
        sessionStorage.setItem("admin-token", token);
        setIsAuthenticated(true);
        setRegistrations(data.registrations);
        setTotal(data.total);
        setSpotsLeft(data.spotsLeft);
        setLastRefresh(new Date());
      } else {
        setLoginError("Token invalide. Accès refusé.");
      }
    } catch {
      setLoginError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const storedToken = sessionStorage.getItem("admin-token");
    if (!storedToken) return;

    try {
      const res = await fetch("/api/register", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        await fetchRegistrations();
      }
    } catch {
      // Ignore
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Nom", "Prenom", "Email", "Entreprise", "Poste", "Message", "Date inscription"];
    const rows = registrations.map((r) => [
      r.lastName,
      r.firstName,
      r.email,
      r.company,
      r.role,
      r.message.replace(/"/g, '""'),
      new Date(r.registeredAt).toLocaleString("fr-FR"),
    ]);

    const csv = [headers.join(";"), ...rows.map((r) => r.map((c) => `"${c}"`).join(";"))].join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inscriptions-digizelle-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Check if already authenticated
  useEffect(() => {
    const storedToken = sessionStorage.getItem("admin-token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      fetchRegistrations();
    }
  }, [fetchRegistrations]);

  // Auto-refresh
  useEffect(() => {
    if (!isAuthenticated || !autoRefresh) return;

    const interval = setInterval(fetchRegistrations, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [isAuthenticated, autoRefresh, fetchRegistrations]);

  const filtered = registrations.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.firstName.toLowerCase().includes(q) ||
      r.lastName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.company.toLowerCase().includes(q) ||
      r.role.toLowerCase().includes(q)
    );
  });

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B1120] p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Image
              src="/images/mascotte/mascotte3.png"
              alt="Digizelle"
              width={80}
              height={80}
              className="mx-auto mb-4 h-16 w-auto"
            />
            <h1 className="font-serif text-2xl font-bold text-white">Back Office</h1>
            <p className="mt-1 text-sm text-white/50">Digizelle Impact Event 2026</p>
          </div>

          <form onSubmit={handleLogin} className="rounded-lg border border-white/10 bg-white/5 p-6">
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#C5A55A]">
              Token d&apos;accès
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Entrez le token admin"
              className="mb-4 w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#C5A55A]/50"
              autoFocus
            />
            {loginError && (
              <p className="mb-4 text-sm text-red-400">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loading || !token}
              className="w-full rounded-md bg-[#C5A55A] px-4 py-3 text-sm font-semibold text-[#0B1120] transition-colors hover:bg-[#d4b76b] disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Accéder au back office"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1120]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/images/mascotte/mascotte3.png"
              alt="Digizelle"
              width={36}
              height={36}
              className="h-8 w-auto"
            />
            <div>
              <h1 className="text-sm font-bold sm:text-base">Back Office</h1>
              <p className="text-xs text-white/40">Digizelle Impact 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${autoRefresh ? "animate-pulse bg-green-400" : "bg-white/30"}`} />
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="text-xs text-white/50 transition-colors hover:text-white"
              >
                {autoRefresh ? "Live" : "Pause"}
              </button>
            </div>
            <button
              onClick={() => {
                sessionStorage.removeItem("admin-token");
                setIsAuthenticated(false);
                setToken("");
              }}
              className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-white/60 transition-colors hover:border-red-500/30 hover:text-red-400"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Stats cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 sm:p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-white/40">Inscrits</p>
            <p className="mt-1 font-serif text-3xl font-bold text-white sm:text-4xl">{total}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 sm:p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-white/40">Places restantes</p>
            <p className="mt-1 font-serif text-3xl font-bold sm:text-4xl" style={{ color: spotsLeft <= 10 ? "#ef4444" : spotsLeft <= 25 ? "#C5A55A" : "#22c55e" }}>
              {spotsLeft}
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 sm:p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-white/40">Taux remplissage</p>
            <p className="mt-1 font-serif text-3xl font-bold text-[#C5A55A] sm:text-4xl">
              {Math.round((total / 50) * 100)}%
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 sm:p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-white/40">Dernière maj</p>
            <p className="mt-1 text-lg font-medium text-white/70 sm:text-xl">
              {lastRefresh ? lastRefresh.toLocaleTimeString("fr-FR") : "—"}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between text-xs text-white/40">
            <span>Capacité</span>
            <span>{total}/50</span>
          </div>
          <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min((total / 50) * 100, 100)}%`,
                backgroundColor: spotsLeft <= 10 ? "#ef4444" : spotsLeft <= 25 ? "#C5A55A" : "#22c55e",
              }}
            />
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un inscrit..."
              className="w-full rounded-md border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#C5A55A]/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchRegistrations}
              className="flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs text-white/60 transition-colors hover:border-white/20 hover:text-white"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
              </svg>
              Rafraichir
            </button>
            <button
              onClick={handleExportCSV}
              disabled={registrations.length === 0}
              className="flex items-center gap-2 rounded-md bg-[#C5A55A] px-3 py-2 text-xs font-semibold text-[#0B1120] transition-colors hover:bg-[#d4b76b] disabled:opacity-50"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Exporter CSV
            </button>
          </div>
        </div>

        {/* Table */}
        {registrations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 py-16">
            <Image
              src="/images/mascotte/mascotte2.png"
              alt="Aucune inscription"
              width={120}
              height={120}
              className="mb-4 h-20 w-auto opacity-40"
            />
            <p className="text-sm text-white/40">Aucune inscription pour le moment</p>
            <p className="mt-1 text-xs text-white/20">Les inscriptions apparaitront ici en temps réel</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-white/10">
            {/* Desktop table */}
            <div className="hidden sm:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/40">#</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/40">Nom</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/40">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/40">Entreprise</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/40">Poste</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/40">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-white/40">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((r, i) => (
                    <tr key={r.id} className="transition-colors hover:bg-white/5">
                      <td className="px-4 py-3 text-white/30">{i + 1}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-white">{r.firstName} {r.lastName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${r.email}`} className="text-[#C5A55A] transition-colors hover:text-[#d4b76b]">
                          {r.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-white/60">{r.company || "—"}</td>
                      <td className="px-4 py-3 text-white/60">{r.role || "—"}</td>
                      <td className="px-4 py-3 text-white/40">
                        {new Date(r.registeredAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {deleteConfirm === r.id ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleDelete(r.id)}
                              className="rounded px-2 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/10"
                            >
                              Confirmer
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="rounded px-2 py-1 text-xs text-white/40 transition-colors hover:bg-white/5"
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(r.id)}
                            className="rounded p-1 text-white/20 transition-colors hover:text-red-400"
                            title="Supprimer"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-white/5 sm:hidden">
              {filtered.map((r, i) => (
                <div key={r.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="mr-2 text-xs text-white/30">#{i + 1}</span>
                      <span className="font-medium text-white">{r.firstName} {r.lastName}</span>
                    </div>
                    {deleteConfirm === r.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                        >
                          Suppr
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="rounded px-2 py-1 text-xs text-white/40 hover:bg-white/5"
                        >
                          Non
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(r.id)}
                        className="text-white/20 hover:text-red-400"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <a href={`mailto:${r.email}`} className="mt-1 block text-sm text-[#C5A55A]">{r.email}</a>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
                    {r.company && <span>{r.company}</span>}
                    {r.role && <span>{r.role}</span>}
                    <span>
                      {new Date(r.registeredAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {r.message && (
                    <p className="mt-2 text-xs italic text-white/30">&ldquo;{r.message}&rdquo;</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {searchQuery && (
          <p className="mt-3 text-xs text-white/30">
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} sur {registrations.length} inscription{registrations.length !== 1 ? "s" : ""}
          </p>
        )}
      </main>
    </div>
  );
}

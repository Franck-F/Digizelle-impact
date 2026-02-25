"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

type SortKey = "name" | "email" | "company" | "date";
type SortDir = "asc" | "desc";

const REFRESH_INTERVAL = 5000;
const MAX_CAPACITY = 50;

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [total, setTotal] = useState(0);
  const [spotsLeft, setSpotsLeft] = useState(MAX_CAPACITY);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const prevTotalRef = useRef(0);

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
        // Detect new registrations
        if (prevTotalRef.current > 0 && data.total > prevTotalRef.current) {
          const oldIds = new Set(registrations.map((r) => r.id));
          const freshIds = (data.registrations as Registration[])
            .filter((r) => !oldIds.has(r.id))
            .map((r) => r.id);
          setNewIds(new Set(freshIds));
          setTimeout(() => setNewIds(new Set()), 4000);
        }
        prevTotalRef.current = data.total;

        setRegistrations(data.registrations);
        setTotal(data.total);
        setSpotsLeft(data.spotsLeft);
        setLastRefresh(new Date());
      } else {
        sessionStorage.removeItem("admin-token");
        setIsAuthenticated(false);
      }
    } catch {
      // Silent fail
    }
  }, [registrations]);

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
        prevTotalRef.current = data.total;
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
        if (selectedReg?.id === id) setSelectedReg(null);
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

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  useEffect(() => {
    const storedToken = sessionStorage.getItem("admin-token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      fetchRegistrations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !autoRefresh) return;
    const interval = setInterval(fetchRegistrations, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [isAuthenticated, autoRefresh, fetchRegistrations]);

  // Filter + sort
  const filtered = registrations
    .filter((r) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.firstName.toLowerCase().includes(q) ||
        r.lastName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortKey) {
        case "name":
          return dir * `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
        case "email":
          return dir * a.email.localeCompare(b.email);
        case "company":
          return dir * (a.company || "").localeCompare(b.company || "");
        case "date":
          return dir * (new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime());
        default:
          return 0;
      }
    });

  const fillPercent = Math.round((total / MAX_CAPACITY) * 100);
  const gaugeColor = spotsLeft <= 10 ? "#ef4444" : spotsLeft <= 25 ? "#C5A55A" : "#22c55e";
  const circumference = 2 * Math.PI * 54;
  const gaugeOffset = circumference - (fillPercent / 100) * circumference;

  // Recent registrations (last 24h)
  const recentCount = registrations.filter(
    (r) => Date.now() - new Date(r.registeredAt).getTime() < 86400000
  ).length;

  // Companies list
  const companies = [...new Set(registrations.map((r) => r.company).filter(Boolean))];

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B1120] p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-[400px] w-[400px] rounded-full border border-[#C5A55A]/5" />
          <div className="absolute -bottom-32 -right-16 h-[500px] w-[500px] rounded-full border border-[#C5A55A]/5" />
          <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[#C5A55A]/[0.02]" />
        </div>

        <div className="relative w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="relative mx-auto mb-6 h-20 w-20">
              <Image
                src="/images/mascotte/mascotte3.png"
                alt="Digizelle"
                width={80}
                height={80}
                className="h-20 w-auto"
              />
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#C5A55A] text-[10px] font-bold text-[#0B1120]">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-white">Back Office</h1>
            <p className="mt-2 text-sm text-white/40">Digizelle Impact Event 2026</p>
            <p className="mt-1 text-xs text-[#C5A55A]/60">Tableau de bord administrateur</p>
          </div>

          <form onSubmit={handleLogin} className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#C5A55A]">
              Token d&apos;accès
            </label>
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
              </svg>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Entrez le token admin"
                className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/25 outline-none transition-all focus:border-[#C5A55A]/50 focus:bg-white/[0.07]"
                autoFocus
              />
            </div>
            {loginError && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5">
                <svg className="h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <p className="text-sm text-red-400">{loginError}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !token}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#C5A55A] px-4 py-3.5 text-sm font-bold text-[#0B1120] transition-all hover:bg-[#d4b76b] hover:shadow-lg hover:shadow-[#C5A55A]/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connexion...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                  Accéder au back office
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Column sort indicator
  const SortIcon = ({ col }: { col: SortKey }) => (
    <svg
      className={`ml-1 inline h-3 w-3 transition-transform ${sortKey === col ? "text-[#C5A55A]" : "text-white/20"} ${sortKey === col && sortDir === "desc" ? "rotate-180" : ""}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
  );

  // Dashboard
  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1120]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Image src="/images/mascotte/mascotte3.png" alt="Digizelle" width={36} height={36} className="h-8 w-auto" />
            <div>
              <h1 className="text-sm font-bold sm:text-base">Back Office</h1>
              <p className="text-[10px] text-white/40 sm:text-xs">Digizelle Impact 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live indicator */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all ${
                autoRefresh
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : "border-white/10 bg-white/5 text-white/40"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${autoRefresh ? "animate-pulse bg-green-400" : "bg-white/30"}`} />
              {autoRefresh ? "Live" : "Pause"}
            </button>

            {/* Event date */}
            <span className="hidden rounded-full border border-[#C5A55A]/20 bg-[#C5A55A]/10 px-3 py-1.5 text-xs text-[#C5A55A] sm:block">
              13 Mars 2026
            </span>

            <button
              onClick={() => {
                sessionStorage.removeItem("admin-token");
                setIsAuthenticated(false);
                setToken("");
              }}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 transition-all hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400"
            >
              <svg className="h-4 w-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Top row — Gauge + Stats */}
        <div className="mb-6 grid gap-4 sm:mb-8 sm:gap-6 lg:grid-cols-[auto_1fr]">
          {/* Circular gauge */}
          <div className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="relative flex flex-col items-center">
              <svg className="h-32 w-32 -rotate-90 sm:h-40 sm:w-40" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="54" fill="none"
                  stroke={gaugeColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={gaugeOffset}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-serif text-3xl font-bold sm:text-4xl" style={{ color: gaugeColor }}>{fillPercent}%</span>
                <span className="text-[10px] uppercase tracking-wider text-white/30 sm:text-xs">rempli</span>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {/* Inscrits */}
            <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-white/20 sm:p-5">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#C5A55A]/10">
                <svg className="h-4.5 w-4.5 text-[#C5A55A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 sm:text-xs">Inscrits</p>
              <p className="mt-0.5 font-serif text-2xl font-bold text-white sm:text-3xl">{total}</p>
            </div>

            {/* Places restantes */}
            <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-white/20 sm:p-5">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${gaugeColor}15` }}>
                <svg className="h-4.5 w-4.5" style={{ color: gaugeColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                </svg>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 sm:text-xs">Places</p>
              <p className="mt-0.5 font-serif text-2xl font-bold sm:text-3xl" style={{ color: gaugeColor }}>{spotsLeft}</p>
            </div>

            {/* Dernières 24h */}
            <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-white/20 sm:p-5">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#7C3AED]/10">
                <svg className="h-4.5 w-4.5 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 sm:text-xs">24 dernières h</p>
              <p className="mt-0.5 font-serif text-2xl font-bold text-[#7C3AED] sm:text-3xl">{recentCount}</p>
            </div>

            {/* Entreprises */}
            <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-white/20 sm:p-5">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                <svg className="h-4.5 w-4.5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                </svg>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 sm:text-xs">Entreprises</p>
              <p className="mt-0.5 font-serif text-2xl font-bold text-white/70 sm:text-3xl">{companies.length}</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:mb-8 sm:p-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white/50">Capacité de l&apos;événement</span>
            <span className="font-bold" style={{ color: gaugeColor }}>{total}/{MAX_CAPACITY}</span>
          </div>
          <div className="mt-2.5 h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(fillPercent, 100)}%`,
                background: `linear-gradient(90deg, ${gaugeColor}, ${gaugeColor}dd)`,
                boxShadow: `0 0 12px ${gaugeColor}40`,
              }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-white/20">
            <span>0</span>
            <span>25</span>
            <span>50</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, email, entreprise..."
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-white placeholder-white/25 outline-none transition-all focus:border-[#C5A55A]/50 focus:bg-white/[0.07]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30">
              {lastRefresh && `Maj ${lastRefresh.toLocaleTimeString("fr-FR")}`}
            </span>
            <button
              onClick={fetchRegistrations}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/50 transition-all hover:border-white/20 hover:text-white"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
              </svg>
              Rafraichir
            </button>
            <button
              onClick={handleExportCSV}
              disabled={registrations.length === 0}
              className="flex items-center gap-1.5 rounded-lg bg-[#C5A55A] px-3.5 py-2 text-xs font-bold text-[#0B1120] transition-all hover:bg-[#d4b76b] hover:shadow-lg hover:shadow-[#C5A55A]/20 disabled:opacity-40"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Exporter CSV
            </button>
          </div>
        </div>

        {/* Table / Empty state */}
        {registrations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-20">
            <Image src="/images/mascotte/mascotte2.png" alt="" width={140} height={140} className="mb-5 h-24 w-auto opacity-30" />
            <p className="text-base font-medium text-white/30">Aucune inscription pour le moment</p>
            <p className="mt-1.5 text-sm text-white/15">Les inscriptions apparaitront ici en temps réel</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/10">
            {/* Desktop table */}
            <div className="hidden sm:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03]">
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-white/30">#</th>
                    <th className="cursor-pointer px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-white/30 hover:text-white/50" onClick={() => handleSort("name")}>
                      Nom <SortIcon col="name" />
                    </th>
                    <th className="cursor-pointer px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-white/30 hover:text-white/50" onClick={() => handleSort("email")}>
                      Email <SortIcon col="email" />
                    </th>
                    <th className="cursor-pointer px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-white/30 hover:text-white/50" onClick={() => handleSort("company")}>
                      Entreprise <SortIcon col="company" />
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-white/30">Poste</th>
                    <th className="cursor-pointer px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-white/30 hover:text-white/50" onClick={() => handleSort("date")}>
                      Date <SortIcon col="date" />
                    </th>
                    <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-white/30">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((r, i) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedReg(selectedReg?.id === r.id ? null : r)}
                      className={`cursor-pointer transition-all ${
                        newIds.has(r.id)
                          ? "animate-pulse bg-[#C5A55A]/10"
                          : selectedReg?.id === r.id
                          ? "bg-[#C5A55A]/5"
                          : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <td className="px-4 py-3 text-white/20">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C5A55A]/10 text-xs font-bold text-[#C5A55A]">
                            {r.firstName[0]}{r.lastName[0]}
                          </div>
                          <span className="font-medium text-white">{r.firstName} {r.lastName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${r.email}`} onClick={(e) => e.stopPropagation()} className="text-[#C5A55A]/80 transition-colors hover:text-[#C5A55A]">
                          {r.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-white/50">{r.company || "—"}</td>
                      <td className="px-4 py-3 text-white/50">{r.role || "—"}</td>
                      <td className="px-4 py-3 text-white/30">
                        {new Date(r.registeredAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        {deleteConfirm === r.id ? (
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleDelete(r.id)} className="rounded-md bg-red-500/10 px-2.5 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/20">
                              Supprimer
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className="rounded-md px-2.5 py-1 text-xs text-white/30 transition-colors hover:bg-white/5">
                              Non
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(r.id)} className="rounded-md p-1.5 text-white/15 transition-all hover:bg-red-500/10 hover:text-red-400" title="Supprimer">
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
                <div
                  key={r.id}
                  onClick={() => setSelectedReg(selectedReg?.id === r.id ? null : r)}
                  className={`p-4 transition-all ${newIds.has(r.id) ? "animate-pulse bg-[#C5A55A]/10" : selectedReg?.id === r.id ? "bg-[#C5A55A]/5" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C5A55A]/10 text-xs font-bold text-[#C5A55A]">
                        {r.firstName[0]}{r.lastName[0]}
                      </div>
                      <div>
                        <span className="mr-1.5 text-[10px] text-white/20">#{i + 1}</span>
                        <span className="font-medium text-white">{r.firstName} {r.lastName}</span>
                      </div>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      {deleteConfirm === r.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => handleDelete(r.id)} className="rounded-md bg-red-500/10 px-2 py-1 text-xs text-red-400">Suppr</button>
                          <button onClick={() => setDeleteConfirm(null)} className="rounded-md px-2 py-1 text-xs text-white/30">Non</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(r.id)} className="text-white/15 hover:text-red-400">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <a href={`mailto:${r.email}`} onClick={(e) => e.stopPropagation()} className="mt-1.5 block text-sm text-[#C5A55A]/70">{r.email}</a>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/30">
                    {r.company && <span>{r.company}</span>}
                    {r.role && <span>{r.role}</span>}
                    <span>
                      {new Date(r.registeredAt).toLocaleDateString("fr-FR", {
                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Expanded detail */}
                  {selectedReg?.id === r.id && r.message && (
                    <div className="mt-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">Message</p>
                      <p className="mt-1 text-xs italic text-white/40">&ldquo;{r.message}&rdquo;</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detail panel — desktop */}
        {selectedReg && (
          <div className="mt-4 hidden rounded-xl border border-[#C5A55A]/20 bg-[#C5A55A]/[0.03] p-5 sm:block sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C5A55A]/10 text-lg font-bold text-[#C5A55A]">
                  {selectedReg.firstName[0]}{selectedReg.lastName[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedReg.firstName} {selectedReg.lastName}</h3>
                  <p className="text-sm text-white/40">
                    {selectedReg.company && `${selectedReg.company}`}
                    {selectedReg.company && selectedReg.role && " — "}
                    {selectedReg.role && selectedReg.role}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedReg(null)} className="rounded-md p-1 text-white/20 hover:text-white/50">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">Email</p>
                <a href={`mailto:${selectedReg.email}`} className="mt-1 block text-sm text-[#C5A55A]">{selectedReg.email}</a>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">Date d&apos;inscription</p>
                <p className="mt-1 text-sm text-white/60">
                  {new Date(selectedReg.registeredAt).toLocaleDateString("fr-FR", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">ID</p>
                <p className="mt-1 font-mono text-xs text-white/30">{selectedReg.id.slice(0, 8)}...</p>
              </div>
            </div>
            {selectedReg.message && (
              <div className="mt-4 rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">Message</p>
                <p className="mt-1.5 text-sm italic text-white/50">&ldquo;{selectedReg.message}&rdquo;</p>
              </div>
            )}
          </div>
        )}

        {searchQuery && (
          <p className="mt-3 text-xs text-white/25">
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} sur {registrations.length} inscription{registrations.length !== 1 ? "s" : ""}
          </p>
        )}
      </main>
    </div>
  );
}

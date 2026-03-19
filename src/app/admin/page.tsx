"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface Registration {
  id: string;
  type: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  school: string;
  role: string;
  message: string;
  emailStatus: string;
  emailProvider: string;
  emailError: string;
  registeredAt: string;
}

type SortKey = "name" | "email" | "company" | "date";
type SortDir = "asc" | "desc";

const REFRESH_INTERVAL = 5000;

function normalizeSchoolName(rawSchool: string): string {
  const school = rawSchool.trim();
  if (!school) return school;

  const lowerSchool = school.toLowerCase();
  if (lowerSchool === "epita") {
    return "Epita";
  }
  if (lowerSchool === "epitech" || lowerSchool === "epitech paris") {
    return "Epitech";
  }
  if (lowerSchool === "skema" || lowerSchool === "skema business school") {
    return "Skema Business School";
  }
  if (lowerSchool === "hec" || lowerSchool === "hec paris") {
    return "HEC Paris";
  }

  return school;
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);
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
    const headers = ["Type", "Nom", "Prenom", "Email", "Entreprise", "École", "Poste", "Message", "Date inscription"];
    const rows = registrations.map((r) => [
      r.type === "etudiant" ? "Étudiant" : "Entreprise",
      r.lastName,
      r.firstName,
      r.email,
      r.company,
      r.school,
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

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (mobileMenuRef.current?.contains(target)) return;
      if (mobileMenuButtonRef.current?.contains(target)) return;
      setMobileMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [mobileMenuOpen]);

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
        (r.school || "").toLowerCase().includes(q) ||
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


  // Recent registrations (last 24h)
  const recentCount = registrations.filter(
    (r) => Date.now() - new Date(r.registeredAt).getTime() < 86400000
  ).length;

  // Companies list
  const companies = [...new Set(registrations.map((r) => r.company).filter(Boolean))];

  // Type breakdown
  const studentCount = registrations.filter((r) => r.type === "etudiant").length;
  const companyCount = registrations.filter((r) => r.type !== "etudiant").length;

  const schoolCounts = registrations
    .filter((r) => r.type === "etudiant" && (r.school || "").trim().length > 0)
    .reduce<Record<string, number>>((acc, r) => {
      const school = normalizeSchoolName(r.school);
      acc[school] = (acc[school] || 0) + 1;
      return acc;
    }, {});

  const totalStudentWithSchool = Object.values(schoolCounts).reduce((sum, count) => sum + count, 0);

  const topSchools = Object.entries(schoolCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([school, count]) => ({
      school,
      count,
      percentage: totalStudentWithSchool > 0 ? (count / totalStudentWithSchool) * 100 : 0,
    }));

  const getBarWidthClass = (percentage: number) => {
    if (percentage >= 100) return "w-full";
    if (percentage >= 92) return "w-11/12";
    if (percentage >= 83) return "w-10/12";
    if (percentage >= 75) return "w-9/12";
    if (percentage >= 67) return "w-8/12";
    if (percentage >= 58) return "w-7/12";
    if (percentage >= 50) return "w-6/12";
    if (percentage >= 42) return "w-5/12";
    if (percentage >= 33) return "w-4/12";
    if (percentage >= 25) return "w-3/12";
    if (percentage >= 17) return "w-2/12";
    if (percentage > 0) return "w-1/12";
    return "w-0";
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-[400px] w-[400px] rounded-full border border-purple/5" />
          <div className="absolute -bottom-32 -right-16 h-[500px] w-[500px] rounded-full border border-purple/5" />
          <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-purple/[0.02]" />
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
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple text-[10px] font-bold text-cream">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-heading">Back Office</h1>
            <p className="mt-2 text-sm text-body">Digizelle Impact Event 2026</p>
            <p className="mt-1 text-xs text-purple/60">Tableau de bord administrateur</p>
          </div>

          <form onSubmit={handleLogin} className="rounded-xl border border-border bg-surface p-6 backdrop-blur-sm sm:p-8">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-purple">
              Token d&apos;accès
            </label>
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-heading/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
              </svg>
              <input
                type={showToken ? "text" : "password"}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Entrez le token admin"
                className="mb-4 w-full rounded-lg border border-border bg-surface py-3.5 pl-11 pr-12 text-sm text-heading placeholder:text-body/50 outline-none transition-all focus:border-purple/50 focus:bg-surface"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                aria-label={showToken ? "Masquer le token" : "Afficher le token"}
                title={showToken ? "Masquer le token" : "Afficher le token"}
                className="absolute right-3.5 top-1/2 -translate-y-[calc(50%+8px)] text-heading/20 transition-colors hover:text-purple"
              >
                {showToken ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.301 7.697 7.244 4.5 12 4.5c4.756 0 8.773 3.162 10.065 7.498a1.012 1.012 0 0 1 0 .644C20.699 16.303 16.756 19.5 12 19.5c-4.756 0-8.773-3.162-10.065-7.498Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
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
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple px-4 py-3.5 text-sm font-bold text-cream transition-all hover:bg-purple-light hover:shadow-lg hover:shadow-purple/20 disabled:opacity-50"
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
      className={`ml-1 inline h-3 w-3 transition-transform ${sortKey === col ? "text-purple" : "text-heading/20"} ${sortKey === col && sortDir === "desc" ? "rotate-180" : ""}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
  );

  // Dashboard
  return (
    <div className="min-h-screen bg-cream text-heading">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-cream/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Image src="/images/mascotte/mascotte3.png" alt="Digizelle" width={36} height={36} className="h-8 w-auto" />
            <div>
              <h1 className="text-sm font-bold sm:text-base">Back Office</h1>
              <p className="text-[10px] text-body sm:text-xs">Digizelle Impact 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live indicator */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all ${autoRefresh
                ? "border-green-500/30 bg-green-500/10 text-green-400"
                : "border-border bg-surface text-body"
                }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${autoRefresh ? "animate-pulse bg-green-400" : "bg-heading/30"}`} />
              {autoRefresh ? "Live" : "Pause"}
            </button>

            <ThemeToggle />


            <Link
              href="/admin/dashboard"
              className="hidden rounded-lg border border-border px-3 py-1.5 text-xs text-body transition-all hover:border-purple/30 hover:text-purple sm:inline-flex"
            >
              Dashboard
            </Link>

            <span className="hidden rounded-full border border-purple/20 bg-purple/10 px-3 py-1.5 text-xs text-purple sm:block">

            </span>

            <button
              ref={mobileMenuButtonRef}
              onClick={() => setMobileMenuOpen((v) => !v)}
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
                setIsAuthenticated(false);
                setToken("");
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
        </div>

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
                  setIsAuthenticated(false);
                  setToken("");
                  setMobileMenuOpen(false);
                }}
                className="w-full rounded-lg border border-border px-3 py-2 text-left text-xs text-body transition-all hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400"
              >
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Top row — Gauge + Stats */}
        <div className="mb-6 grid gap-4 sm:mb-8 sm:gap-6 lg:grid-cols-[auto_1fr]">
          {/* Circular gauge */}
          {/* Total Inscriptions Big Card */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface p-6 sm:p-8">
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-body/50 sm:text-xs">Total Inscriptions</p>
              <p className="mt-2 font-serif text-5xl font-bold text-purple sm:text-6xl">{total}</p>
              <p className="mt-2 text-xs text-body/50">Digizelle Impact 2026</p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {/* Inscrits */}
            <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-4 transition-all hover:border-purple/20 sm:p-5">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-purple/10">
                <svg className="h-4.5 w-4.5 text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-body/50 sm:text-xs">Inscrits</p>
              <p className="mt-0.5 font-serif text-2xl font-bold text-heading sm:text-3xl">{total}</p>
            </div>

            {/* Dernières 24h */}
            <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-4 transition-all hover:border-purple/20 sm:p-5">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-dark/10">
                <svg className="h-4.5 w-4.5 text-purple-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-body/50 sm:text-xs">24 dernières h</p>
              <p className="mt-0.5 font-serif text-2xl font-bold text-purple-dark sm:text-3xl">{recentCount}</p>
            </div>

            {/* Étudiants */}
            <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-4 transition-all hover:border-purple/20 sm:p-5">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                <svg className="h-4.5 w-4.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a23.54 23.54 0 0 0-2.688 6.413 24.777 24.777 0 0 1 2.688-6.413Zm15.482 0a23.54 23.54 0 0 1 2.688 6.413 24.777 24.777 0 0 0-2.688-6.413ZM12 2.25l8.458 3.86v3.752c0 .536-.024 1.067-.07 1.592M12 2.25 3.542 6.11v3.752c0 .536.024 1.067.07 1.592" />
                </svg>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-body/50 sm:text-xs">Étudiants</p>
              <p className="mt-0.5 font-serif text-2xl font-bold text-blue-400 sm:text-3xl">{studentCount}</p>
            </div>

            {/* Entreprises */}
            <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-4 transition-all hover:border-purple/20 sm:p-5">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
                <svg className="h-4.5 w-4.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                </svg>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-body/50 sm:text-xs">Entreprises</p>
              <p className="mt-0.5 font-serif text-2xl font-bold text-orange-400 sm:text-3xl">{companyCount}</p>
            </div>

            {/* Email Success Stat */}
            <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-4 transition-all hover:border-purple/20 sm:p-5">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
                <svg className="h-4.5 w-4.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-body/50 sm:text-xs">Emails Livrés</p>
              <p className="mt-0.5 font-serif text-2xl font-bold text-green-500 sm:text-3xl">
                {registrations.filter(r => r.emailStatus === 'sent').length}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-border bg-surface p-4 sm:mb-8 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-heading sm:text-base">Écoles les plus présentes</h2>
            <span className="text-[10px] uppercase tracking-widest text-body/50 sm:text-xs">
              % sur étudiants
            </span>
          </div>

          {topSchools.length === 0 ? (
            <p className="text-sm text-body/60">Aucune école renseignée pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {topSchools.map(({ school, count, percentage }) => (
                <div key={school}>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <p className="truncate text-xs font-medium text-heading sm:text-sm">{school}</p>
                    <p className="text-xs font-semibold text-purple sm:text-sm">{percentage.toFixed(1)}%</p>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-cream-dark">
                    <div className={`h-full rounded-full bg-purple ${getBarWidthClass(percentage)}`} />
                  </div>
                  <p className="mt-1 text-[10px] text-body/60 sm:text-xs">
                    {count} inscription{count > 1 ? "s" : ""}
                  </p>
                </div>
              ))}
            </div>
          )}

          <p className="mt-4 text-[10px] text-body/50 sm:text-xs">
            Base de calcul : {totalStudentWithSchool} étudiant{totalStudentWithSchool > 1 ? "s" : ""} avec école renseignée.
          </p>
        </div>


        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-heading/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, email, entreprise..."
              className="w-full rounded-lg border border-border bg-surface py-2.5 pl-11 pr-4 text-sm text-heading placeholder:text-body/50 outline-none transition-all focus:border-purple/50 focus:bg-surface"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-body/50">
              {lastRefresh && `Maj ${lastRefresh.toLocaleTimeString("fr-FR")}`}
            </span>
            <button
              onClick={fetchRegistrations}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-body transition-all hover:border-purple/20 hover:text-heading"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
              </svg>
              Rafraichir
            </button>
            <button
              onClick={handleExportCSV}
              disabled={registrations.length === 0}
              className="flex items-center gap-1.5 rounded-lg bg-purple px-3.5 py-2 text-xs font-bold text-cream transition-all hover:bg-purple-light hover:shadow-lg hover:shadow-purple/20 disabled:opacity-40"
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
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20">
            <Image src="/images/mascotte/mascotte2.png" alt="" width={140} height={140} className="mb-5 h-24 w-auto opacity-30" />
            <p className="text-base font-medium text-body/50">Aucune inscription pour le moment</p>
            <p className="mt-1.5 text-sm text-heading/15">Les inscriptions apparaitront ici en temps réel</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            {/* Desktop table */}
            <div className="hidden sm:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-body/50">#</th>
                    <th className="cursor-pointer px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-body/50 hover:text-body" onClick={() => handleSort("name")}>
                      Nom <SortIcon col="name" />
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-body/50">Type</th>
                    <th className="cursor-pointer px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-body/50 hover:text-body" onClick={() => handleSort("email")}>
                      Email <SortIcon col="email" />
                    </th>
                    <th className="cursor-pointer px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-body/50 hover:text-body" onClick={() => handleSort("company")}>
                      Organisation <SortIcon col="company" />
                    </th>
                    <th className="cursor-pointer px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-body/50 hover:text-body" onClick={() => handleSort("date")}>
                      Date <SortIcon col="date" />
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-body/50">Email Status</th>
                    <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-body/50">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((r, i) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedReg(selectedReg?.id === r.id ? null : r)}
                      className={`cursor-pointer transition-all ${newIds.has(r.id)
                        ? "animate-pulse bg-purple/10"
                        : selectedReg?.id === r.id
                          ? "bg-purple/5"
                          : "hover:bg-surface"
                        }`}
                    >
                      <td className="px-4 py-3 text-heading/20">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple/10 text-xs font-bold text-purple">
                            {r.firstName[0]}{r.lastName[0]}
                          </div>
                          <span className="font-medium text-heading">{r.firstName} {r.lastName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.type === "etudiant" ? "bg-blue-500/10 text-blue-400" : "bg-purple/10 text-purple"}`}>
                          {r.type === "etudiant" ? "Étudiant" : "Entreprise"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${r.email}`} onClick={(e) => e.stopPropagation()} className="text-purple/80 transition-colors hover:text-purple">
                          {r.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-body">{r.type === "etudiant" ? (r.school || "—") : (r.company || "—")}{r.role ? ` — ${r.role}` : ""}</td>
                      <td className="px-4 py-3 text-body/50">
                        {new Date(r.registeredAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {r.emailStatus === 'sent' ? (
                            <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-500">
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                              </svg>
                              {r.emailProvider === 'ovh' ? 'OVH' : 'Resend'}
                            </span>
                          ) : r.emailStatus === 'error' ? (
                            <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-500" title={r.emailError}>
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                              </svg>
                              Error
                            </span>
                          ) : (
                            <span className="rounded-full bg-heading/10 px-2 py-0.5 text-[10px] font-bold text-body/50">
                              ...
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        {deleteConfirm === r.id ? (
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleDelete(r.id)} className="rounded-md bg-red-500/10 px-2.5 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/20">
                              Supprimer
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className="rounded-md px-2.5 py-1 text-xs text-body/50 transition-colors hover:bg-surface">
                              Non
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(r.id)} className="rounded-md p-1.5 text-heading/15 transition-all hover:bg-red-500/10 hover:text-red-400" title="Supprimer">
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
            <div className="divide-y divide-border sm:hidden">
              {filtered.map((r, i) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedReg(selectedReg?.id === r.id ? null : r)}
                  className={`p-4 transition-all ${newIds.has(r.id) ? "animate-pulse bg-purple/10" : selectedReg?.id === r.id ? "bg-purple/5" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple/10 text-xs font-bold text-purple">
                        {r.firstName[0]}{r.lastName[0]}
                      </div>
                      <div>
                        <span className="mr-1.5 text-[10px] text-heading/20">#{i + 1}</span>
                        <span className="font-medium text-heading">{r.firstName} {r.lastName}</span>
                      </div>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      {deleteConfirm === r.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => handleDelete(r.id)} className="rounded-md bg-red-500/10 px-2 py-1 text-xs text-red-400">Suppr</button>
                          <button onClick={() => setDeleteConfirm(null)} className="rounded-md px-2 py-1 text-xs text-body/50">Non</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(r.id)}
                          aria-label="Confirmer la suppression"
                          title="Supprimer"
                          className="text-heading/15 hover:text-red-400"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <a href={`mailto:${r.email}`} onClick={(e) => e.stopPropagation()} className="mt-1.5 block text-sm text-purple/70">{r.email}</a>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-body/50">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.type === "etudiant" ? "bg-blue-500/10 text-blue-400" : "bg-purple/10 text-purple"}`}>
                      {r.type === "etudiant" ? "Étudiant" : "Entreprise"}
                    </span>
                    {r.type === "etudiant" ? r.school && <span>{r.school}</span> : r.company && <span>{r.company}</span>}
                    {r.role && <span>{r.role}</span>}
                    <span>
                      {new Date(r.registeredAt).toLocaleDateString("fr-FR", {
                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                    {r.emailStatus === 'sent' ? (
                      <span className="font-bold text-green-500 flex items-center gap-1">
                        <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                        {r.emailProvider === 'ovh' ? 'OVH' : 'Resend'}
                      </span>
                    ) : (
                      <span className="font-bold text-red-400">Email Fail</span>
                    )}
                  </div>

                  {/* Expanded detail */}
                  {selectedReg?.id === r.id && r.message && (
                    <div className="mt-3 rounded-lg border border-border bg-surface p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-body/50">Message</p>
                      <p className="mt-1 text-xs italic text-body">&ldquo;{r.message}&rdquo;</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detail panel — desktop */}
        {selectedReg && (
          <div className="mt-4 hidden rounded-xl border border-purple/20 bg-purple/[0.03] p-5 sm:block sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple/10 text-lg font-bold text-purple">
                  {selectedReg.firstName[0]}{selectedReg.lastName[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-heading">{selectedReg.firstName} {selectedReg.lastName}</h3>
                  <p className="text-sm text-body">
                    <span className={`mr-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${selectedReg.type === "etudiant" ? "bg-blue-500/10 text-blue-400" : "bg-purple/10 text-purple"}`}>
                      {selectedReg.type === "etudiant" ? "Étudiant" : "Entreprise"}
                    </span>
                    {selectedReg.type === "etudiant"
                      ? selectedReg.school && selectedReg.school
                      : <>
                        {selectedReg.company && `${selectedReg.company}`}
                        {selectedReg.company && selectedReg.role && " — "}
                        {selectedReg.role && selectedReg.role}
                      </>
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                aria-label="Fermer le détail"
                title="Fermer le détail"
                className="rounded-md p-1 text-heading/20 hover:text-body"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-body/50">Email</p>
                <a href={`mailto:${selectedReg.email}`} className="mt-1 block text-sm text-purple">{selectedReg.email}</a>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-body/50">Date d&apos;inscription</p>
                <p className="mt-1 text-sm text-body">
                  {new Date(selectedReg.registeredAt).toLocaleDateString("fr-FR", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-body/50">ID</p>
                <p className="mt-1 font-mono text-xs text-body/50">{selectedReg.id.slice(0, 8)}...</p>
              </div>
            </div>
            {selectedReg.message && (
              <div className="mt-4 rounded-lg border border-border bg-surface p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-body/50">Message</p>
                <p className="mt-1.5 text-sm italic text-body">&ldquo;{selectedReg.message}&rdquo;</p>
              </div>
            )}
            {selectedReg.emailError && (
              <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-red-400">Détails de l&apos;erreur d&apos;envoi</p>
                <p className="mt-1.5 font-mono text-xs text-red-400/80">{selectedReg.emailError}</p>
              </div>
            )}
          </div>
        )}

        {searchQuery && (
          <p className="mt-3 text-xs text-body/50">
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} sur {registrations.length} inscription{registrations.length !== 1 ? "s" : ""}
          </p>
        )}
      </main>
    </div>
  );
}

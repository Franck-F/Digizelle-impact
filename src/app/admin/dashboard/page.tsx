"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

const REFRESH_INTERVAL = 8000;

function normalizeSchoolName(rawSchool: string): string {
  const school = rawSchool.trim();
  if (!school) return school;

  const lowerSchool = school.toLowerCase();
  if (lowerSchool === "epita") return "Epita";
  if (lowerSchool === "epitech" || lowerSchool === "epitech paris") return "Epitech";

  return school;
}

function getBarWidthClass(percentage: number): string {
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
}

function getBarHeightClass(percentage: number): string {
  if (percentage >= 100) return "h-28";
  if (percentage >= 85) return "h-24";
  if (percentage >= 70) return "h-20";
  if (percentage >= 58) return "h-16";
  if (percentage >= 50) return "h-16";
  if (percentage >= 42) return "h-14";
  if (percentage >= 33) return "h-12";
  if (percentage >= 25) return "h-10";
  if (percentage >= 17) return "h-8";
  if (percentage > 0) return "h-6";
  return "h-1";
}

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showAllSchools, setShowAllSchools] = useState(false);

  const fetchRegistrations = useCallback(async () => {
    const storedToken = sessionStorage.getItem("admin-token");
    if (!storedToken) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        headers: { Authorization: `Bearer ${storedToken}` },
        cache: "no-store",
      });
      const data = await res.json();

      if (!data.registrations) {
        sessionStorage.removeItem("admin-token");
        setIsAuthenticated(false);
        setError("Session expirée. Merci de vous reconnecter.");
      } else {
        setIsAuthenticated(true);
        setRegistrations(data.registrations as Registration[]);
        setLastRefresh(new Date());
      }
    } catch {
      setError("Erreur de chargement des données.");
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

  const metrics = useMemo(() => {
    const total = registrations.length;
    const studentCount = registrations.filter((r) => r.type === "etudiant").length;
    const companyCount = registrations.filter((r) => r.type !== "etudiant").length;
    const recentCount = registrations.filter(
      (r) => Date.now() - new Date(r.registeredAt).getTime() < 86400000
    ).length;

    const sentCount = registrations.filter((r) => r.emailStatus === "sent").length;
    const failedCount = registrations.filter((r) => r.emailStatus === "failed").length;
    const pendingCount = registrations.filter((r) => r.emailStatus !== "sent" && r.emailStatus !== "failed").length;

    const deliveryRate = total > 0 ? (sentCount / total) * 100 : 0;

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
      .map(([school, count]) => ({
        label: school,
        count,
        percentage: totalStudentWithSchool > 0 ? (count / totalStudentWithSchool) * 100 : 0,
      }));

    const companyCounts = registrations
      .filter((r) => (r.company || "").trim().length > 0)
      .reduce<Record<string, number>>((acc, r) => {
        const company = r.company.trim();
        acc[company] = (acc[company] || 0) + 1;
        return acc;
      }, {});

    const totalWithCompany = Object.values(companyCounts).reduce((sum, count) => sum + count, 0);

    const topCompanies = Object.entries(companyCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([company, count]) => ({
        label: company,
        count,
        percentage: totalWithCompany > 0 ? (count / totalWithCompany) * 100 : 0,
      }));

    const byDayMap = new Map<string, number>();
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      byDayMap.set(key, 0);
    }

    registrations.forEach((r) => {
      const key = new Date(r.registeredAt).toISOString().slice(0, 10);
      if (byDayMap.has(key)) {
        byDayMap.set(key, (byDayMap.get(key) || 0) + 1);
      }
    });

    const dayEntries = Array.from(byDayMap.entries()).map(([key, count]) => ({
      key,
      count,
      shortLabel: new Date(`${key}T00:00:00`).toLocaleDateString("fr-FR", {
        weekday: "short",
      }),
    }));

    const maxDayCount = Math.max(...dayEntries.map((d) => d.count), 1);

    const registrationsByDay = dayEntries.map((d) => ({
      ...d,
      percentage: (d.count / maxDayCount) * 100,
    }));

    return {
      total,
      recentCount,
      studentCount,
      companyCount,
      sentCount,
      failedCount,
      pendingCount,
      deliveryRate,
      topSchools,
      topCompanies,
      totalStudentWithSchool,
      registrationsByDay,
    };
  }, [registrations]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="flex items-center gap-2 text-sm text-body">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Chargement du dashboard...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream p-4">
        <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 text-center sm:p-8">
          <Image src="/images/mascotte/mascotte3.png" alt="Digizelle" width={72} height={72} className="mx-auto mb-4 h-16 w-auto" />
          <h1 className="font-serif text-2xl font-bold text-heading">Accès dashboard</h1>
          <p className="mt-2 text-sm text-body">{error || "Connecte-toi d'abord au back office pour voir les graphiques."}</p>
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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Image src="/images/mascotte/mascotte3.png" alt="Digizelle" width={36} height={36} className="h-8 w-auto" />
            <div>
              <h1 className="text-sm font-bold sm:text-base">Dashboard Analytics</h1>
              <p className="text-[11px] text-body/60 sm:text-xs">Digizelle Impact Event 2026</p>
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
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:grid-cols-4 sm:gap-4">
          <MetricCard label="Inscriptions" value={metrics.total} accent="text-purple" />
          <MetricCard label="24 dernières h" value={metrics.recentCount} accent="text-purple-dark" />
          <MetricCard label="Étudiants" value={metrics.studentCount} accent="text-blue-500" />
          <MetricCard label="Entreprises" value={metrics.companyCount} accent="text-orange-500" />
        </div>

        <div className="mb-6 grid gap-4 sm:mb-8 lg:grid-cols-2">
          <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-heading sm:text-base">Répartition des écoles (étudiants)</h2>
                <p className="mt-1 text-xs text-body/60">
                  Base : {metrics.totalStudentWithSchool} étudiant{metrics.totalStudentWithSchool > 1 ? "s" : ""} avec école renseignée — {metrics.topSchools.length} école{metrics.topSchools.length > 1 ? "s" : ""}
                </p>
              </div>
              {metrics.topSchools.length > 6 && (
                <button
                  onClick={() => setShowAllSchools(!showAllSchools)}
                  className="shrink-0 rounded-lg border border-border bg-cream px-3 py-1.5 text-xs font-medium text-purple transition-all hover:bg-cream-dark"
                >
                  {showAllSchools ? "Voir moins" : "Voir tout"}
                </button>
              )}
            </div>

            {metrics.topSchools.length === 0 ? (
              <p className="mt-4 text-sm text-body/60">Aucune donnée école disponible.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {(showAllSchools ? metrics.topSchools : metrics.topSchools.slice(0, 6)).map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <p className="truncate text-xs font-medium text-heading sm:text-sm">{item.label}</p>
                      <p className="text-xs font-semibold text-purple sm:text-sm">{item.percentage.toFixed(1)}%</p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-cream-dark">
                      <div className={`h-full rounded-full bg-purple ${getBarWidthClass(item.percentage)}`} />
                    </div>
                    <p className="mt-1 text-[10px] text-body/60 sm:text-xs">{item.count} inscrits</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-heading sm:text-base">Répartition complète des entreprises</h2>
            <p className="mt-1 text-xs text-body/60">Toutes les entreprises avec au moins une inscription</p>

            {metrics.topCompanies.length === 0 ? (
              <p className="mt-4 text-sm text-body/60">Aucune donnée entreprise disponible.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {metrics.topCompanies.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <p className="truncate text-xs font-medium text-heading sm:text-sm">{item.label}</p>
                      <p className="text-xs font-semibold text-purple-dark sm:text-sm">{item.percentage.toFixed(1)}%</p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-cream-dark">
                      <div className={`h-full rounded-full bg-purple-dark ${getBarWidthClass(item.percentage)}`} />
                    </div>
                    <p className="mt-1 text-[10px] text-body/60 sm:text-xs">{item.count} inscrits</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-heading sm:text-base">Email</h2>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-green-500/10 p-3">
                <p className="text-[10px] uppercase tracking-wider text-green-700">Livrés</p>
                <p className="mt-1 font-serif text-xl font-bold text-green-600">{metrics.sentCount}</p>
              </div>
              <div className="rounded-lg bg-red-500/10 p-3">
                <p className="text-[10px] uppercase tracking-wider text-red-700">Échecs</p>
                <p className="mt-1 font-serif text-xl font-bold text-red-500">{metrics.failedCount}</p>
              </div>
              <div className="rounded-lg bg-orange-500/10 p-3">
                <p className="text-[10px] uppercase tracking-wider text-orange-700">En attente</p>
                <p className="mt-1 font-serif text-xl font-bold text-orange-500">{metrics.pendingCount}</p>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs text-body/70">Taux de livraison</p>
                <p className="text-sm font-semibold text-purple">{metrics.deliveryRate.toFixed(1)}%</p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-cream-dark">
                <div className={`h-full rounded-full bg-purple ${getBarWidthClass(metrics.deliveryRate)}`} />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-heading sm:text-base">Tendance inscriptions (7 jours)</h2>
            <p className="mt-1 text-xs text-body/60">Volume quotidien d&apos;inscriptions</p>

            <div className="mt-4 flex h-36 items-end justify-between gap-2 rounded-lg bg-cream/50 px-3 py-3">
              {metrics.registrationsByDay.map((day) => (
                <div key={day.key} className="flex flex-1 flex-col items-center justify-end gap-1">
                  <div className="text-[10px] text-body/60">{day.count}</div>
                  <div className={`w-full max-w-8 rounded-t-sm bg-purple/80 ${getBarHeightClass(day.percentage)}`} />
                  <div className="text-[10px] uppercase text-body/70">{day.shortLabel.slice(0, 3)}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <p className="mt-5 text-[11px] text-body/50">
          Dernière mise à jour : {lastRefresh ? lastRefresh.toLocaleTimeString("fr-FR") : "-"}
        </p>
      </main>
    </div>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-body/50 sm:text-xs">{label}</p>
      <p className={`mt-1 font-serif text-2xl font-bold sm:text-3xl ${accent}`}>{value}</p>
    </div>
  );
}

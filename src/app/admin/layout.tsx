import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Back Office — Digizelle Impact 2026",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

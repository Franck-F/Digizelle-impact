import type { Metadata } from "next";
import { Playfair_Display, Signika_Negative } from "next/font/google";
import { ThemeProvider } from "@/lib/theme";
import { LayoutShell } from "@/components/layout/LayoutShell";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const signika = Signika_Negative({
  variable: "--font-signika-negative",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Digizelle Impact Event 2026 — Leadership & Innovation",
    template: "%s | Digizelle Impact 2026",
  },
  description:
    "Leadership & Innovation : construire l'avenir ensemble. 13 Mars 2026, Paris. Un événement élégant réunissant les leaders de la tech.",
  keywords: [
    "Digizelle",
    "Impact Event",
    "Leadership",
    "Innovation",
    "Tech",
    "Paris",
    "2026",
    "Conférence",
  ],
  openGraph: {
    title: "Digizelle Impact Event 2026",
    description:
      "Leadership & Innovation : construire l'avenir ensemble. 13 Mars 2026, Paris.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("digizelle-theme");if(t!=="light")document.documentElement.classList.add("dark")}catch(e){document.documentElement.classList.add("dark")}`,
          }}
        />
      </head>
      <body
        className={`${playfair.variable} ${signika.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <LayoutShell>{children}</LayoutShell>
        </ThemeProvider>
      </body>
    </html>
  );
}

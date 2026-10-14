import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/shell/app-shell";
import { getSidebarCounts } from "@/lib/stats";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "eletto — Auditoria e Inteligência Eleitoral",
  description:
    "Plataforma de inteligência de dados eleitorais. Auditoria de relações, doações, empresas e patrimônio de candidatos e agentes públicos brasileiros (2014–2026).",
};

// Runs before hydration so a saved theme applies with no flash.
const THEME_INIT_SCRIPT = `
try {
  var t = localStorage.getItem("theme");
  document.documentElement.setAttribute("data-theme", (t === "light" || t === "dark") ? t : "dark");
} catch (e) {}
`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const counts = await getSidebarCounts();

  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full bg-background text-foreground font-sans">
        <AppShell counts={counts}>{children}</AppShell>
      </body>
    </html>
  );
}

"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { SidebarCounts } from "@/lib/stats";
import { ShellProvider } from "./shell-context";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { AuthProvider } from "@/components/auth/auth-context";
import { AuthModal } from "@/components/auth/auth-modal";
import { Footer } from "./footer";

export function AppShell({ counts, children }: { counts: SidebarCounts; children: ReactNode }) {
  const pathname = usePathname();
  const isFullScreenDoc = pathname?.includes("/dossie") || pathname?.includes("/peca-juridica");

  if (isFullScreenDoc) {
    return (
      <AuthProvider>
        <ShellProvider>
          <div className="min-h-screen bg-[var(--bg)]">{children}</div>
          <AuthModal />
        </ShellProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <ShellProvider>
        <div className="shell-layout">
          <Sidebar counts={counts} />
          <div className="shell-main">
            <Topbar />
            <ContentBody>{children}</ContentBody>
          </div>
        </div>
        <AuthModal />
      </ShellProvider>
    </AuthProvider>
  );
}

function ContentBody({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/grafo")) {
    return (
      <div
        className="flex flex-col w-full bg-[var(--bg)]"
        style={{ height: "calc(100vh - var(--navbar-offset))" }}
      >
        {children}
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--navbar-offset))]">
      <div className="content__inner flex-1">{children}</div>
      <Footer />
    </div>
  );
}

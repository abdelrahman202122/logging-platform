"use client";

import { LayoutDashboard } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { useAuth } from "@/components/auth/auth-provider";

export function DashboardHeader() {
  const { developer } = useAuth();

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm text-muted-foreground">
              {developer?.email ?? "Logging Platform"}
            </p>
            <h1 className="truncate text-lg font-semibold">Dashboard</h1>
          </div>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}

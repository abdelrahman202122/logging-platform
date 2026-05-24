"use client";

import { LayoutDashboard } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { useAuth } from "@/components/auth/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { developer } = useAuth();

  return (
    <main className="min-h-svh bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Logging Platform</p>
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
          </div>
          <LogoutButton />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>
              Welcome{developer?.username ? `, ${developer.username}` : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            Authentication and protected routing are ready. The account API key
            panel comes in the next reviewed step.
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

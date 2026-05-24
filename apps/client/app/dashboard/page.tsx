"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { AccountApiKeyCard } from "@/components/dashboard/account-api-key-card";
import { ApplicationsSection } from "@/components/dashboard/applications-section";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function DashboardPage() {
  const { developer } = useAuth();

  return (
    <main className="min-h-svh bg-muted/30">
      <DashboardHeader />

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-8">
        {developer ? <AccountApiKeyCard developer={developer} /> : null}
        <ApplicationsSection />
      </section>
    </main>
  );
}

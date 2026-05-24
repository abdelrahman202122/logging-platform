import Link from "next/link";
import { ArrowRight, BarChart3, KeyRound, ListFilter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-svh bg-background">
      <section className="mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-center px-6 py-12">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase text-muted-foreground">
            Logging Platform
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-foreground sm:text-5xl">
            Manage applications and investigate logs from one focused dashboard.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            The frontend foundation is ready for auth, API key visibility,
            application management, and searchable log tables.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/login">
                Login
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/register">Create account</Link>
            </Button>
          </div>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <KeyRound className="size-5 text-primary" />
              <CardTitle>Account API key</CardTitle>
            </CardHeader>
            <CardContent>
              View and copy the developer API key once authentication is wired.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <BarChart3 className="size-5 text-primary" />
              <CardTitle>Applications</CardTitle>
            </CardHeader>
            <CardContent>
              Create, inspect, and delete applications connected to the account.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <ListFilter className="size-5 text-primary" />
              <CardTitle>Logs</CardTitle>
            </CardHeader>
            <CardContent>
              Filter by level, search messages, and sort by recency or count.
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

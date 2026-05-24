"use client";

import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { ApplicationLogsTable } from "@/components/dashboard/application-logs-table";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api, ApiError } from "@/lib/api";
import { formatDateTime } from "@/lib/date";
import { routes } from "@/lib/routes";
import type { Application } from "@/lib/types";

type ApplicationDetailViewProps = {
  applicationName: string;
};

export function ApplicationDetailView({
  applicationName,
}: ApplicationDetailViewProps) {
  const [application, setApplication] = React.useState<Application | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isActive = true;

    const loadApplication = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextApplication = await api.application(applicationName);
        if (!isActive) {
          return;
        }
        setApplication(nextApplication);
      } catch (loadError) {
        if (!isActive) {
          return;
        }
        setError(
          loadError instanceof ApiError
            ? loadError.message
            : "Unable to load application.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadApplication();

    return () => {
      isActive = false;
    };
  }, [applicationName]);

  return (
    <main className="min-h-svh bg-muted/30">
      <DashboardHeader />

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-8">
        <div>
          <Button asChild size="sm" variant="outline">
            <Link href={routes.dashboard}>
              <ArrowLeft />
              Applications
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="flex items-center gap-2 p-6">
              <Loader2 className="size-4 animate-spin" />
              Loading application
            </CardContent>
          </Card>
        ) : null}

        {error ? (
          <Card>
            <CardContent className="flex items-center gap-2 p-6 text-destructive">
              <AlertCircle className="size-4" />
              {error}
            </CardContent>
          </Card>
        ) : null}

        {application ? (
          <>
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <CardTitle>{application.name}</CardTitle>
                    <CardDescription>
                      Application details and aggregated log events.
                    </CardDescription>
                  </div>
                  <Badge variant="outline">Application</Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 text-foreground sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="mt-1 font-medium">
                    {formatDateTime(application.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Updated</p>
                  <p className="mt-1 font-medium">
                    {formatDateTime(application.updatedAt)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <ApplicationLogsTable applicationName={application.name} />
          </>
        ) : null}
      </section>
    </main>
  );
}

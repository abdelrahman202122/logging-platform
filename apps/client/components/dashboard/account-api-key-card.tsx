"use client";

import { Check, Copy, Eye, EyeOff, KeyRound, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Developer } from "@/lib/types";
import { formatDateTime } from "@/lib/date";

type AccountApiKeyCardProps = {
  developer: Developer;
};

const maskApiKey = (apiKey?: string) => {
  if (!apiKey) {
    return "Not available";
  }

  if (apiKey.length <= 8) {
    return "*".repeat(apiKey.length);
  }

  return `${apiKey.slice(0, 4)}${"*".repeat(12)}${apiKey.slice(-4)}`;
};

export function AccountApiKeyCard({ developer }: AccountApiKeyCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const displayedApiKey = useMemo(
    () =>
      isVisible
        ? developer.apiKey ?? "Not available"
        : maskApiKey(developer.apiKey),
    [developer.apiKey, isVisible],
  );

  const copyApiKey = async () => {
    if (!developer.apiKey) {
      return;
    }

    await navigator.clipboard.writeText(developer.apiKey);
    setHasCopied(true);
    window.setTimeout(() => setHasCopied(false), 1600);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Developer identity and API key for log ingestion.
            </CardDescription>
          </div>
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <UserRound className="size-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 text-foreground">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Username</p>
            <p className="mt-1 font-medium">{developer.username}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="mt-1 break-all font-medium">{developer.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="mt-1 font-medium">
              {formatDateTime(developer.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Updated</p>
            <p className="mt-1 font-medium">
              {formatDateTime(developer.updatedAt)}
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="mb-3 flex items-center gap-2">
            <KeyRound className="size-4 text-muted-foreground" />
            <p className="text-sm font-medium">API key</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <code className="min-w-0 flex-1 break-all rounded-md border bg-background px-3 py-2 text-sm">
              {displayedApiKey}
            </code>
            <div className="flex gap-2">
              <Button
                aria-label={isVisible ? "Hide API key" : "Show API key"}
                disabled={!developer.apiKey}
                onClick={() => setIsVisible((current) => !current)}
                size="icon"
                type="button"
                variant="outline"
              >
                {isVisible ? <EyeOff /> : <Eye />}
              </Button>
              <Button
                disabled={!developer.apiKey}
                onClick={copyApiKey}
                type="button"
                variant="outline"
              >
                {hasCopied ? <Check /> : <Copy />}
                {hasCopied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useParams } from "next/navigation";

import { ApplicationDetailView } from "@/components/dashboard/application-detail-view";

export default function ApplicationPage() {
  const params = useParams<{ name: string }>();
  const applicationName = decodeURIComponent(params.name);

  return <ApplicationDetailView applicationName={applicationName} />;
}

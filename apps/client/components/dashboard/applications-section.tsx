'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { api, ApiError } from '@/lib/api';
import { formatDateTime } from '@/lib/date';
import { routes } from '@/lib/routes';
import type { Application } from '@/lib/types';
import { applicationSchema } from '@/lib/validation';

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export function ApplicationsSection() {
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [deletingName, setDeletingName] = React.useState<string | null>(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: '',
    },
  });

  const loadApplications = React.useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const nextApplications = await api.applications();
      setApplications(nextApplications);
    } catch (error) {
      setLoadError(
        error instanceof ApiError
          ? error.message
          : 'Unable to load applications.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let isActive = true;

    const loadInitialApplications = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const nextApplications = await api.applications();
        if (!isActive) {
          return;
        }
        setApplications(nextApplications);
      } catch (error) {
        if (!isActive) {
          return;
        }
        setLoadError(
          error instanceof ApiError
            ? error.message
            : 'Unable to load applications.',
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadInitialApplications();

    return () => {
      isActive = false;
    };
  }, []);

  const createApplication = handleSubmit(async (values) => {
    setFormError(null);

    try {
      const application = await api.createApplication(values);
      setApplications((current) => [application, ...current]);
      reset();
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : 'Unable to create application.',
      );
    }
  });

  const deleteApplication = async (application: Application) => {
    setDeletingName(application.name);
    setLoadError(null);

    try {
      await api.deleteApplication(application.name);
      setApplications((current) =>
        current.filter((item) => item._id !== application._id),
      );
    } catch (error) {
      setLoadError(
        error instanceof ApiError
          ? error.message
          : 'Unable to delete application.',
      );
    } finally {
      setDeletingName(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle>Applications</CardTitle>
            <CardDescription>
              Create and manage the applications sending logs to this account.
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {applications.length} {applications.length === 1 ? 'app' : 'apps'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form
          className="grid gap-3 rounded-lg border bg-muted/30 p-4 md:grid-cols-[1fr_auto]"
          onSubmit={createApplication}
        >
          <div className="space-y-2">
            <Label htmlFor="application-name">Application name</Label>
            <Input
              id="application-name"
              placeholder="billing-service"
              aria-invalid={Boolean(errors.name)}
              {...register('name')}
            />
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            ) : null}
            {formError ? (
              <p className="text-sm text-destructive">{formError}</p>
            ) : null}
          </div>
          <Button
            className="self-end"
            disabled={isSubmitting}
            size="lg"
            type="submit"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus />}
            Create
          </Button>
        </form>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium text-foreground">
              Your applications
            </h2>
            <Button
              disabled={isLoading}
              onClick={() => void loadApplications()}
              size="sm"
              type="button"
              variant="outline"
            >
              <RefreshCw className={isLoading ? 'animate-spin' : undefined} />
              Refresh
            </Button>
          </div>

          {loadError ? (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="size-4" />
              {loadError}
            </div>
          ) : null}

          {isLoading ? <ApplicationsLoadingState /> : null}

          {!isLoading && applications.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-background p-8 text-center text-sm text-muted-foreground">
              No applications yet. Create the first one above.
            </div>
          ) : null}

          {!isLoading && applications.length > 0 ? (
            <div className="divide-y rounded-lg border bg-background">
              {applications.map((application) => (
                <ApplicationRow
                  application={application}
                  isDeleting={deletingName === application.name}
                  key={application._id}
                  onDelete={deleteApplication}
                />
              ))}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function ApplicationsLoadingState() {
  return (
    <div className="rounded-lg border bg-background p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading applications
      </div>
    </div>
  );
}

type ApplicationRowProps = {
  application: Application;
  isDeleting: boolean;
  onDelete: (application: Application) => void;
};

function ApplicationRow({
  application,
  isDeleting,
  onDelete,
}: ApplicationRowProps) {
  return (
    <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <Link
          className="inline-flex max-w-full items-center gap-2 font-medium text-foreground hover:underline"
          href={routes.application(application.name)}
        >
          <span className="truncate">{application.name}</span>
          <ArrowRight className="size-4 shrink-0" />
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">
          Created {formatDateTime(application.createdAt)}
        </p>
      </div>
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href={routes.application(application.name)}>View</Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={isDeleting}
              size="sm"
              type="button"
              variant="destructive"
            >
              {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
              Delete
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete application?</AlertDialogTitle>

              <AlertDialogDescription>
                This will permanently delete{' '}
                <span className="font-medium text-foreground">
                  {application.name}
                </span>{' '}
                and all associated logs.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  onClick={() => onDelete(application)}
                  className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

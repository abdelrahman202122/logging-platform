import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthFormCardProps = {
  title: string;
  description: string;
  footerLabel: string;
  footerHref: string;
  footerAction: string;
  children: React.ReactNode;
};

export function AuthFormCard({
  title,
  description,
  footerLabel,
  footerHref,
  footerAction,
  children,
}: AuthFormCardProps) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 px-6 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {footerLabel}{" "}
            <Link className="font-medium text-foreground underline" href={footerHref}>
              {footerAction}
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

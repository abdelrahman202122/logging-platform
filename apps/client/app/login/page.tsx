import { AuthFormCard } from "@/components/auth/auth-form-card";
import { LoginForm } from "@/components/auth/login-form";
import { routes } from "@/lib/routes";

export default function LoginPage() {
  return (
    <AuthFormCard
      title="Login"
      description="Access your applications, API key, and log activity."
      footerLabel="No account yet?"
      footerHref={routes.register}
      footerAction="Create one"
    >
      <LoginForm />
    </AuthFormCard>
  );
}

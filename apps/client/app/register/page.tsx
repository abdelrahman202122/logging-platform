import { AuthFormCard } from "@/components/auth/auth-form-card";
import { RegisterForm } from "@/components/auth/register-form";
import { routes } from "@/lib/routes";

export default function RegisterPage() {
  return (
    <AuthFormCard
      title="Create account"
      description="Register as an application developer."
      footerLabel="Already have an account?"
      footerHref={routes.login}
      footerAction="Login"
    >
      <RegisterForm />
    </AuthFormCard>
  );
}

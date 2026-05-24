"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.replace(routes.login);
  };

  return (
    <Button
      disabled={isLoggingOut}
      onClick={handleLogout}
      size="sm"
      type="button"
      variant="outline"
    >
      <LogOut />
      Logout
    </Button>
  );
}

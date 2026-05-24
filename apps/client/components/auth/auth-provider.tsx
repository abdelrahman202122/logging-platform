"use client";

import * as React from "react";

import { api, ApiError } from "@/lib/api";
import type { Developer, LoginPayload, RegisterPayload } from "@/lib/types";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  developer: Developer | null;
  status: AuthStatus;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshDeveloper: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [developer, setDeveloper] = React.useState<Developer | null>(null);
  const [status, setStatus] = React.useState<AuthStatus>("loading");

  const refreshDeveloper = React.useCallback(async () => {
    try {
      const currentDeveloper = await api.me();
      setDeveloper(currentDeveloper);
      setStatus("authenticated");
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) {
        console.error(error);
      }
      setDeveloper(null);
      setStatus("unauthenticated");
    }
  }, []);

  React.useEffect(() => {
    let isActive = true;

    const loadDeveloper = async () => {
      try {
        const currentDeveloper = await api.me();
        if (!isActive) {
          return;
        }
        setDeveloper(currentDeveloper);
        setStatus("authenticated");
      } catch (error) {
        if (!(error instanceof ApiError) || error.status !== 401) {
          console.error(error);
        }
        if (!isActive) {
          return;
        }
        setDeveloper(null);
        setStatus("unauthenticated");
      }
    };

    void loadDeveloper();

    return () => {
      isActive = false;
    };
  }, []);

  const login = React.useCallback(async (payload: LoginPayload) => {
    const { developer: loggedInDeveloper } = await api.login(payload);
    setDeveloper(loggedInDeveloper);
    setStatus("authenticated");
  }, []);

  const register = React.useCallback(async (payload: RegisterPayload) => {
    const { developer: registeredDeveloper } = await api.register(payload);
    setDeveloper(registeredDeveloper);
    setStatus("authenticated");
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setDeveloper(null);
      setStatus("unauthenticated");
    }
  }, []);

  const value = React.useMemo(
    () => ({
      developer,
      status,
      login,
      register,
      logout,
      refreshDeveloper,
    }),
    [developer, login, logout, refreshDeveloper, register, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = React.useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return value;
}

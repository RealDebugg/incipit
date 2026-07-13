"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AppBreadcrumb = {
  label: string;
  href?: string;
};

type AppShellContextValue = {
  breadcrumbs: AppBreadcrumb[];
  setBreadcrumbs: (breadcrumbs: AppBreadcrumb[]) => void;
};

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function AppShellProvider({ children }: { children: ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<AppBreadcrumb[]>([]);

  const value = useMemo(
    () => ({ breadcrumbs, setBreadcrumbs }),
    [breadcrumbs]
  );

  return (
    <AppShellContext.Provider value={value}>
      {children}
    </AppShellContext.Provider>
  );
}

export function useAppShell() {
  const context = useContext(AppShellContext);

  if (!context) {
    throw new Error("useAppShell must be used within AppShellProvider.");
  }

  return context;
}

export function PageBreadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: AppBreadcrumb[];
}) {
  const { setBreadcrumbs } = useAppShell();

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);

    return () => {
      setBreadcrumbs([]);
    };
  }, [breadcrumbs, setBreadcrumbs]);

  return null;
}

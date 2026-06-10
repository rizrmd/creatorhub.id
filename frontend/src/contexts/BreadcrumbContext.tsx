import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

interface BreadcrumbContextValue {
  titles: Record<string, string>;
  setTitle: (pathname: string, title: string | undefined) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [titles, setTitles] = useState<Record<string, string>>({});

  const setTitle = useCallback((pathname: string, title: string | undefined) => {
    setTitles((prev) => {
      if (title === undefined) {
        if (!(pathname in prev)) return prev;
        const next = { ...prev };
        delete next[pathname];
        return next;
      }
      if (prev[pathname] === title) return prev;
      return { ...prev, [pathname]: title };
    });
  }, []);

  const value = useMemo(() => ({ titles, setTitle }), [titles, setTitle]);

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) throw new Error("useBreadcrumb must be used within BreadcrumbProvider");
  return ctx;
}

/** Set the breadcrumb label for the current detail page (cleared on unmount). */
export function useSetBreadcrumbTitle(title: string | undefined) {
  const { pathname } = useLocation();
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle(pathname, title);
    return () => setTitle(pathname, undefined);
  }, [pathname, title, setTitle]);
}
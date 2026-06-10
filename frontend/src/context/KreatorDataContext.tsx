import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  KREATOR_INVITATIONS,
  computeKreatorStats,
  type KreatorInvitation,
} from "@/data/kreatorData";

interface KreatorDataContextValue {
  invitations: KreatorInvitation[];
  stats: ReturnType<typeof computeKreatorStats>;
  respondToInvitation: (id: string, accepted: boolean) => void;
}

const KreatorDataContext = createContext<KreatorDataContextValue | null>(null);

export function KreatorDataProvider({ children }: { children: React.ReactNode }) {
  const [invitations, setInvitations] = useState<KreatorInvitation[]>(() =>
    KREATOR_INVITATIONS.map((i) => ({ ...i })),
  );

  const respondToInvitation = useCallback((id: string, accepted: boolean) => {
    setInvitations((list) =>
      list.map((i) =>
        i.id === id ? { ...i, status: accepted ? "accepted" : "declined" } : i,
      ),
    );
  }, []);

  const stats = useMemo(() => computeKreatorStats(invitations), [invitations]);

  return (
    <KreatorDataContext.Provider value={{ invitations, stats, respondToInvitation }}>
      {children}
    </KreatorDataContext.Provider>
  );
}

export function useKreatorData() {
  const ctx = useContext(KreatorDataContext);
  if (!ctx) throw new Error("useKreatorData must be used within KreatorDataProvider");
  return ctx;
}

/** Safe hook for Sidebar — returns null stats when outside kreator provider */
export function useKreatorStatsOptional() {
  const ctx = useContext(KreatorDataContext);
  return ctx?.stats ?? null;
}
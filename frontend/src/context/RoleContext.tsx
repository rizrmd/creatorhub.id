import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type Role = "brand" | "kreator";

export function roleFromAuth(role?: string): Role {
  return role === "kreator" ? "kreator" : "brand";
}

function readRoleFromToken(): Role | null {
  const token = localStorage.getItem("auth_token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return roleFromAuth(payload.role as string | undefined);
  } catch {
    return null;
  }
}

interface RoleContextValue {
  role: Role;
  effectiveRole: Role;
  canSwitchRole: boolean;
  setRole: (role: Role) => void;
}

export const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [role, setRoleState] = useState<Role>(() => {
    return readRoleFromToken() ?? (localStorage.getItem("ch_role") === "kreator" ? "kreator" : "brand");
  });

  const isKreatorAccount = user?.role === "kreator";

  useEffect(() => {
    if (!user) return;
    const next = roleFromAuth(user.role);
    setRoleState(next);
    localStorage.setItem("ch_role", next);
  }, [user?.id, user?.role]);

  const effectiveRole: Role = isKreatorAccount ? "kreator" : role;
  const canSwitchRole = !isKreatorAccount;

  const setRole = (newRole: Role) => {
    if (isKreatorAccount) return;
    localStorage.setItem("ch_role", newRole);
    setRoleState(newRole);
  };

  const value = useMemo(
    () => ({ role, effectiveRole, canSwitchRole, setRole }),
    [role, effectiveRole, canSwitchRole],
  );

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
}

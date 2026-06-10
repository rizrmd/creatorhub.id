import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type Role = "brand" | "kreator";

function roleFromAuth(role?: string): Role {
  return role === "kreator" ? "kreator" : "brand";
}

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
}

export const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [role, setRoleState] = useState<Role>(() => {
    const stored = localStorage.getItem("ch_role");
    return stored === "kreator" ? "kreator" : "brand";
  });

  useEffect(() => {
    if (!user) return;
    const next = roleFromAuth(user.role);
    setRoleState(next);
    localStorage.setItem("ch_role", next);
  }, [user?.id, user?.role]);

  const setRole = (newRole: Role) => {
    localStorage.setItem("ch_role", newRole);
    setRoleState(newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
}

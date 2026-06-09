import { createContext, useContext, useState } from "react";

export type Role = "brand" | "kreator";

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
}

export const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => {
    const stored = localStorage.getItem("ch_role");
    return stored === "kreator" ? "kreator" : "brand";
  });

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

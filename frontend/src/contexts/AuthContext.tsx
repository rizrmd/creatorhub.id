import { createContext, useContext, useState, ReactNode } from "react";
import { AuthUser, LoginRequest } from "@/types";
import { authApi } from "@/lib/api";
import { roleFromAuth } from "@/context/RoleContext";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function decodeToken(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if ((payload.exp as number) * 1000 < Date.now()) return null;
    return { id: payload.sub, email: payload.email, name: payload.name, role: payload.role };
  } catch {
    return null;
  }
}

function readStoredUser(): AuthUser | null {
  const token = localStorage.getItem("auth_token");
  if (!token) return null;
  const decoded = decodeToken(token);
  if (!decoded) {
    localStorage.removeItem("auth_token");
    return null;
  }
  localStorage.setItem("ch_role", roleFromAuth(decoded.role));
  return decoded;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);
  const [isLoading] = useState(false);

  const login = async (data: LoginRequest) => {
    const res = await authApi.login(data);
    localStorage.setItem("auth_token", res.token);
    localStorage.setItem("ch_role", roleFromAuth(res.user.role));
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("ch_role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

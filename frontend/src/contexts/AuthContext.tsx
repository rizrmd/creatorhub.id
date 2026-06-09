import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthUser, LoginRequest } from "@/types";
import { authApi } from "@/lib/api";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUser(decoded);
      } else {
        localStorage.removeItem("auth_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    const res = await authApi.login(data);
    localStorage.setItem("auth_token", res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
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

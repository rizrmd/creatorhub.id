import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoleProvider } from "@/context/RoleContext";
import "./index.css";
import App from "./App.tsx";

// Bumped to invalidate stale browser/CDN caches of the previous JS bundle.
document.documentElement.dataset.build = "2026-06-10c";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RoleProvider>
          <App />
        </RoleProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);

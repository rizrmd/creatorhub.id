import { useAuth } from "@/contexts/AuthContext";

export function useDisplayUser() {
  const { user } = useAuth();
  const fullName = user?.name?.trim() || "Creator";
  const firstName = fullName.split(/\s+/)[0] || "Creator";
  const initials = fullName
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "C";
  const email = user?.email ?? "";
  const handle = email ? `@${email.split("@")[0]}` : "@creator";

  return { user, fullName, firstName, initials, email, handle };
}
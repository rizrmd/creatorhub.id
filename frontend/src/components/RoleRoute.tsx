import { Navigate } from "react-router-dom";
import { useRole } from "@/context/RoleContext";

export function HomeRedirect() {
  const { effectiveRole } = useRole();
  return (
    <Navigate
      to={effectiveRole === "kreator" ? "/service-hub/kreator/home" : "/service-hub/marketplace"}
      replace
    />
  );
}

export function BrandRoute({ children }: { children: React.ReactNode }) {
  const { effectiveRole } = useRole();
  if (effectiveRole === "kreator") {
    return <Navigate to="/service-hub/kreator/home" replace />;
  }
  return <>{children}</>;
}

export function KreatorRoute({ children }: { children: React.ReactNode }) {
  const { effectiveRole } = useRole();
  if (effectiveRole === "brand") {
    return <Navigate to="/service-hub/marketplace" replace />;
  }
  return <>{children}</>;
}
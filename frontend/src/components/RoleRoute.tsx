import { Navigate } from "react-router-dom";
import { useRole } from "@/context/RoleContext";

export function HomeRedirect() {
  const { effectiveRole } = useRole();
  if (effectiveRole === "kreator") return <Navigate to="/dashboard/kreator/home" replace />;
  if (effectiveRole === "media_monitoring") return <Navigate to="/dashboard/media-monitoring" replace />;
  return <Navigate to="/dashboard/marketplace" replace />;
}

export function BrandRoute({ children }: { children: React.ReactNode }) {
  const { effectiveRole } = useRole();
  if (effectiveRole === "kreator") {
    return <Navigate to="/dashboard/kreator/home" replace />;
  }
  if (effectiveRole === "media_monitoring") {
    return <Navigate to="/dashboard/media-monitoring" replace />;
  }
  if (effectiveRole === "ekrafhub") {
    return <Navigate to="/dashboard/ekrafhub" replace />;
  }
  return <>{children}</>;
}

export function KreatorRoute({ children }: { children: React.ReactNode }) {
  const { effectiveRole } = useRole();
  if (effectiveRole === "brand") {
    return <Navigate to="/dashboard/marketplace" replace />;
  }
  if (effectiveRole === "media_monitoring") {
    return <Navigate to="/dashboard/media-monitoring" replace />;
  }
  return <>{children}</>;
}

export function MediaMonitoringRoute({ children }: { children: React.ReactNode }) {
  const { effectiveRole } = useRole();
  if (effectiveRole !== "media_monitoring" && effectiveRole !== "brand") {
    return <Navigate to="/dashboard/marketplace" replace />;
  }
  return <>{children}</>;
}

export function EkrafHubRoute({ children }: { children: React.ReactNode }) {
  const { effectiveRole } = useRole();
  if (effectiveRole !== "ekrafhub") {
    return <Navigate to="/dashboard/marketplace" replace />;
  }
  return <>{children}</>;
}
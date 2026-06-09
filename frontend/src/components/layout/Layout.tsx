import { Outlet, useLocation, Link } from "react-router-dom";
import { Toaster } from "sonner";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ChevronRight, Home } from "lucide-react";

const PATH_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  marketplace: "Marketplace",
  campaigns: "Campaigns",
  analytics: "Analytics",
  "media-monitoring": "Media Monitoring",
  messages: "Messages",
  payments: "Payments",
  settings: "Settings",
  kreator: "Kreator",
};

function Breadcrumb() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => {
    const path = "/" + segments.slice(0, i + 1).join("/");
    const label = PATH_LABELS[seg] ?? seg;
    const isLast = i === segments.length - 1;
    return { path, label, isLast };
  });

  return (
    <nav className="flex items-center gap-1.5 px-6 py-2 text-xs text-slate-500 border-b border-slate-100 bg-white">
      <Link to="/" className="flex items-center gap-1 hover:text-slate-700 transition-colors">
        <Home className="w-3 h-3" />
      </Link>
      {crumbs.map((c) => (
        <span key={c.path} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3 text-slate-300" />
          {c.isLast ? (
            <span className="font-medium text-slate-700">{c.label}</span>
          ) : (
            <Link to={c.path} className="hover:text-slate-700 transition-colors">{c.label}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}

export default function Layout() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Toaster position="top-right" richColors />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <Breadcrumb />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

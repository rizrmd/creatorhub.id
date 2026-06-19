import { Outlet, useLocation, Link } from "react-router-dom";
import { Toaster } from "sonner";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ChevronRight, Home } from "lucide-react";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { BreadcrumbProvider, useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { KreatorDataProvider } from "@/context/KreatorDataContext";

const PATH_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  marketplace: "Content Creators",
  "homeless-media": "Homeless Media",
  campaigns: "Campaigns",
  analytics: "Analytics",
  "media-monitoring": "Media Monitoring",
  messages: "Messages",
  payments: "Payments",
  settings: "Settings",
  search: "Pencarian",
  "boost-ads": "Boost Ads",
  kreator: "Kreator",
  home: "Home",
  invitations: "Undangan",
  work: "Pekerjaan",
  earnings: "Penghasilan",
  insights: "Insights",
  profile: "Profil",
};

const DYNAMIC_PARENT_SEGMENTS = new Set(["campaigns", "invitations"]);

function isDynamicIdSegment(parentSeg?: string) {
  return !!parentSeg && DYNAMIC_PARENT_SEGMENTS.has(parentSeg);
}

function Breadcrumb() {
  const { pathname } = useLocation();
  const { titles } = useBreadcrumb();
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const pageTitle = titles[pathname];

  const crumbs = segments.map((seg, i) => {
    const path = "/" + segments.slice(0, i + 1).join("/");
    const parentSeg = i > 0 ? segments[i - 1] : undefined;
    const isLast = i === segments.length - 1;
    const isDynamic = isDynamicIdSegment(parentSeg);
    const label = isLast && pageTitle
      ? pageTitle
      : PATH_LABELS[seg] ?? (isDynamic ? "…" : seg);
    return { path, label, isLast };
  });

  return (
    <nav className="flex items-center gap-1.5 px-4 md:px-6 py-2 text-xs text-slate-500 border-b border-slate-100 bg-white overflow-x-auto shrink-0">
      <Link to="/" className="flex items-center gap-1 cursor-pointer hover:text-slate-700 transition-colors">
        <Home className="w-3 h-3" />
      </Link>
      {crumbs.map((c) => (
        <span key={c.path} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3 text-slate-300" />
          {c.isLast ? (
            <span className="font-medium text-slate-700">{c.label}</span>
          ) : (
            <Link to={c.path} className="cursor-pointer hover:text-slate-700 transition-colors">{c.label}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}

function isFullHeightPage(pathname: string) {
  return pathname === "/dashboard/messages" || pathname === "/dashboard/kreator/messages";
}

export default function Layout() {
  const { pathname } = useLocation();
  const fullHeight = isFullHeightPage(pathname);

  return (
    <SidebarProvider>
      <BreadcrumbProvider>
      <KreatorDataProvider>
      <div className="flex h-[100dvh] bg-slate-50 overflow-hidden">
        <Toaster position="top-right" richColors />
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 min-h-0 w-full">
          <Header />
          {!fullHeight && <Breadcrumb />}
          <main className={fullHeight ? "flex-1 min-h-0 overflow-hidden" : "flex-1 min-h-0 overflow-auto"}>
            <Outlet />
          </main>
        </div>
      </div>
      </KreatorDataProvider>
      </BreadcrumbProvider>
    </SidebarProvider>
  );
}

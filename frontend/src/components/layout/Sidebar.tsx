import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  Store, FolderKanban, Radio,
  MessageSquare, CreditCard, Settings, HelpCircle,
  Rocket, Briefcase, Coins, Network,
  Lightbulb, User, Home, Mail, Database, FolderOpen, Sparkles,
  LayoutDashboard, GraduationCap, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRole } from "@/context/RoleContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useKreatorStatsOptional } from "@/context/KreatorDataContext";

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
  badgeKey?: "invitations" | "messages";
}

const brandNavItems: NavItem[] = [
  { to: "/dashboard",                    icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/service-hub",        icon: Network,         label: "Service Hub" },
  { to: "/dashboard/projects",           icon: FolderKanban,    label: "Projects" },
  { to: "/dashboard/marketplace",        icon: Store,           label: "Marketplace" },
  { to: "/dashboard/creator-hub",        icon: FolderOpen,      label: "Creator Hub" },
  { to: "/dashboard/boost-ads",          icon: Rocket,          label: "Boost Ads" },
  { to: "/dashboard/creator-academy",    icon: GraduationCap,   label: "Creator Academy" },
  { to: "/dashboard/database",           icon: Database,        label: "Database" },
  { to: "/dashboard/media-monitoring",   icon: Radio,           label: "Media Monitoring" },
  { to: "/dashboard/ai-support",         icon: Sparkles,        label: "AI Support" },
  { to: "/dashboard/messages",           icon: MessageSquare,   label: "Messages",   badge: 12 },
  { to: "/dashboard/payments",           icon: CreditCard,      label: "Payments" },
  { to: "/dashboard/settings",           icon: Settings,        label: "Settings" },
];

const mediaMonitoringNavItems: NavItem[] = [
  { to: "/dashboard/media-monitoring",   icon: Radio,           label: "Media Monitoring" },
];

const kreatorNavItems: NavItem[] = [
  { to: "/dashboard/kreator/home",        icon: Home,          label: "Home" },
  { to: "/dashboard/kreator/invitations", icon: Mail,          label: "Invitations",   badgeKey: "invitations" as const },
  { to: "/dashboard/kreator/work",        icon: Briefcase,     label: "Work" },
  { to: "/dashboard/kreator/earnings",    icon: Coins,         label: "Earnings" },
  { to: "/dashboard/kreator/insights",    icon: Lightbulb,     label: "Insights" },
  { to: "/dashboard/creator-academy",    icon: GraduationCap,  label: "Creator Academy" },
  { to: "/dashboard/kreator/profile",     icon: User,          label: "Profile" },
  { to: "/dashboard/kreator/messages",    icon: MessageSquare, label: "Messages",      badgeKey: "messages" as const },
  { to: "/dashboard/kreator/settings",    icon: Settings,      label: "Settings" },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { mobileOpen, closeMobile } = useSidebar();
  const kreatorStats = useKreatorStatsOptional();
  const { effectiveRole } = useRole();
  const isKreatorView = effectiveRole === "kreator";
  const navActiveBg = isKreatorView ? "#16A34A" : "#F97316";
  const navActiveShadow = isKreatorView ? "0 4px 14px rgba(22,163,74,.35)" : "0 4px 14px rgba(249,115,22,.35)";
  const effectiveCollapsed = false;
  const [showSupport, setShowSupport] = useState(false);
  const [supportForm, setSupportForm] = useState({ email: "", message: "" });

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  const navItems = effectiveRole === "kreator" ? kreatorNavItems : effectiveRole === "media_monitoring" ? mediaMonitoringNavItems : brandNavItems;

  const resolveBadge = (item: NavItem) => {
    if (item.badgeKey && kreatorStats) {
      if (item.badgeKey === "invitations") return kreatorStats.pendingInvitationCount;
      if (item.badgeKey === "messages") return kreatorStats.unreadMessages;
    }
    return item.badge;
  };

  const handleContactSupport = () => {
    if (!supportForm.email || !supportForm.message) return;
    toast.success("Message sent successfully! Our support team will reply within 24 hours.");
    setSupportForm({ email: "", message: "" });
    setShowSupport(false);
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobile}
        />
      )}

      <div
        className={cn(
          "relative h-full shrink-0 z-50",
          "fixed inset-y-0 left-0 w-[min(280px,85vw)] transition-[transform,width] duration-200 ease-out",
          effectiveCollapsed ? "lg:w-[68px]" : "lg:w-[220px]",
          "lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
      <aside
        className={cn(
          "bg-[#070B14] flex flex-col h-full overflow-hidden",
          "w-full",
        )}
      >

        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center shrink-0 overflow-hidden no-underline"
          style={{ padding: effectiveCollapsed ? "10px" : "12px 14px" }}
        >
          <div className={cn("flex items-center gap-2", effectiveCollapsed ? "justify-center" : "")}>
            <img
              src="/favicon.png?v=9"
              alt="CreatorHub"
              className="shrink-0"
              style={{ width: effectiveCollapsed ? 32 : 28, height: effectiveCollapsed ? 32 : 28 }}
            />
            {!effectiveCollapsed && (
              <span className="text-[14px] font-extrabold tracking-tight" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>CreatorHub.ID</span>
            )}
          </div>
        </Link>

        {/* Creator workspace pill */}
        {effectiveRole === "kreator" && !effectiveCollapsed && (
          <div className="px-2.5 pt-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold" style={{ background: "#DCFCE7", color: "#15803D" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Creator workspace
            </div>
          </div>
        )}

        {/* Nav */}
        <nav
          className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-px"
          style={{ padding: effectiveCollapsed ? "6px 6px" : "6px 8px" }}
        >
          {navItems.map((item) => {
            const { to, icon: Icon, label } = item;
            const rawBadge = resolveBadge(item);
            const badge = rawBadge !== undefined && rawBadge > 0 ? rawBadge : undefined;
            return (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard" || to === "/dashboard/kreator/home"}
              title={effectiveCollapsed ? label : undefined}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-lg transition-all duration-150 relative cursor-pointer",
                  effectiveCollapsed ? "justify-center w-9 h-9 mx-auto" : "gap-2 px-2.5 py-1.5",
                  isActive
                    ? "text-white"
                    : "hover:text-white"
                )
              }
              style={({ isActive }) => isActive ? {
                background: navActiveBg,
                boxShadow: navActiveShadow,
                color: "white",
              } : {
                color: "var(--ch-text-muted)",
              }}
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {!effectiveCollapsed && (
                    <>
                      <span className="flex-1 text-[12px] font-semibold leading-none">{label}</span>
                      {badge !== undefined && !isActive && (
                        <span className="min-w-[18px] h-4 rounded-full text-[9px] font-bold flex items-center justify-center px-1"
                          style={{ background: "var(--ch-orange)", color: "#FFFFFF" }}>
                          {badge}
                        </span>
                      )}
                      {badge !== undefined && isActive && (
                        <span className="min-w-[18px] h-4 rounded-full text-[9px] font-bold flex items-center justify-center px-1"
                          style={{ background: "rgba(255,255,255,.22)", color: "white" }}>
                          {badge}
                        </span>
                      )}
                    </>
                  )}
                  {/* Orange dot in collapsed mode */}
                  {effectiveCollapsed && badge !== undefined && !isActive && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white"
                      style={{ background: "var(--ch-orange)" }} />
                  )}
                </>
              )}
            </NavLink>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-white/10 shrink-0" style={{ padding: effectiveCollapsed ? "6px" : "8px" }}>
          {effectiveCollapsed ? (
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={() => setShowSupport(true)}
                title="Support"
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center transition-colors hover:bg-white/10 text-slate-400"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <div className="rounded-lg p-2 flex items-center gap-2 border border-white/10 bg-white/5">
                <HelpCircle className="w-5 h-5 shrink-0 text-slate-500" />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-white">Need Help?</p>
                  <button
                    onClick={() => setShowSupport(true)}
                    className="text-[10px] font-semibold hover:underline mt-0.5 block text-blue-400"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
      </div>

      <Dialog open={showSupport} onOpenChange={setShowSupport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--ch-text)" }}>Email *</label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={supportForm.email}
                onChange={(e) => setSupportForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--ch-text)" }}>Message *</label>
              <textarea
                className="w-full border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
                rows={4}
                placeholder="Describe your issue or question..."
                value={supportForm.message}
                onChange={(e) => setSupportForm((f) => ({ ...f, message: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSupport(false)}>Cancel</Button>
            <Button onClick={handleContactSupport} disabled={!supportForm.email || !supportForm.message}>
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

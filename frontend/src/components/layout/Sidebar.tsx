import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Store, Megaphone, BarChart3, Radio,
  MessageSquare, CreditCard, Settings, HelpCircle,
  Rocket, Briefcase, Coins,
  Lightbulb, User, Home, Mail, Database, FolderOpen, Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRole } from "@/context/RoleContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useKreatorStatsOptional } from "@/context/KreatorDataContext";

const brandNavItems = [
  { to: "/service-hub",                icon: Home,            label: "Service Hub" },
  { to: "/service-hub/analytics",      icon: BarChart3,       label: "Projects" },
  { to: "/service-hub/marketplace",    icon: Store,           label: "Marketplace" },
  { to: "/service-hub/campaigns",      icon: Megaphone,       label: "Campaigns" },
  { to: "/service-hub/boost-ads",      icon: Rocket,          label: "Boost Ads" },
  { to: "/service-hub/database",       icon: Database,        label: "Database" },
  { to: "/service-hub/content-hub",    icon: FolderOpen,      label: "Content Hub" },
  { to: "/service-hub/media-monitoring", icon: Radio,          label: "Media Monitoring" },
  { to: "/service-hub/ai-support",       icon: Sparkles,      label: "AI Support" },
  { to: "/service-hub/messages",       icon: MessageSquare,   label: "Messages",   badge: 12 },
  { to: "/service-hub/payments",       icon: CreditCard,      label: "Payments" },
  { to: "/service-hub/settings",       icon: Settings,        label: "Settings" },
];

const kreatorNavItems = [
  { to: "/service-hub/kreator/home",        icon: Home,          label: "Home" },
  { to: "/service-hub/kreator/invitations", icon: Mail,          label: "Undangan",   badgeKey: "invitations" as const },
  { to: "/service-hub/kreator/work",        icon: Briefcase,     label: "Pekerjaan" },
  { to: "/service-hub/kreator/earnings",    icon: Coins,    label: "Penghasilan" },
  { to: "/service-hub/kreator/insights",    icon: Lightbulb,     label: "Insights" },
  { to: "/service-hub/kreator/profile",     icon: User,          label: "Profil" },
  { to: "/service-hub/kreator/messages",    icon: MessageSquare, label: "Pesan",      badgeKey: "messages" as const },
  { to: "/service-hub/kreator/settings",    icon: Settings,      label: "Pengaturan" },
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

  const navItems = effectiveRole === "kreator" ? kreatorNavItems : brandNavItems;

  const resolveBadge = (item: { badge?: number; badgeKey?: "invitations" | "messages" }) => {
    if (item.badgeKey && kreatorStats) {
      if (item.badgeKey === "invitations") return kreatorStats.pendingInvitationCount;
      if (item.badgeKey === "messages") return kreatorStats.unreadMessages;
    }
    return item.badge;
  };

  const handleContactSupport = () => {
    if (!supportForm.email || !supportForm.message) return;
    toast.success("Pesan berhasil dikirim! Tim support kami akan membalas dalam 24 jam.");
    setSupportForm({ email: "", message: "" });
    setShowSupport(false);
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
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
        <div
          className="flex items-center shrink-0 overflow-hidden"
          style={{ padding: effectiveCollapsed ? "12px" : "16px" }}
        >
          <div className={cn("flex items-center gap-2", effectiveCollapsed ? "justify-center" : "")}>
            <img
              src="/favicon.png?v=4"
              alt="CreatorHub"
              className="shrink-0"
              style={{ width: effectiveCollapsed ? 36 : 32, height: effectiveCollapsed ? 36 : 32 }}
            />
            {!effectiveCollapsed && (
              <span className="text-base font-extrabold tracking-tight" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>CreatorHub.ID</span>
            )}
          </div>
        </div>

        {/* Creator workspace pill */}
        {effectiveRole === "kreator" && !effectiveCollapsed && (
          <div className="px-3 pt-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "#DCFCE7", color: "#15803D" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Creator workspace
            </div>
          </div>
        )}

        {/* Nav */}
        <nav
          className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-0.5"
          style={{ padding: effectiveCollapsed ? "12px 8px" : "12px 10px" }}
        >
          {navItems.map((item) => {
            const { to, icon: Icon, label } = item;
            const rawBadge = resolveBadge(item);
            const badge = rawBadge !== undefined && rawBadge > 0 ? rawBadge : undefined;
            return (
            <NavLink
              key={to}
              to={to}
              end={to === "/service-hub" || to === "/service-hub/kreator/home"}
              title={effectiveCollapsed ? label : undefined}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-lg transition-all duration-150 relative cursor-pointer",
                  effectiveCollapsed ? "justify-center w-11 h-11 mx-auto" : "gap-2.5 px-[11px] py-2",
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
                  <Icon className="w-4 h-4 shrink-0" />
                  {!effectiveCollapsed && (
                    <>
                      <span className="flex-1 text-[13px] font-semibold leading-none">{label}</span>
                      {badge !== undefined && !isActive && (
                        <span className="min-w-[22px] h-5 rounded-full text-[10.5px] font-bold flex items-center justify-center px-1.5"
                          style={{ background: "var(--ch-orange-100)", color: "#C2410C" }}>
                          {badge}
                        </span>
                      )}
                      {badge !== undefined && isActive && (
                        <span className="min-w-[22px] h-5 rounded-full text-[10.5px] font-bold flex items-center justify-center px-1.5"
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
        <div className="border-t border-white/10 shrink-0" style={{ padding: effectiveCollapsed ? "10px 8px" : "10px" }}>
          {effectiveCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => setShowSupport(true)}
                title="Support"
                className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center transition-colors hover:bg-white/10 text-slate-400"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="rounded-[10px] p-[10px] flex items-center gap-2.5 border border-white/10 bg-white/5">
                <HelpCircle className="w-7 h-7 shrink-0 text-slate-500" />
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-white">Butuh Bantuan?</p>
                  <button
                    onClick={() => setShowSupport(true)}
                    className="text-[11px] font-semibold hover:underline mt-0.5 block text-blue-400"
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
            <DialogTitle>Hubungi Support</DialogTitle>
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
              <label className="text-sm font-medium" style={{ color: "var(--ch-text)" }}>Pesan *</label>
              <textarea
                className="w-full border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
                rows={4}
                placeholder="Deskripsikan masalah atau pertanyaan Anda..."
                value={supportForm.message}
                onChange={(e) => setSupportForm((f) => ({ ...f, message: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSupport(false)}>Batal</Button>
            <Button onClick={handleContactSupport} disabled={!supportForm.email || !supportForm.message}>
              Kirim Pesan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

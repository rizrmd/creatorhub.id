import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Store, Megaphone, BarChart3, Radio,
  MessageSquare, CreditCard, Settings, HelpCircle, Users,
  Rocket, ChevronLeft, ChevronRight, Briefcase, DollarSign,
  Lightbulb, User, Home, Mail,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRole } from "@/context/RoleContext";

const brandNavItems = [
  { to: "/dashboard",        icon: Home,            label: "Dashboard" },
  { to: "/marketplace",      icon: Store,           label: "Marketplace" },
  { to: "/campaigns",        icon: Megaphone,       label: "Campaigns" },
  { to: "/boost-ads",        icon: Rocket,          label: "Boost Ads" },
  { to: "/analytics",        icon: BarChart3,       label: "Analytics" },
  { to: "/media-monitoring", icon: Radio,           label: "Media Monitor" },
  { to: "/messages",         icon: MessageSquare,   label: "Messages",   badge: 12 },
  { to: "/payments",         icon: CreditCard,      label: "Payments" },
  { to: "/settings",         icon: Settings,        label: "Settings" },
];

const kreatorNavItems = [
  { to: "/kreator/home",        icon: Home,          label: "Home" },
  { to: "/kreator/invitations", icon: Mail,          label: "Undangan",   badge: 3 },
  { to: "/kreator/work",        icon: Briefcase,     label: "Pekerjaan" },
  { to: "/kreator/earnings",    icon: DollarSign,    label: "Penghasilan" },
  { to: "/kreator/insights",    icon: Lightbulb,     label: "Insights" },
  { to: "/kreator/profile",     icon: User,          label: "Profil" },
  { to: "/kreator/messages",    icon: MessageSquare, label: "Pesan",      badge: 12 },
  { to: "/kreator/settings",    icon: Settings,      label: "Pengaturan" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { role, setRole } = useRole();
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("ch_sidebar_collapsed") === "true";
  });
  const [showSupport, setShowSupport] = useState(false);
  const [supportForm, setSupportForm] = useState({ email: "", message: "" });

  useEffect(() => {
    localStorage.setItem("ch_sidebar_collapsed", String(collapsed));
  }, [collapsed]);

  const navItems = role === "kreator" ? kreatorNavItems : brandNavItems;

  const handleSwitchRole = () => {
    if (role === "brand") {
      setRole("kreator");
      navigate("/kreator/home");
    } else {
      setRole("brand");
      navigate("/dashboard");
    }
  };

  const handleContactSupport = () => {
    if (!supportForm.email || !supportForm.message) return;
    toast.success("Pesan berhasil dikirim! Tim support kami akan membalas dalam 24 jam.");
    setSupportForm({ email: "", message: "" });
    setShowSupport(false);
  };

  return (
    <>
      <aside
        className="shrink-0 bg-white border-r flex flex-col h-screen relative overflow-hidden"
        style={{
          width: collapsed ? "68px" : "220px",
          borderColor: "var(--ch-border)",
          transition: "width .2s ease",
        }}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="absolute top-[22px] -right-[13px] z-10 w-[26px] h-[26px] rounded-full bg-white border flex items-center justify-center transition-colors hover:border-blue-300 hover:text-blue-600"
          style={{ borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)", color: "var(--ch-text-muted)" }}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* Logo */}
        <div
          className="h-[70px] flex items-center border-b shrink-0 overflow-hidden"
          style={{ borderColor: "var(--ch-border)", padding: collapsed ? "0 16px" : "0 14px" }}
        >
          {collapsed ? (
            <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0">
              <img src="/logo.webp" alt="CreatorHub" className="w-full h-full object-cover" style={{ mixBlendMode: "multiply" }} />
            </div>
          ) : (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0">
                <img src="/logo.webp" alt="CreatorHub" className="w-full h-full object-cover" style={{ mixBlendMode: "multiply" }} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm leading-tight truncate" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  CreatorHub.id
                </p>
                <p className="text-[9px] tracking-wide uppercase leading-tight" style={{ color: "var(--ch-text-soft)" }}>
                  KOL · Digital · PR · Ads
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Creator workspace pill */}
        {role === "kreator" && !collapsed && (
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
          style={{ padding: collapsed ? "12px 8px" : "12px 10px" }}
        >
          {navItems.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-lg transition-all duration-150 relative",
                  collapsed ? "justify-center w-11 h-11 mx-auto" : "gap-2.5 px-[11px] py-2",
                  isActive
                    ? "text-white"
                    : "hover:text-[#2563EB]"
                )
              }
              style={({ isActive }) => isActive ? {
                background: "var(--ch-primary)",
                boxShadow: "var(--ch-nav-shadow)",
                color: "white",
              } : {
                color: "var(--ch-text-muted)",
              }}
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && (
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
                  {collapsed && badge !== undefined && !isActive && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white"
                      style={{ background: "var(--ch-orange)" }} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="border-t shrink-0" style={{ borderColor: "var(--ch-border)", padding: collapsed ? "10px 8px" : "10px" }}>
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleSwitchRole}
                title={role === "brand" ? "Jadi Kreator" : "Kembali ke Brand"}
                className="w-9 h-9 rounded-lg border flex items-center justify-center transition-colors hover:bg-blue-50"
                style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}
              >
                <Users className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowSupport(true)}
                title="Support"
                className="w-9 h-9 rounded-lg border flex items-center justify-center transition-colors hover:bg-blue-50"
                style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {role === "brand" ? (
                <div className="rounded-[10px] p-[10px] border" style={{ borderColor: "var(--ch-border)" }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #DBEAFE, #BFDBFE)" }}>
                      <Users className="w-3.5 h-3.5" style={{ color: "#2563EB" }} />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold" style={{ color: "var(--ch-text)" }}>Jadi Kreator?</p>
                      <p className="text-[10.5px] leading-tight" style={{ color: "var(--ch-text-muted)" }}>Kelola profil kreatormu</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSwitchRole}
                    className="w-full py-[6px] px-[10px] rounded-lg border-[1.5px] text-[11.5px] font-bold transition-colors hover:bg-orange-50"
                    style={{ borderColor: "#FED7AA", color: "#F97316" }}
                  >
                    Masuk sebagai Kreator →
                  </button>
                </div>
              ) : (
                <div className="rounded-[10px] p-[10px] border" style={{ borderColor: "var(--ch-border)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold" style={{ background: "#A855F7" }}>
                      R
                    </div>
                    <div>
                      <p className="text-[12px] font-bold leading-tight" style={{ color: "var(--ch-text)" }}>Rina Pratiwi</p>
                      <p className="text-[10.5px]" style={{ color: "var(--ch-text-muted)" }}>Lifestyle Creator · Jakarta</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSwitchRole}
                    className="w-full py-[6px] px-[10px] rounded-lg border-[1.5px] text-[11.5px] font-bold transition-colors hover:bg-blue-50"
                    style={{ borderColor: "#BFDBFE", color: "#2563EB" }}
                  >
                    ← Kembali ke Brand
                  </button>
                </div>
              )}

              <div className="rounded-[10px] p-[10px] flex items-center gap-2.5 border" style={{ borderColor: "var(--ch-border)" }}>
                <HelpCircle className="w-7 h-7 shrink-0" style={{ color: "var(--ch-text-soft)" }} />
                <div className="min-w-0">
                  <p className="text-[12px] font-bold" style={{ color: "var(--ch-text)" }}>Butuh Bantuan?</p>
                  <button
                    onClick={() => setShowSupport(true)}
                    className="text-[11px] font-semibold hover:underline mt-0.5 block"
                    style={{ color: "var(--ch-primary)" }}
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

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

import { useState, useRef, useEffect } from "react";
import {
  Save, Bell, Shield, User, Camera, ChevronRight, Copy, RefreshCw,
  Eye, EyeOff, Users, Palette, Zap, CreditCard, Globe,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

type TabKey = "workspace" | "team" | "branding" | "notifications" | "integrations" | "billing" | "security";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "workspace",     label: "Workspace",       icon: User },
  { key: "team",          label: "Team",             icon: Users },
  { key: "branding",      label: "Branding",         icon: Palette },
  { key: "notifications", label: "Notifications",  icon: Bell },
  { key: "integrations",  label: "Integrations",     icon: Zap },
  { key: "billing",       label: "Billing",          icon: CreditCard },
  { key: "security",      label: "Security",         icon: Shield },
];

function generateApiKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let key = "ch_live_";
  for (let i = 0; i < 32; i++) key += chars[Math.floor(Math.random() * chars.length)];
  return key;
}

const teamMembers = [
  { name: "Arif Budiman", email: "arif@creatorhub.id", role: "Admin", avatar: "A", online: true },
  { name: "Sari Dewi", email: "sari@creatorhub.id", role: "Manager", avatar: "S", online: true },
  { name: "Budi Santoso", email: "budi@creatorhub.id", role: "Analyst", avatar: "B", online: false },
];

const integrations = [
  { name: "Google Analytics", desc: "Track campaign traffic and conversions", connected: true, icon: "G", color: "#EA4335" },
  { name: "Meta Ads", desc: "Sync creator content with Meta ad campaigns", connected: false, icon: "M", color: "#1877F2" },
  { name: "TikTok Business", desc: "Boost creator posts directly on TikTok", connected: true, icon: "T", color: "#000000" },
  { name: "Slack", desc: "Receive notifications in Slack channels", connected: false, icon: "S", color: "#4A154B" },
];

export default function Settings() {
  const { user } = useAuth();
  const isEkrafhub = user?.role === "ekrafhub";
  const [activeTab, setActiveTab] = useState<TabKey>("workspace");
  const [profile, setProfile] = useState<{
    name: string; role: string; email: string; agency: string;
    currency?: string; timezone?: string;
  }>(() => {
    if (user?.email === "itsbanuun@creatorhub.id") {
      return {
        name: "Ainul Mardhiah Lubis",
        role: "Network Coordinator",
        email: "itsbanuun@creatorhub.id",
        agency: "PT KreatorHub Indonesia",
      };
    }
    return {
      name: "Arif Budiman",
      role: "Brand Manager",
      email: "motovax.ai@gmail.com",
      agency: "CreatorHub Agency.id",
      currency: "IDR",
      timezone: "Asia/Jakarta",
    };
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    briefAcceptance: true,
    weeklyReports: true,
    directMessages: true,
    paymentAlerts: true,
    campaignUpdates: false,
  });
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [apiKey, setApiKey] = useState("ch_live_••••••••••••••••••••••••••••••••");
  const [show2FA, setShow2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");
  const [brandColor, setBrandColor] = useState("#2563EB");
  const [inviteEmail, setInviteEmail] = useState("");
  const [connectedList, setConnectedList] = useState(
    integrations.map((i) => ({ name: i.name, connected: i.connected }))
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setSaved(true);
    toast.success("Perubahan berhasil disimpan!");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    setAvatarUrl(URL.createObjectURL(file));
    toast.success("Profile photo changed successfully");
  };

  useEffect(() => {
    return () => {
      if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    };
  }, [avatarUrl]);

  const handleUpdateSecurity = () => {
    if (!currentPw || !newPw || !confirmPw) { toast.error("Semua field harus diisi"); return; }
    if (newPw !== confirmPw) { toast.error("Konfirmasi password tidak cocok"); return; }
    if (newPw.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    toast.success("Password updated successfully!");
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
  };

  const handleCopyApiKey = () => {
    if (apiKey.includes("•")) { toast.error("Please generate a new key first"); return; }
    navigator.clipboard.writeText(apiKey).then(() => toast.success("API Key copied!"));
  };

  const handleEnable2FA = () => {
    if (!twoFACode || twoFACode.length < 6) { toast.error("Masukkan kode 6 digit"); return; }
    setShow2FA(false); setTwoFACode("");
    toast.success("2FA berhasil diaktifkan!");
  };

  const toggleIntegration = (name: string) => {
    setConnectedList((list) =>
      list.map((i) => i.name === name ? { ...i, connected: !i.connected } : i)
    );
    const item = connectedList.find((i) => i.name === name);
    toast.success(`${name} ${item?.connected ? "disconnected" : "connected"}`);
  };

  const handleInvite = () => {
    if (!inviteEmail.includes("@")) { toast.error("Invalid email"); return; }
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail("");
  };

  const card = (children: React.ReactNode) => (
    <div className="rounded-xl border p-6"
      style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
      {children}
    </div>
  );

  const sectionTitle = (icon: React.ReactNode, text: string) => (
    <div className="flex items-center gap-2 mb-5">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>
        {icon}
      </div>
      <p className="text-[15px] font-bold" style={{ color: "var(--ch-text)" }}>{text}</p>
    </div>
  );

  return (
    <div className="p-4 md:p-6" style={{ background: "var(--ch-bg)" }}>
      <div className="mb-6">
        <h1 className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Settings
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Kelola workspace, tim, notifikasi, dan keamanan akun Anda
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Sidebar tabs */}
        <div className="lg:w-52 shrink-0 border rounded-xl p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors text-left whitespace-nowrap shrink-0 lg:shrink"
                style={active
                  ? { background: "var(--ch-primary-50)", color: "var(--ch-primary)" }
                  : { color: "var(--ch-text-muted)" }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "var(--ch-bg)"; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <Icon style={{ width: 15, height: 15, flexShrink: 0 }} />
                {t.label}
                {active && <ChevronRight style={{ width: 13, height: 13, marginLeft: "auto" }} />}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5 max-w-2xl">

          {/* Workspace tab */}
          {activeTab === "workspace" && card(
            <>
              {sectionTitle(<User style={{ width: 14, height: 14 }} />, "Account Profile")}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white relative overflow-hidden"
                  style={{ background: "var(--ch-primary)" }}>
                  {avatarUrl ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" /> : profile.name[0]}
                  <button onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Camera style={{ width: 16, height: 16, color: "white" }} />
                  </button>
                </div>
                <div>
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Upload Photo</Button>
                  <p className="text-[11px] mt-1" style={{ color: "var(--ch-text-soft)" }}>JPG, PNG. Max 2MB</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Full Name", field: "name" as const },
                  { label: "Professional Role", field: "role" as const },
                  { label: "Business Email", field: "email" as const, type: "email" },
                  { label: "Agency Name", field: "agency" as const },
                ].map((f) => (
                  <div key={f.field} className="space-y-1.5">
                    <label className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{f.label}</label>
                    <Input type={f.type} value={profile[f.field]}
                      onChange={(e) => setProfile((p) => ({ ...p, [f.field]: e.target.value }))} />
                  </div>
                ))}
              </div>
              {!isEkrafhub && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Currency</label>
                    <Select value={profile.currency ?? ""} onValueChange={(v) => setProfile((p) => ({ ...p, currency: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IDR">IDR – Rupiah Indonesia</SelectItem>
                        <SelectItem value="USD">USD – US Dollar</SelectItem>
                        <SelectItem value="SGD">SGD – Singapore Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Timezone</label>
                    <Select value={profile.timezone ?? ""} onValueChange={(v) => setProfile((p) => ({ ...p, timezone: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Jakarta">WIB (Jakarta)</SelectItem>
                        <SelectItem value="Asia/Makassar">WITA (Makassar)</SelectItem>
                        <SelectItem value="Asia/Jayapura">WIT (Jayapura)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <div className="pt-4">
                <Button onClick={handleSave}>
                  <Save style={{ width: 14, height: 14 }} />
                  {saved ? "Tersimpan!" : "Save Changes"}
                </Button>
              </div>
            </>
          )}

          {/* Team tab */}
          {activeTab === "team" && card(
            <>
              {sectionTitle(<Users style={{ width: 14, height: 14 }} />, "Team Members")}
              <div className="space-y-3 mb-5">
                {teamMembers.map((m) => (
                  <div key={m.email} className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ background: "var(--ch-bg)" }}>
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white"
                        style={{ background: "var(--ch-primary)" }}>{m.avatar}</div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                        style={{ background: m.online ? "#16A34A" : "#94A3B8" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{m.name}</p>
                      <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{m.email}</p>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>{m.role}</span>
                  </div>
                ))}
              </div>
              <Separator className="mb-4" />
              <p className="text-[13px] font-semibold mb-2" style={{ color: "var(--ch-text)" }}>Invite New Member</p>
              <div className="flex gap-2">
                <Input placeholder="email@company.com" type="email" value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)} className="flex-1" />
                <Button onClick={handleInvite}>Invite</Button>
              </div>
            </>
          )}

          {/* Branding tab */}
          {activeTab === "branding" && card(
            <>
              {sectionTitle(<Palette style={{ width: 14, height: 14 }} />, "Brand Identity")}
              <div className="space-y-5">
                <div>
                  <p className="text-[12px] font-semibold mb-2" style={{ color: "var(--ch-text-muted)" }}>Brand Color</p>
                  <div className="flex items-center gap-3">
                    <input type="color" value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border cursor-pointer"
                      style={{ borderColor: "var(--ch-border)" }} />
                    <Input value={brandColor} onChange={(e) => setBrandColor(e.target.value)}
                      className="w-32 font-mono text-sm" />
                    <div className="w-10 h-10 rounded-lg border"
                      style={{ background: brandColor, borderColor: "var(--ch-border)" }} />
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-semibold mb-2" style={{ color: "var(--ch-text-muted)" }}>Brand Logo</p>
                  <div className="border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer"
                    style={{ borderColor: "var(--ch-border)" }}>
                    <Globe style={{ width: 28, height: 28, margin: "0 auto 8px", color: "var(--ch-text-soft)" }} />
                    <p className="text-[13px] font-medium" style={{ color: "var(--ch-text-muted)" }}>
                      Drag & drop logo atau <span style={{ color: "var(--ch-primary)" }}>browse</span>
                    </p>
                    <p className="text-[11px] mt-1" style={{ color: "var(--ch-text-soft)" }}>PNG, SVG. Maks 1MB</p>
                  </div>
                </div>
                <div className="pt-2">
                  <Button onClick={handleSave}>
                    <Save style={{ width: 14, height: 14 }} />
                    Save Branding
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Notifications tab */}
          {activeTab === "notifications" && card(
            <>
              {sectionTitle(<Bell style={{ width: 14, height: 14 }} />, "Preferensi Notifikasi")}
              <div className="space-y-4">
                {[
                  { key: "briefAcceptance" as const, label: "Creator Brief Acceptance", desc: "Notifikasi saat kreator menerima brief Anda" },
                  { key: "weeklyReports" as const, label: "Weekly Reports & KPI Digest", desc: "Ringkasan performa dan KPI setiap minggu" },
                  { key: "directMessages" as const, label: "Direct Messages Inbox", desc: "Notifikasi saat ada pesan masuk dari kreator" },
                  { key: "paymentAlerts" as const, label: "Payment & Invoice Alerts", desc: "Pemberitahuan invoice dan pembayaran escrow" },
                  { key: "campaignUpdates" as const, label: "Campaign Status Updates", desc: "Update saat status kampanye berubah" },
                ].map((item) => (
                  <div key={item.key}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{item.label}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{item.desc}</p>
                      </div>
                      <button
                        onClick={() => {
                          setNotifications((n) => ({ ...n, [item.key]: !n[item.key] }));
                          toast.success(`${item.label} ${!notifications[item.key] ? "aktif" : "nonaktif"}`);
                        }}
                        className="w-[40px] h-[22px] rounded-full relative shrink-0 transition-colors"
                        style={{ background: notifications[item.key] ? "var(--ch-primary)" : "var(--ch-border)" }}>
                        <span className="absolute top-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-transform"
                          style={{
                            boxShadow: "0 1px 3px rgba(15,23,42,0.2)",
                            [notifications[item.key] ? "right" : "left"]: "2px",
                          }} />
                      </button>
                    </div>
                    <Separator className="mt-3" />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Integrations tab */}
          {activeTab === "integrations" && card(
            <>
              {sectionTitle(<Zap style={{ width: 14, height: 14 }} />, "Integrasi & API")}
              <div className="space-y-3 mb-6">
                {integrations.map((item) => {
                  const isConnected = connectedList.find((c) => c.name === item.name)?.connected ?? item.connected;
                  return (
                    <div key={item.name} className="flex items-center gap-3 p-4 rounded-xl border"
                      style={{ borderColor: "var(--ch-border)" }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-[14px] font-bold shrink-0"
                        style={{ background: item.color }}>{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{item.name}</p>
                        <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{item.desc}</p>
                      </div>
                      <button
                        onClick={() => toggleIntegration(item.name)}
                        className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                        style={isConnected
                          ? { background: "#FEE2E2", color: "#B91C1C" }
                          : { background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>
                        {isConnected ? "Disconnect" : "Connect"}
                      </button>
                    </div>
                  );
                })}
              </div>
              <Separator className="mb-4" />
              <p className="text-[13px] font-semibold mb-2" style={{ color: "var(--ch-text)" }}>API Key</p>
              <div className="flex gap-2">
                <Input value={apiKey} readOnly className="font-mono text-sm flex-1" />
                <Button variant="outline" size="sm" onClick={handleCopyApiKey}><Copy style={{ width: 13, height: 13 }} /> Salin</Button>
                <Button variant="outline" size="sm" onClick={() => { setApiKey(generateApiKey()); toast.success("API Key baru dibuat!"); }}>
                  <RefreshCw style={{ width: 13, height: 13 }} /> Baru
                </Button>
              </div>
              <p className="text-[11px] mt-2" style={{ color: "var(--ch-text-soft)" }}>
                API Key untuk mengintegrasikan CreatorHub.id dengan sistem Anda.
              </p>
            </>
          )}

          {/* Billing tab */}
          {activeTab === "billing" && card(
            <>
              {sectionTitle(<CreditCard style={{ width: 14, height: 14 }} />, "Billing & Subscription")}
              <div className="rounded-xl p-4 mb-4"
                style={{ background: "var(--ch-primary-50)", border: "1px solid var(--ch-primary-100)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-bold" style={{ color: "var(--ch-primary)" }}>Pro Plan — Aktif</p>
                    <p className="text-[12px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>Rp 499.000 / bulan · Diperpanjang 9 Jul 2026</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                    style={{ background: "#DCFCE7", color: "#15803D" }}>Active</span>
                </div>
              </div>
              {[
                { label: "Kreator Slots", value: "Unlimited" },
                { label: "Kampanye Aktif", value: "Unlimited" },
                { label: "Team Members", value: "Up to 10" },
                { label: "Analytics Export", value: "CSV & PDF" },
              ].map((f) => (
                <div key={f.label} className="flex justify-between py-2.5 border-b" style={{ borderColor: "var(--ch-border)" }}>
                  <span className="text-[13px]" style={{ color: "var(--ch-text-muted)" }}>{f.label}</span>
                  <span className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{f.value}</span>
                </div>
              ))}
              <div className="pt-4">
                <Button variant="outline" onClick={() => toast.info("Contact sales to upgrade to Enterprise")}>
                  Upgrade Plan
                </Button>
              </div>
            </>
          )}

          {/* Security tab */}
          {activeTab === "security" && (
            <div className="space-y-4">
              {card(
                <>
                  {sectionTitle(<Shield style={{ width: 14, height: 14 }} />, "Ganti Password")}
                  <div className="space-y-4">
                    {([
                      { label: "Current Password", field: "current" as const },
                      { label: "New Password",     field: "new" as const },
                      { label: "Confirm Password", field: "confirm" as const },
                    ] as const).map((f) => (
                      <div key={f.field} className="space-y-1.5">
                        <label className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{f.label}</label>
                        <div className="relative">
                          <Input
                            type={showPw[f.field] ? "text" : "password"}
                            className="pr-9"
                            value={f.field === "current" ? currentPw : f.field === "new" ? newPw : confirmPw}
                            onChange={(e) => {
                              if (f.field === "current") setCurrentPw(e.target.value);
                              else if (f.field === "new") setNewPw(e.target.value);
                              else setConfirmPw(e.target.value);
                            }}
                          />
                          <button type="button"
                            className="absolute right-2.5 top-1/2 -translate-y-1/2"
                            style={{ color: "var(--ch-text-soft)" }}
                            onClick={() => setShowPw((s) => ({ ...s, [f.field]: !s[f.field] }))}>
                            {showPw[f.field] ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                          </button>
                        </div>
                      </div>
                    ))}
                    {confirmPw && confirmPw !== newPw && (
                      <p className="text-[12px]" style={{ color: "#DC2626" }}>Password tidak cocok</p>
                    )}
                    <Button onClick={handleUpdateSecurity}>Update Security Settings</Button>
                  </div>
                </>
              )}
              {card(
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>
                    <Shield style={{ width: 18, height: 18 }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>Two-Factor Authentication (2FA)</p>
                    <p className="text-[12px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
                      Amankan akun brand Anda dengan kode verifikasi tambahan.
                    </p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => setShow2FA(true)}>
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2FA Dialog */}
      <Dialog open={show2FA} onOpenChange={setShow2FA}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Aktifkan Two-Factor Authentication</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-slate-600">Scan QR code dengan Google Authenticator atau Authy.</p>
            <div className="flex justify-center">
              <div className="w-36 h-36 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2"
                style={{ background: "var(--ch-bg)" }}>
                <div className="grid grid-cols-5 gap-0.5">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-sm ${
                      [0,1,2,5,6,10,14,15,16,18,20,21,22,24].includes(i) ? "bg-slate-800" : "bg-white"
                    }`} />
                  ))}
                </div>
                <p className="text-[10px] text-slate-400">QR Code</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Kode Verifikasi (6 digit)</label>
              <Input placeholder="000000" maxLength={6} value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, ""))}
                className="text-center text-lg tracking-widest font-mono" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShow2FA(false)}>Batal</Button>
            <Button onClick={handleEnable2FA} disabled={twoFACode.length < 6}>Verifikasi & Aktifkan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

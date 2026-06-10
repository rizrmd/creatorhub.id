import { useState } from "react";
import { Bell, Shield, User, ChevronRight, Eye, EyeOff, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useDisplayUser } from "@/hooks/useDisplayUser";

type TabKey = "profile" | "notifications" | "security";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "profile",       label: "Account",       icon: User },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security",      label: "Security",      icon: Shield },
];

export default function CreatorSettings() {
  const { fullName, email } = useDisplayUser();
  const [tab, setTab] = useState<TabKey>("profile");
  const [profile, setProfile] = useState({ name: fullName, email, phone: "+62 812 xxxx xxxx" });
  const [notifications, setNotifications] = useState({ brandInvites: true, payments: true, messages: true, weeklyReport: false });
  const [newPw, setNewPw] = useState(""); const [confirmPw, setConfirmPw] = useState(""); const [showPw, setShowPw] = useState(false);

  const handleSave = () => toast.success("Changes saved!");
  const handlePw = () => {
    if (!newPw || newPw !== confirmPw) { toast.error("Password does not match or is empty"); return; }
    if (newPw.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    toast.success("Password successfully changed!"); setNewPw(""); setConfirmPw("");
  };

  const card = (children: React.ReactNode) => (
    <div className="rounded-xl border p-6"
      style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
      {children}
    </div>
  );

  return (
    <div className="p-6" style={{ background: "var(--ch-bg)" }}>
      <div className="mb-6">
        <h1 className="text-[28px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Settings
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Manage your account and creator preferences
        </p>
      </div>
      <div className="flex gap-6 max-w-2xl">
        <div className="w-44 shrink-0 space-y-0.5">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-semibold text-left transition-colors"
                style={active ? { background: "#ECFDF5", color: "#16A34A" } : { color: "var(--ch-text-muted)" }}>
                <Icon style={{ width: 14, height: 14 }} />
                {t.label}
                {active && <ChevronRight style={{ width: 12, height: 12, marginLeft: "auto" }} />}
              </button>
            );
          })}
        </div>
        <div className="flex-1">
          {tab === "profile" && card(
            <div className="space-y-4">
              <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>Account Information</p>
              {[
                { label: "Full Name", field: "name" as const },
                { label: "Email", field: "email" as const, type: "email" },
                { label: "WhatsApp Number", field: "phone" as const },
              ].map((f) => (
                <div key={f.field} className="space-y-1.5">
                  <label className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{f.label}</label>
                  <Input type={f.type} value={profile[f.field]} onChange={(e) => setProfile(p => ({ ...p, [f.field]: e.target.value }))} />
                </div>
              ))}
              <div className="pt-2">
                <Button onClick={handleSave} style={{ background: "#16A34A" }} className="text-white gap-2">
                  <Save style={{ width: 14, height: 14 }} /> Save
                </Button>
              </div>
            </div>
          )}
          {tab === "notifications" && card(
            <div className="space-y-4">
              <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>Notification Preferences</p>
              {[
                { key: "brandInvites" as const, label: "Brand Invitations", desc: "Notifications for new collaboration invitations" },
                { key: "payments" as const, label: "Payments",         desc: "Payment status and invoice updates" },
                { key: "messages" as const, label: "Inbox Messages",    desc: "Message notifications from brands" },
                { key: "weeklyReport" as const, label: "Weekly Report",    desc: "Content performance summary" },
              ].map((item) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{item.label}</p>
                      <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{item.desc}</p>
                    </div>
                    <button
                      onClick={() => { setNotifications(n => ({ ...n, [item.key]: !n[item.key] })); toast.success(`${item.label} ${!notifications[item.key] ? "enabled" : "disabled"}`); }}
                      className="w-10 h-5 rounded-full relative shrink-0 transition-colors"
                      style={{ background: notifications[item.key] ? "#16A34A" : "var(--ch-border)" }}>
                      <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                        style={{ [notifications[item.key] ? "right" : "left"]: "2px" }} />
                    </button>
                  </div>
                  <Separator className="mt-3" />
                </div>
              ))}
            </div>
          )}
          {tab === "security" && card(
            <div className="space-y-4">
              <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>Change Password</p>
              {[
                { label: "New Password", value: newPw, setValue: setNewPw },
                { label: "Confirm Password", value: confirmPw, setValue: setConfirmPw },
              ].map((f) => (
                <div key={f.label} className="space-y-1.5">
                  <label className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{f.label}</label>
                  <div className="relative">
                    <Input type={showPw ? "text" : "password"} value={f.value} onChange={(e) => f.setValue(e.target.value)} className="pr-9" />
                    <button type="button" onClick={() => setShowPw(s => !s)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--ch-text-soft)" }}>
                      {showPw ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                    </button>
                  </div>
                </div>
              ))}
              {confirmPw && confirmPw !== newPw && <p className="text-[12px]" style={{ color: "#DC2626" }}>Password does not match</p>}
              <Button onClick={handlePw} style={{ background: "#16A34A" }} className="text-white">Change Password</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Bell, Shield, User, ChevronRight, Eye, EyeOff, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type TabKey = "profile" | "notifications" | "security";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "profile",       label: "Akun",       icon: User },
  { key: "notifications", label: "Notifikasi", icon: Bell },
  { key: "security",      label: "Security",   icon: Shield },
];

export default function CreatorSettings() {
  const [tab, setTab] = useState<TabKey>("profile");
  const [profile, setProfile] = useState({ name: "Tasya Farasya", email: "tasya@creatorhub.id", phone: "+62 812 xxxx xxxx" });
  const [notifications, setNotifications] = useState({ brandInvites: true, payments: true, messages: true, weeklyReport: false });
  const [newPw, setNewPw] = useState(""); const [confirmPw, setConfirmPw] = useState(""); const [showPw, setShowPw] = useState(false);

  const handleSave = () => toast.success("Perubahan disimpan!");
  const handlePw = () => {
    if (!newPw || newPw !== confirmPw) { toast.error("Password tidak cocok atau kosong"); return; }
    if (newPw.length < 8) { toast.error("Password minimal 8 karakter"); return; }
    toast.success("Password berhasil diubah!"); setNewPw(""); setConfirmPw("");
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
          Pengaturan
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Kelola akun dan preferensi kreator kamu
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
              <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>Informasi Akun</p>
              {[
                { label: "Nama Lengkap", field: "name" as const },
                { label: "Email", field: "email" as const, type: "email" },
                { label: "No. WhatsApp", field: "phone" as const },
              ].map((f) => (
                <div key={f.field} className="space-y-1.5">
                  <label className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{f.label}</label>
                  <Input type={f.type} value={profile[f.field]} onChange={(e) => setProfile(p => ({ ...p, [f.field]: e.target.value }))} />
                </div>
              ))}
              <div className="pt-2">
                <Button onClick={handleSave} style={{ background: "#16A34A" }} className="text-white gap-2">
                  <Save style={{ width: 14, height: 14 }} /> Simpan
                </Button>
              </div>
            </div>
          )}
          {tab === "notifications" && card(
            <div className="space-y-4">
              <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>Preferensi Notifikasi</p>
              {[
                { key: "brandInvites" as const, label: "Undangan Brand", desc: "Notifikasi undangan kolaborasi baru" },
                { key: "payments" as const, label: "Pembayaran",     desc: "Update status pembayaran dan invoice" },
                { key: "messages" as const, label: "Pesan Masuk",    desc: "Notifikasi pesan dari brand" },
                { key: "weeklyReport" as const, label: "Laporan Mingguan", desc: "Ringkasan performa konten" },
              ].map((item) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{item.label}</p>
                      <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{item.desc}</p>
                    </div>
                    <button
                      onClick={() => { setNotifications(n => ({ ...n, [item.key]: !n[item.key] })); toast.success(`${item.label} ${!notifications[item.key] ? "aktif" : "nonaktif"}`); }}
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
              <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>Ubah Password</p>
              {[
                { label: "Password Baru", value: newPw, setValue: setNewPw },
                { label: "Konfirmasi Password", value: confirmPw, setValue: setConfirmPw },
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
              {confirmPw && confirmPw !== newPw && <p className="text-[12px]" style={{ color: "#DC2626" }}>Password tidak cocok</p>}
              <Button onClick={handlePw} style={{ background: "#16A34A" }} className="text-white">Ubah Password</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

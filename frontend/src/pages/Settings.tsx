import { useState, useRef } from "react";
import { Save, Bell, Shield, Globe, User, Camera, ChevronRight, Copy, RefreshCw, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type TabKey = "profile" | "notifications" | "security";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "profile", label: "My Profile", icon: User },
  { key: "notifications", label: "Notifikasi", icon: Bell },
  { key: "security", label: "Security & Password", icon: Shield },
];

function generateApiKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let key = "ch_live_";
  for (let i = 0; i < 32; i++) key += chars[Math.floor(Math.random() * chars.length)];
  return key;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [profile, setProfile] = useState({
    name: "Arif Budiman",
    role: "Brand Manager",
    email: "motovax.ai@gmail.com",
    agency: "CreatorHub agency.id",
    currency: "IDR",
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    briefAcceptance: true,
    weeklyReports: true,
    directMessages: true,
  });

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  const [apiKey, setApiKey] = useState("ch_live_••••••••••••••••••••••••••••••••");
  const [show2FA, setShow2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setSaved(true);
    toast.success("Profil berhasil disimpan!");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    toast.success("Foto profil berhasil diubah");
  };

  const handleUpdateSecurity = () => {
    if (!currentPw || !newPw || !confirmPw) {
      toast.error("Semua field password harus diisi");
      return;
    }
    if (newPw !== confirmPw) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }
    if (newPw.length < 8) {
      toast.error("Password baru minimal 8 karakter");
      return;
    }
    toast.success("Password berhasil diperbarui!");
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
  };

  const handleCopyApiKey = () => {
    const realKey = apiKey.includes("•") ? null : apiKey;
    if (!realKey) {
      toast.error("Generate key baru terlebih dahulu untuk menyalinnya");
      return;
    }
    navigator.clipboard.writeText(realKey).then(() => {
      toast.success("API Key disalin!");
    });
  };

  const handleGenerateKey = () => {
    const newKey = generateApiKey();
    setApiKey(newKey);
    toast.success("API Key baru berhasil dibuat!");
  };

  const handleEnable2FA = () => {
    if (!twoFACode || twoFACode.length < 6) {
      toast.error("Masukkan kode 6 digit dari aplikasi authenticator");
      return;
    }
    setShow2FA(false);
    setTwoFACode("");
    toast.success("2FA berhasil diaktifkan!");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Workspace Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola profil, notifikasi, dan keamanan akun Anda</p>
      </div>

      <div className="flex gap-6 max-w-4xl">
        {/* Sidebar tabs */}
        <div className="w-52 shrink-0 space-y-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeTab === t.key
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {t.label}
                {activeTab === t.key && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* Profile tab */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Profil Akun
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Avatar upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white relative overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      profile.name[0]
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div>
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                      Upload Photo
                    </Button>
                    <p className="text-xs text-slate-400 mt-1">JPG, PNG. Maks 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Nama Lengkap</label>
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Professional Role</label>
                    <Input
                      value={profile.role}
                      onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Business Email</label>
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Agency Name</label>
                    <Input
                      value={profile.agency}
                      onChange={(e) => setProfile((p) => ({ ...p, agency: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 max-w-xs">
                  <label className="text-sm font-medium text-slate-700">Preferred Currency</label>
                  <Select
                    value={profile.currency}
                    onValueChange={(v) => setProfile((p) => ({ ...p, currency: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">IDR – Rupiah Indonesia</SelectItem>
                      <SelectItem value="USD">USD – US Dollar</SelectItem>
                      <SelectItem value="SGD">SGD – Singapore Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-1">
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4" />
                    {saved ? "Tersimpan!" : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications tab */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  Preferensi Notifikasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "briefAcceptance" as const, label: "Creator Brief Acceptance", desc: "Notifikasi saat kreator menerima brief kampanye Anda" },
                  { key: "weeklyReports" as const, label: "Weekly Reports & KPI Digest", desc: "Ringkasan performa dan KPI setiap minggu" },
                  { key: "directMessages" as const, label: "Direct Messages Inbox", desc: "Notifikasi saat ada pesan masuk dari kreator" },
                ].map((item) => (
                  <div key={item.key}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => {
                          setNotifications((n) => ({ ...n, [item.key]: !n[item.key] }));
                          toast.success(`${item.label} ${!notifications[item.key] ? "diaktifkan" : "dinonaktifkan"}`);
                        }}
                        className={`w-10 h-5 rounded-full relative transition-colors ${
                          notifications[item.key] ? "bg-blue-600" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                            notifications[item.key] ? "right-0.5" : "left-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    <Separator className="mt-3" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Security tab */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Ganti Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Current Password</label>
                    <div className="relative">
                      <Input
                        type={showPw.current ? "text" : "password"}
                        placeholder="Masukkan password lama"
                        value={currentPw}
                        onChange={(e) => setCurrentPw(e.target.value)}
                        className="pr-9"
                      />
                      <button
                        type="button"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        onClick={() => setShowPw((s) => ({ ...s, current: !s.current }))}
                      >
                        {showPw.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">New Password</label>
                    <div className="relative">
                      <Input
                        type={showPw.new ? "text" : "password"}
                        placeholder="Minimal 8 karakter"
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        className="pr-9"
                      />
                      <button
                        type="button"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        onClick={() => setShowPw((s) => ({ ...s, new: !s.new }))}
                      >
                        {showPw.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                    <div className="relative">
                      <Input
                        type={showPw.confirm ? "text" : "password"}
                        placeholder="Ulangi password baru"
                        value={confirmPw}
                        onChange={(e) => setConfirmPw(e.target.value)}
                        className={`pr-9 ${confirmPw && confirmPw !== newPw ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                      />
                      <button
                        type="button"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        onClick={() => setShowPw((s) => ({ ...s, confirm: !s.confirm }))}
                      >
                        {showPw.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPw && confirmPw !== newPw && (
                      <p className="text-xs text-red-500">Password tidak cocok</p>
                    )}
                  </div>
                  <Button onClick={handleUpdateSecurity}>Update Security Settings</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">Two-Factor Authentication (2FA)</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Amankan akun brand Anda dengan kode verifikasi tambahan setiap kali login.
                      </p>
                      <Button variant="outline" size="sm" className="mt-3" onClick={() => setShow2FA(true)}>
                        Enable 2FA
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    API & Integrasi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">API Key</label>
                    <div className="flex gap-2">
                      <Input value={apiKey} readOnly className="font-mono text-slate-500 flex-1 min-w-0" />
                      <Button variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={handleCopyApiKey}>
                        <Copy className="w-3.5 h-3.5" />
                        Salin
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={handleGenerateKey}>
                        <RefreshCw className="w-3.5 h-3.5" />
                        Buat Baru
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">API Key digunakan untuk mengintegrasikan CreatorHub.id dengan sistem Anda.</p>
                </CardContent>
              </Card>
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
            <p className="text-sm text-slate-600">
              Scan QR code di bawah dengan aplikasi authenticator (Google Authenticator, Authy, dll).
            </p>
            <div className="flex justify-center">
              <div className="w-40 h-40 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2">
                <div className="grid grid-cols-5 gap-0.5">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-sm ${[0,1,2,5,6,10,14,15,16,18,20,21,22,24].includes(i) ? "bg-slate-800" : "bg-white"}`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-slate-400">QR Code Placeholder</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Kode Verifikasi (6 digit)</label>
              <Input
                placeholder="000000"
                maxLength={6}
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, ""))}
                className="text-center text-lg tracking-widest font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShow2FA(false)}>Batal</Button>
            <Button onClick={handleEnable2FA} disabled={twoFACode.length < 6}>
              Verifikasi & Aktifkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

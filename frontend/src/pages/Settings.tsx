import { useState } from "react";
import { Save, Bell, Shield, Globe, User, Camera, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TabKey = "profile" | "notifications" | "security";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "profile", label: "My Profile", icon: User },
  { key: "notifications", label: "Notifikasi", icon: Bell },
  { key: "security", label: "Security & Password", icon: Shield },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [profile, setProfile] = useState({
    name: "Arif Budiman",
    role: "Brand Manager",
    email: "motovax.ai@gmail.com",
    agency: "CreatorHub agency.id",
    currency: "IDR",
  });
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    briefAcceptance: true,
    weeklyReports: true,
    directMessages: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white relative">
                    {profile.name[0]}
                    <button className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50">
                      <Camera className="w-3 h-3 text-slate-600" />
                    </button>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Upload Photo</Button>
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
                        onClick={() => setNotifications((n) => ({ ...n, [item.key]: !n[item.key] }))}
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
                    <Input type="password" placeholder="Masukkan password lama" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">New Password</label>
                    <Input type="password" placeholder="Minimal 8 karakter" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                    <Input type="password" placeholder="Ulangi password baru" />
                  </div>
                  <Button>Update Security Settings</Button>
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
                      <Button variant="outline" size="sm" className="mt-3">Enable 2FA</Button>
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
                      <Input value="ch_live_••••••••••••••••••••••••" readOnly className="font-mono text-slate-500" />
                      <Button variant="outline" size="sm">Salin</Button>
                      <Button variant="outline" size="sm">Buat Baru</Button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">API Key digunakan untuk mengintegrasikan CreatorHub.id dengan sistem Anda.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

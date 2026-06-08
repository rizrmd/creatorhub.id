import { useState } from "react";
import { Save, Bell, Shield, Globe, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  const [profile, setProfile] = useState({
    name: "Admin",
    email: "motovax.ai@gmail.com",
    company: "CreatorHub.id",
    phone: "+62 812-3456-7890",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pengaturan</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola akun dan preferensi Anda</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            Profil Akun
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Nama Lengkap</label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Perusahaan</label>
              <Input
                value={profile.company}
                onChange={(e) => setProfile((p) => ({ ...p, company: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Nomor Telepon</label>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>
          </div>
          <div className="pt-2">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4" />
              {saved ? "Tersimpan!" : "Simpan Perubahan"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            Notifikasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Notifikasi Email", desc: "Terima update kampanye via email" },
            { label: "Pesan Baru", desc: "Notifikasi saat kreator membalas pesan" },
            { label: "Laporan Mingguan", desc: "Ringkasan performa setiap minggu" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <button className="w-10 h-5 bg-blue-600 rounded-full relative transition-colors">
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full" />
                </button>
              </div>
              <Separator className="mt-3" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            Keamanan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Password Lama</label>
            <Input type="password" placeholder="Masukkan password lama" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Password Baru</label>
            <Input type="password" placeholder="Minimal 8 karakter" />
          </div>
          <Button variant="outline">Ganti Password</Button>
        </CardContent>
      </Card>

      {/* API */}
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
  );
}

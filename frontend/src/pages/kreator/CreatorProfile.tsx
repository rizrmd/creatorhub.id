import { useState, useRef } from "react";
import { Camera, Star, CheckCircle, MapPin, Instagram, Youtube, Edit2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const NICHES = ["Beauty", "Skincare", "Lifestyle", "Fashion", "Travel"];

export default function CreatorProfile() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Tasya Farasya",
    handle: "@tasyafarasya",
    bio: "Beauty & skincare enthusiast dari Jakarta ✨ Sharing honest reviews & tutorials setiap hari. Business: tasya@creatorhub.id",
    city: "Jakarta",
    rate: "4500000",
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setEditing(false);
    toast.success("Profil berhasil disimpan!");
  };

  return (
    <div className="p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Profil Kreator
        </h1>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-[13px] font-bold"
          style={{ background: editing ? "#16A34A" : "var(--ch-primary)" }}>
          {editing ? <><Save style={{ width: 14, height: 14 }} /> Simpan</> : <><Edit2 style={{ width: 14, height: 14 }} /> Edit Profil</>}
        </button>
      </div>

      {/* Profile card */}
      <div className="rounded-xl border overflow-hidden"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        {/* Cover */}
        <div className="h-28 relative" style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        </div>
        {/* Avatar */}
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden"
                style={{ background: "var(--ch-primary)" }}>
                <img src="/creators/tasya-farasya.png" alt="Tasya" className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">T</div>
              </div>
              {editing && (
                <button onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white border-2 border-white"
                  style={{ background: "var(--ch-primary)" }}>
                  <Camera style={{ width: 10, height: 10 }} />
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" />
            </div>
            <div className="mb-1">
              <div className="flex items-center gap-2">
                <p className="text-[18px] font-extrabold" style={{ color: "var(--ch-text)" }}>{profile.name}</p>
                <CheckCircle style={{ width: 16, height: 16, color: "var(--ch-primary)" }} />
                <span className="flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "#FEF3C7", color: "#B45309" }}>
                  <Star style={{ width: 9, height: 9 }} /> 4.9
                </span>
              </div>
              <p className="text-[13px]" style={{ color: "var(--ch-text-muted)" }}>{profile.handle}</p>
              <div className="flex items-center gap-1 mt-0.5 text-[12px]" style={{ color: "var(--ch-text-soft)" }}>
                <MapPin style={{ width: 11, height: 11 }} /> {profile.city}
              </div>
            </div>
          </div>

          {editing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Nama</label>
                  <Input value={profile.name} onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Handle</label>
                  <Input value={profile.handle} onChange={(e) => setProfile(p => ({ ...p, handle: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border px-3 py-2 text-[13px] outline-none resize-none"
                  style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Kota</label>
                  <Input value={profile.city} onChange={(e) => setProfile(p => ({ ...p, city: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Rate Dasar (Rp)</label>
                  <Input type="number" value={profile.rate} onChange={(e) => setProfile(p => ({ ...p, rate: e.target.value }))} />
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-[13px] mb-4" style={{ color: "var(--ch-text-muted)" }}>{profile.bio}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {NICHES.map((n) => (
                  <span key={n} className="text-[12px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>{n}</span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Total Followers", value: "486K" },
                  { label: "Avg Engagement", value: "5.8%" },
                  { label: "Rate per Post", value: "Rp " + (parseInt(profile.rate) / 1000000).toFixed(1) + "jt" },
                ].map((s) => (
                  <div key={s.label} className="text-center p-3 rounded-xl"
                    style={{ background: "var(--ch-bg)" }}>
                    <p className="text-[17px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</p>
                    <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Platform links */}
      <div className="rounded-xl border p-5"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        <p className="text-[13px] font-bold mb-3" style={{ color: "var(--ch-text)" }}>Platform Terhubung</p>
        <div className="space-y-2">
          {[
            { icon: <Instagram style={{ width: 16, height: 16 }} />, name: "Instagram", handle: "@tasyafarasya", followers: "284K", color: "#E1306C" },
            { icon: <span className="text-sm">📱</span>, name: "TikTok", handle: "@tasyafarasya", followers: "152K", color: "#010101" },
            { icon: <Youtube style={{ width: 16, height: 16 }} />, name: "YouTube", handle: "Tasya Farasya", followers: "50K", color: "#FF0000" },
          ].map((p) => (
            <div key={p.name} className="flex items-center gap-3 p-3 rounded-lg"
              style={{ background: "var(--ch-bg)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                style={{ background: p.color }}>
                {p.icon}
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{p.name}</p>
                <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{p.handle}</p>
              </div>
              <p className="text-[13px] font-bold" style={{ color: "#16A34A" }}>{p.followers}</p>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <div className="flex gap-3">
          <Button onClick={handleSave} style={{ background: "#16A34A" }} className="text-white">
            <Save style={{ width: 14, height: 14 }} /> Simpan Perubahan
          </Button>
          <Button variant="outline" onClick={() => setEditing(false)}>Batal</Button>
        </div>
      )}
    </div>
  );
}

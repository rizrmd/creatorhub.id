import { useState } from "react";
import { ArrowLeft, MapPin, Route, Users, Instagram, Youtube, Camera, Eye, Heart, TrendingUp, ChevronRight, Activity, Image, Video, BookOpen, FileText, ExternalLink, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const GAMPONG_NUSA = {
  name: "Gampong Nusa",
  location: "Jalan Banda Aceh – Meulaboh Km 9,5, Kecamatan Lhoknga, Kabupaten Aceh Besar",
  distance: "~10 km dari Banda Aceh",
  travelTime: "20–30 menit berkendara",
  description:
    "Gampong Nusa adalah desa wisata unggulan berbasis masyarakat di Kecamatan Lhoknga, Kabupaten Aceh Besar, yang berjarak sekitar 10 kilometer dari pusat Kota Banda Aceh. Desa ini terkenal dengan pemandangan alam perbukitan dan persawahan yang indah, serta konsep ramah lingkungan (ecotourism).",
};

interface PlatformData {
  name: string;
  followers: number;
  engagementRate: number;
}

interface AccountData {
  id: string;
  name: string;
  handle: string;
  photo: string;
  platforms: PlatformData[];
}

const KOC_ACCOUNTS: AccountData[] = [
  { id: "1", name: "Nura Sahirah", handle: "@nurasahirah", photo: "/nurasahirah.jpg", platforms: [{ name: "instagram", followers: 2017, engagementRate: 0.8 }] },
  { id: "2", name: "Opie Zahri", handle: "@opiezahri", photo: "/opiezahri.jpg", platforms: [{ name: "instagram", followers: 6529, engagementRate: 0.6 }] },
];

const HOMELESS_MEDIA_ACCOUNTS: AccountData[] = [
  { id: "1", name: "Gampong Nusa Ku", handle: "@gampongnusaku", photo: "/gampongnusaku.jpg", platforms: [{ name: "instagram", followers: 5709, engagementRate: 0.7 }] },
  { id: "2", name: "Explore Aceh", handle: "@exploreacehh", photo: "/exploreacehh.jpg", platforms: [{ name: "instagram", followers: 13000, engagementRate: 0.5 }] },
];

const TOP_PERFORMERS = [
  { id: "1", name: "Opie Zahri", handle: "@opiezahri", platform: "instagram", views: 12500, engagement: 0.6, photo: "/opiezahri.jpg", category: "Lifestyle & Creative" },
  { id: "2", name: "Nura Sahirah", handle: "@nurasahirah", platform: "instagram", views: 8300, engagement: 0.8, photo: "/nurasahirah.jpg", category: "Travel & Culture" },
];

const TOP_CREATORS_BY_FOLLOWERS = [
  { id: "1", name: "Opie Zahri", handle: "@opiezahri", platform: "instagram", followers: 6529, photo: "/opiezahri.jpg", category: "Lifestyle & Creative" },
  { id: "2", name: "Nura Sahirah", handle: "@nurasahirah", platform: "instagram", followers: 2017, photo: "/nurasahirah.jpg", category: "Travel & Culture" },
];

const TIM_DESA = [
  { name: "Rizky Pratama", role: "Digital Coordinator", avatar: "https://i.pravatar.cc/150?img=11", platforms: ["Instagram", "TikTok"] },
  { name: "Aisyah Putri", role: "Storytelling & Content", avatar: "https://i.pravatar.cc/150?img=5", platforms: ["Instagram", "YouTube"] },
  { name: "Fauzan Mubarak", role: "Visual Documentation", avatar: "https://i.pravatar.cc/150?img=7", platforms: ["Instagram", "TikTok"] },
  { name: "Nurul Hidayah", role: "Social Media & Community Officer", avatar: "https://i.pravatar.cc/150?img=9", platforms: ["TikTok", "Facebook"] },
  { name: "Made Aditya", role: "Brand Ambassador Desa", avatar: "https://i.pravatar.cc/150?img=12", platforms: ["TikTok", "YouTube", "Instagram"] },
  { name: "Siti Rahmawati", role: "Nano Influencer Coordinator", avatar: "https://i.pravatar.cc/150?img=25", platforms: ["Instagram", "TikTok"] },
  { name: "Ahmad Fadhil", role: "Data & Partnership Officer", avatar: "https://i.pravatar.cc/150?img=14", platforms: ["X", "LinkedIn"] },
];

const ASET_ITEMS = [
  { label: "Photos", icon: Image, image: "/desa-photos/Gampong Nusa.jpg" },
  { label: "Videos", icon: Video, image: "/desa-photos/Gampong Lampulo.jpg" },
  { label: "Katalog Digital", icon: BookOpen, image: "/desa-photos/Desa Aneuk Laot.jpg" },
  { label: "Press Release", icon: FileText, image: "/desa-photos/Desa Suak Timah.jpeg" },
];

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function platformIcon(p: string, size: "sm" | "md" = "sm") {
  const cls = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  if (p === "instagram") return <Instagram className={cls} style={{ color: "#E1306C" }} />;
  if (p === "youtube") return <Youtube className={cls} style={{ color: "#FF0000" }} />;
  if (p === "tiktok") return (
    <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.01a6.28 6.28 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.36a6.33 6.33 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-.06z" />
    </svg>
  );
  return <Camera className={cls} />;
}

function ActivitiesCard({ onAccountClick }: { onAccountClick: (handle: string) => void }) {
  const [activeTab, setActiveTab] = useState<"koc" | "homeless">("koc");
  const [showAll, setShowAll] = useState(false);
  const data = activeTab === "koc" ? KOC_ACCOUNTS : HOMELESS_MEDIA_ACCOUNTS;
  const visible = showAll ? data : data.slice(0, 3);

  return (
    <div className="rounded-xl border overflow-hidden"
      style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
      <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--ch-border)" }}>
        <Activity className="w-4 h-4 text-blue-500" />
        <h3 className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>Account Monitoring</h3>
      </div>
      {/* Tabs */}
      <div className="px-4 py-2 border-b flex items-center gap-1" style={{ borderColor: "var(--ch-border)" }}>
        <button
          onClick={() => { setActiveTab("koc"); setShowAll(false); }}
          className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors"
          style={activeTab === "koc"
            ? { background: "var(--ch-primary)", color: "#fff" }
            : { background: "var(--ch-muted)", color: "var(--ch-text-muted)" }}
        >
          Key Opinion Community
        </button>
        <button
          onClick={() => { setActiveTab("homeless"); setShowAll(false); }}
          className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors"
          style={activeTab === "homeless"
            ? { background: "#8B5CF6", color: "#fff" }
            : { background: "var(--ch-muted)", color: "var(--ch-text-muted)" }}
        >
          Homeless Media
        </button>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
              <th className="text-left px-4 py-2 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}></th>
              <th className="text-left px-2 py-2 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Name</th>
              <th className="text-left px-2 py-2 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Platform</th>
              <th className="text-right px-2 py-2 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Followers</th>
              <th className="text-right px-4 py-2 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>E/R</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--ch-border)" }}>
            {visible.map((account) =>
              account.platforms.map((platform, pIdx) => (
                <tr key={`${account.id}-${platform.name}`} className="hover:bg-black/[0.02] transition-colors cursor-pointer" onClick={() => onAccountClick(account.handle.replace("@", ""))}>
                  <td className="px-4 py-2.5">
                    {pIdx === 0 && (
                      <img src={account.photo} alt={account.name} className="w-7 h-7 rounded-full object-cover" />
                    )}
                  </td>
                  <td className="px-2 py-2.5">
                    {pIdx === 0 && (
                      <p className="text-[11px] font-bold truncate" style={{ color: "var(--ch-text)" }}>{account.name}</p>
                    )}
                  </td>
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-1">
                      {platformIcon(platform.name)}
                      <div>
                        <span className="text-[11px] font-semibold capitalize" style={{ color: "var(--ch-text)" }}>{platform.name}</span>
                        <p className="text-[9px]" style={{ color: "var(--ch-text-muted)" }}>{account.handle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-right">
                    <span className="text-[11px] font-bold" style={{ color: "var(--ch-text)" }}>{formatNum(platform.followers)}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="text-[11px] font-bold" style={{ color: platform.engagementRate >= 5 ? "#16A34A" : "var(--ch-text)" }}>{platform.engagementRate}%</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {data.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full px-4 py-2.5 text-[12px] font-semibold flex items-center justify-center gap-1 transition-colors hover:bg-black/[0.03]"
          style={{ color: "var(--ch-primary)", borderTop: "1px solid var(--ch-border)" }}
        >
          {showAll ? "Tampilkan lebih sedikit" : "See More"}
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAll ? "rotate-90" : ""}`} />
        </button>
      )}
    </div>
  );
}

export default function GampongNusa() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"ekosistem" | "social" | "produk">("ekosistem");

  return (
    <div className="p-4 md:p-6" style={{ background: "var(--ch-bg)" }}>
      {/* Back button */}
      <button
        onClick={() => navigate("/dashboard/ekrafhub/desa-kreatif")}
        className="flex items-center gap-2 text-[13px] font-semibold mb-4 transition-colors hover:opacity-80"
        style={{ color: "var(--ch-primary)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Peta Desa Kreatif
      </button>

      {/* Hero Section */}
      <div className="rounded-xl border overflow-hidden mb-6"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        <div className="h-32 md:h-40 relative"
          style={{ background: "linear-gradient(135deg, #065f46, #059669, #10b981)" }}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "url('https://picsum.photos/seed/gampongnusa/1200/400')", backgroundSize: "cover", backgroundPosition: "center" }} />
        </div>
        <div className="px-5 py-4 md:px-6 md:py-5">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-[-0.5px] mb-1"
                style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {GAMPONG_NUSA.name}
              </h1>
              <div className="flex items-center gap-2 text-[13px]" style={{ color: "var(--ch-text-muted)" }}>
                <MapPin className="w-3.5 h-3.5" />
                <span>{GAMPONG_NUSA.location}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                style={{ background: "#ECFDF5", color: "#059669" }}>
                <Route className="w-3.5 h-3.5" />
                {GAMPONG_NUSA.distance}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                style={{ background: "#EFF6FF", color: "#2563EB" }}>
                ~{GAMPONG_NUSA.travelTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="rounded-xl border p-3"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-500/10">
              <Users className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-[18px] font-extrabold" style={{ color: "var(--ch-text)" }}>{TOP_CREATORS_BY_FOLLOWERS.length}</p>
              <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>Content Creators</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border p-3"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/10">
              <Eye className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-[18px] font-extrabold" style={{ color: "var(--ch-text)" }}>{formatNum(TOP_PERFORMERS.reduce((s, c) => s + c.views, 0))}</p>
              <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>Total Views</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border p-3"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-500/10">
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="text-[18px] font-extrabold" style={{ color: "var(--ch-text)" }}>{(TOP_PERFORMERS.reduce((s, c) => s + c.engagement, 0) / TOP_PERFORMERS.length).toFixed(1)}%</p>
              <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>Avg. Engagement</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border p-3"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500/10">
              <Heart className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <p className="text-[18px] font-extrabold" style={{ color: "var(--ch-text)" }}>{formatNum(TOP_CREATORS_BY_FOLLOWERS.reduce((s, c) => s + c.followers, 0))}</p>
              <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>Total Followers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-xl border overflow-hidden mb-6"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        <div className="flex border-b" style={{ borderColor: "var(--ch-border)" }}>
          {[
            { id: "ekosistem" as const, label: "Ekosistem Konten Desa Kreatif Digital" },
            { id: "social" as const, label: "Social Media Posts" },
            { id: "produk" as const, label: "Produk Kreatif Unggulan & Peran Aktif Masyarakat" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 px-4 py-3.5 text-[12px] font-bold transition-all relative"
              style={{
                background: activeTab === tab.id ? "var(--ch-bg)" : "transparent",
                color: activeTab === tab.id ? "var(--ch-primary)" : "var(--ch-text-muted)",
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "var(--ch-primary)" }} />
              )}
            </button>
          ))}
        </div>

        <div className="p-5 md:p-6">
          {/* Tab 1: Ekosistem Konten Desa Kreatif Digital */}
          {activeTab === "ekosistem" && (
            <div className="space-y-6">
              {/* Description & Location */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-xl border p-5"
                  style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
                  <h2 className="text-[15px] font-extrabold mb-3"
                    style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Tentang Gampong Nusa
                  </h2>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>
                    {GAMPONG_NUSA.description}
                  </p>
                </div>
                <div className="rounded-xl border p-5"
                  style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
                  <h2 className="text-[15px] font-extrabold mb-3"
                    style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Lokasi dan Rute
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "var(--ch-muted)" }}>
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--ch-primary)" }} />
                      <div>
                        <p className="text-[12px] font-bold" style={{ color: "var(--ch-text)" }}>Alamat</p>
                        <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>{GAMPONG_NUSA.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "var(--ch-muted)" }}>
                      <Route className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--ch-primary)" }} />
                      <div>
                        <p className="text-[12px] font-bold" style={{ color: "var(--ch-text)" }}>Jarak & Waktu Tempuh</p>
                        <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>
                          {GAMPONG_NUSA.distance} dari Banda Aceh dengan waktu tempuh berkisar {GAMPONG_NUSA.travelTime} berkendara.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map & Account Monitoring */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                <div className="lg:col-span-2">
                  <div className="rounded-xl border overflow-hidden h-full flex flex-col"
                    style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
                    <div className="px-5 py-3 border-b shrink-0" style={{ borderColor: "var(--ch-border)" }}>
                      <h2 className="text-[15px] font-extrabold"
                        style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Peta Lokasi
                      </h2>
                    </div>
                    <div className="flex-1 min-h-[400px]" style={{ background: "#0B1120" }}>
                      <MapContainer
                        center={[5.5155, 95.2640]}
                        zoom={13}
                        scrollWheelZoom={false}
                        style={{ height: "100%", width: "100%", background: "#0B1120" }}
                        zoomControl={false}
                        attributionControl={false}
                      >
                        <TileLayer
                          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                          subdomains="abcd"
                        />
                        <Marker
                          position={[5.5155, 95.2640]}
                          icon={L.divIcon({
                            className: "",
                            iconSize: [28, 36],
                            iconAnchor: [14, 36],
                            html: `<div style="width:28px;height:36px;display:flex;align-items:flex-start;justify-content:center;">
                              <div style="width:28px;height:28px;border-radius:50%;background:#F97316;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                              </div>
                            </div>`,
                          })}
                        >
                          <Popup>
                            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              <p style={{ fontWeight: 800, fontSize: 13, margin: 0 }}>Gampong Nusa</p>
                              <p style={{ fontSize: 11, color: "#666", margin: "2px 0 0" }}>Kec. Lhoknga, Aceh Besar</p>
                            </div>
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <ActivitiesCard onAccountClick={(handle) => navigate(`/dashboard/ekrafhub/profiles/${handle}`)} />
                </div>
              </div>

              {/* Ekosistem Konten Digital Desa */}
              <div className="rounded-2xl border p-5 md:p-6"
                style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
                <h2 className="text-lg md:text-xl font-extrabold mb-1"
                  style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Ekosistem Konten Digital Desa
                </h2>
                <p className="text-[13px] mb-5" style={{ color: "var(--ch-text-muted)" }}>
                  Tim yang memproduksi, mengelola, dan mendistribusikan aset konten untuk memperkuat promosi potensi desa.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-start">
                  {/* Tim Digital Desa */}
                  <div className="rounded-xl border p-4"
                    style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-5 h-5" style={{ color: "var(--ch-primary)" }} />
                      <h3 className="text-[15px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Tim Digital Desa
                      </h3>
                    </div>
                    <p className="text-[12px] mb-4" style={{ color: "var(--ch-text-muted)" }}>Tim pengelola konten desa</p>
                    <div className="grid grid-cols-2 gap-2">
                      {TIM_DESA.map((t) => (
                        <div key={t.name} className="rounded-lg p-3 flex items-center gap-2.5"
                          style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                          <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-bold truncate" style={{ color: "var(--ch-text)" }}>{t.name}</p>
                            <p className="text-[10px] font-semibold truncate mb-1.5" style={{ color: "var(--ch-primary)" }}>{t.role}</p>
                            <div className="flex flex-wrap gap-1">
                              {t.platforms.map((p) => (
                                <span key={p} className="text-[9px] font-bold px-2 py-0.5 rounded"
                                  style={{ background: "var(--ch-primary)15", color: "var(--ch-primary)" }}>
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Center Connector */}
                  <div className="hidden lg:flex flex-col items-center justify-center py-8 px-4 gap-3">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ background: "var(--ch-primary)20", border: "2px solid var(--ch-primary)40" }}>
                      <Share2 className="w-6 h-6" style={{ color: "var(--ch-primary)" }} />
                    </div>
                    <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--ch-text-muted)" }}>TIM KAMI</p>
                    <div className="text-center">
                      <p className="text-[14px] font-extrabold" style={{ color: "var(--ch-primary)" }}>Memproduksi</p>
                      <p className="text-[14px] font-extrabold" style={{ color: "var(--ch-primary)" }}>Mengelola</p>
                      <p className="text-[14px] font-extrabold" style={{ color: "var(--ch-primary)" }}>Mendistribusikan</p>
                    </div>
                    <p className="text-[12px] text-center" style={{ color: "var(--ch-text-muted)" }}>
                      aset konten desa<br />secara berkelanjutan.
                    </p>
                  </div>

                  {/* Pusat Aset Konten */}
                  <div className="rounded-xl border p-4"
                    style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Share2 className="w-5 h-5" style={{ color: "var(--ch-primary)" }} />
                      <h3 className="text-[15px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Pusat Aset Konten
                      </h3>
                    </div>
                    <p className="text-[12px] mb-4" style={{ color: "var(--ch-text-muted)" }}>Hasil kerja tim yang terkelola dan siap digunakan</p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {ASET_ITEMS.map((item) => (
                        <div key={item.label} className="rounded-lg overflow-hidden relative group"
                          style={{ border: "1px solid var(--ch-border)" }}>
                          <div className="h-28 overflow-hidden">
                            <img src={item.image} alt={item.label}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center gap-1.5"
                            style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
                            <item.icon className="w-3.5 h-3.5 text-white" />
                            <span className="text-[11px] font-bold text-white">{item.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-bold transition-all hover:scale-[1.02]"
                      style={{ background: "var(--ch-primary)", color: "#fff" }}>
                      Buka Pusat Aset Konten
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Social Media Posts */}
          {activeTab === "social" && (
            <div className="space-y-4">
              <p className="text-[13px]" style={{ color: "var(--ch-text-muted)" }}>
                Daftar postingan media sosial dari akun-akun terkait Gampong Nusa.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { platform: "Instagram", account: "@gampongnusaku", content: "Sunrise di Gampong Nusa, Aceh Besar. Pemandangan alam yang memukau setiap pagi.", likes: "1.2K", comments: "89", date: "2 hari lalu", image: "/desa-photos/Gampong Nusa.jpg" },
                  { platform: "TikTok", account: "@gampongnusayouth", content: "Tour guide virtual Gampong Nusa! Yuk kenali potensi desa kita.", likes: "5.4K", comments: "234", date: "3 hari lalu", image: "/desa-photos/Gampong Lampulo.jpg" },
                  { platform: "Instagram", account: "@nurasahirah", content: "Kuliner khas Gampong Nusa yang wajib dicoba saat berkunjung.", likes: "890", comments: "45", date: "5 hari lalu", image: "/desa-photos/Desa Aneuk Laot.jpg" },
                  { platform: "YouTube", account: "@opiezahri", content: "Vlog lengkap wisata Gampong Nusa - dari homestay hingga spot foto terbaik.", likes: "3.2K", comments: "156", date: "1 minggu lalu", image: "/desa-photos/Desa Suak Timah.jpeg" },
                  { platform: "Facebook", account: "KomunitasGN", content: "Agenda kegiatan desa minggu ini: workshop fotografi untuk pemuda.", likes: "456", comments: "67", date: "1 minggu lalu", image: "/desa-photos/Gampong Nusa.jpg" },
                  { platform: "TikTok", account: "@elvisafrita", content: "Resep masakan tradisional Aceh yang bisa kamu coba di rumah.", likes: "8.9K", comments: "567", date: "2 minggu lalu", image: "/desa-photos/Gampong Lampulo.jpg" },
                ].map((post, i) => (
                  <div key={i} className="rounded-xl border overflow-hidden transition-all hover:scale-[1.01]"
                    style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
                    <div className="h-40 overflow-hidden">
                      <img src={post.image} alt={post.content} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded"
                          style={{ background: post.platform === "Instagram" ? "#E1306C20" : post.platform === "TikTok" ? "#00000020" : post.platform === "YouTube" ? "#FF000020" : "#1877F220", color: post.platform === "Instagram" ? "#E1306C" : post.platform === "TikTok" ? "#fff" : post.platform === "YouTube" ? "#FF0000" : "#1877F2" }}>
                          {post.platform}
                        </span>
                        <span className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{post.account}</span>
                      </div>
                      <p className="text-[11px] mb-2 line-clamp-2" style={{ color: "var(--ch-text)" }}>{post.content}</p>
                      <div className="flex items-center gap-3 text-[10px]" style={{ color: "var(--ch-text-muted)" }}>
                        <span>❤️ {post.likes}</span>
                        <span>💬 {post.comments}</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Produk Kreatif Unggulan & Peran Aktif Masyarakat */}
          {activeTab === "produk" && (
            <div className="space-y-6">
              {/* Produk Kreatif Unggulan */}
              <div>
                <h3 className="text-[15px] font-extrabold mb-3"
                  style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Produk Kreatif Unggulan Barang/Jasa
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Kopi Gampong Nusa", category: "Kuliner", desc: "Kopi robusta premium dari kebun kopi desa, diproses secara tradisional.", price: "Rp 45.000/pack" },
                    { name: "Kain Tenun Aceh", category: "Kriya", desc: "Kain tenun tangan dengan motif tradisional Aceh, dibuat oleh pengrajin lokal.", price: "Rp 250.000/lembar" },
                    { name: "Homestay Gampong Nusa", category: "Jasa", desc: "Penginapan ramah lingkungan dengan pemandangan alam perbukitan.", price: "Rp 200.000/malam" },
                    { name: "Paket Wisata Desa", category: "Jasa", desc: "Paket wisata lengkap termasuk tur desa, kuliner, dan workshop budaya.", price: "Rp 150.000/orang" },
                    { name: "Kerajinan Batik", category: "Kriya", desc: "Batik handmade dengan motif flora-fauna khas Aceh Besar.", price: "Rp 180.000/lembar" },
                    { name: "Sambal Gampong Nusa", category: "Kuliner", desc: "Sambal tradisional dengan resep turun-temurun, pedas dan gurih.", price: "Rp 25.000/botol" },
                  ].map((produk, i) => (
                    <div key={i} className="rounded-xl border p-4 transition-all hover:scale-[1.01]"
                      style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded"
                          style={{ background: "var(--ch-primary)15", color: "var(--ch-primary)" }}>
                          {produk.category}
                        </span>
                      </div>
                      <h4 className="text-[13px] font-bold mb-1" style={{ color: "var(--ch-text)" }}>{produk.name}</h4>
                      <p className="text-[11px] mb-3 leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>{produk.desc}</p>
                      <p className="text-[12px] font-extrabold" style={{ color: "var(--ch-primary)" }}>{produk.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Peran Aktif Masyarakat dan Pelaku Ekraf */}
              <div>
                <h3 className="text-[15px] font-extrabold mb-3"
                  style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Peran Aktif Masyarakat dan Pelaku Ekraf
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { role: "Pengrajin Lokal", count: 15, desc: "Menghasilkan produk kriya unggulan seperti tenun, batik, dan kerajinan tangan.", icon: "🎨" },
                    { role: "Pelaku UMKM", count: 23, desc: "Usaha mikro kecil menengah di bidang kuliner, fashion, dan jasa wisata.", icon: "🏪" },
                    { role: "Guide Wisata", count: 8, desc: "Pemandu wisata lokal yang mengenal betul potensi desa.", icon: "🗺️" },
                    { role: "Kreator Konten", count: 12, desc: "Warga yang aktif memproduksi konten digital untuk promosi desa.", icon: "📱" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl border"
                      style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                        style={{ background: "var(--ch-primary)10" }}>
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{item.role}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded"
                            style={{ background: "var(--ch-primary)15", color: "var(--ch-primary)" }}>
                            {item.count} orang
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

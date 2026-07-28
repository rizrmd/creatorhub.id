import { useState } from "react";
import { ArrowLeft, MapPin, Route, Users, Instagram, Youtube, Camera, Eye, Heart, TrendingUp, Award, BarChart3, ChevronRight, Activity } from "lucide-react";
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
  { id: "1", name: "Jakarta Keras", handle: "@jakartakeras", photo: "https://i.pravatar.cc/150?img=10", platforms: [{ name: "instagram", followers: 45000, engagementRate: 2.1 }] },
  { id: "2", name: "Lambe Turah", handle: "@lameturah", photo: "https://i.pravatar.cc/150?img=12", platforms: [{ name: "instagram", followers: 128000, engagementRate: 1.8 }] },
  { id: "3", name: "Info Depok", handle: "@infodepok", photo: "https://i.pravatar.cc/150?img=14", platforms: [{ name: "tiktok", followers: 32000, engagementRate: 4.5 }, { name: "instagram", followers: 18500, engagementRate: 2.7 }] },
  { id: "4", name: "City Of Bandung", handle: "@cityofbandung", photo: "https://i.pravatar.cc/150?img=16", platforms: [{ name: "instagram", followers: 67000, engagementRate: 3.4 }] },
];

const TOP_PERFORMERS = [
  { id: "1", name: "Opie Zahri", handle: "@opiezahri", platform: "instagram", views: 12500, engagement: 0.6, photo: "/opiezahri.jpg", category: "Lifestyle & Creative" },
  { id: "2", name: "Nura Sahirah", handle: "@nurasahirah", platform: "instagram", views: 8300, engagement: 0.8, photo: "/nurasahirah.jpg", category: "Travel & Culture" },
];

const TOP_CREATORS_BY_FOLLOWERS = [
  { id: "1", name: "Opie Zahri", handle: "@opiezahri", platform: "instagram", followers: 6529, photo: "/opiezahri.jpg", category: "Lifestyle & Creative" },
  { id: "2", name: "Nura Sahirah", handle: "@nurasahirah", platform: "instagram", followers: 2017, photo: "/nurasahirah.jpg", category: "Travel & Culture" },
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

function ActivitiesCard() {
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
                <tr key={`${account.id}-${platform.name}`} className="hover:bg-black/[0.02] transition-colors">
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

      {/* Description & Location */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border p-5"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <h2 className="text-[15px] font-extrabold mb-3"
            style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Tentang Gampong Nusa
          </h2>
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>
            {GAMPONG_NUSA.description}
          </p>
        </div>
        <div className="rounded-xl border p-5"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 items-stretch">
        {/* Map - left 2/3 */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border overflow-hidden h-full flex flex-col"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <div className="px-5 py-3 border-b shrink-0" style={{ borderColor: "var(--ch-border)" }}>
              <h2 className="text-[15px] font-extrabold"
                style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Peta Lokasi
              </h2>
            </div>
            <div className="flex-1 min-h-[500px]" style={{ background: "#0B1120" }}>
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

        {/* Right Sidebar - Account Monitoring */}
        <div className="lg:col-span-1">
          <ActivitiesCard />
        </div>
      </div>

      {/* 2 Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Performing Creators */}
        <div className="rounded-xl border overflow-hidden"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--ch-border)" }}>
            <BarChart3 className="w-4 h-4 text-green-500" />
            <h3 className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>Top Performing Creators</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--ch-border)" }}>
            {TOP_PERFORMERS.map((c, i) => (
              <div key={c.id} className="px-4 py-3 flex items-center gap-3 hover:bg-black/[0.02] transition-colors">
                <span className="text-[11px] font-extrabold w-5 text-center shrink-0"
                  style={{ color: i === 0 ? "#F59E0B" : i === 1 ? "#94A3B8" : i === 2 ? "#CD7F32" : "var(--ch-text-muted)" }}>
                  #{i + 1}
                </span>
                <img src={c.photo} alt={c.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold truncate" style={{ color: "var(--ch-text)" }}>{c.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {platformIcon(c.platform)}
                    <span className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{c.category}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] font-extrabold flex items-center gap-1" style={{ color: "var(--ch-text)" }}>
                    <Eye className="w-3 h-3" /> {formatNum(c.views)}
                  </p>
                  <p className="text-[10px] font-semibold" style={{ color: "#16A34A" }}>
                    {c.engagement}% eng.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Creators by Most Followers */}
        <div className="rounded-xl border overflow-hidden"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--ch-border)" }}>
            <Award className="w-4 h-4 text-orange-500" />
            <h3 className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>Content Creators by Most Followers</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--ch-border)" }}>
            {TOP_CREATORS_BY_FOLLOWERS.map((c, i) => (
              <div key={c.id} className="px-4 py-3 flex items-center gap-3 hover:bg-black/[0.02] transition-colors">
                <span className="text-[11px] font-extrabold w-5 text-center shrink-0"
                  style={{ color: i === 0 ? "#F59E0B" : i === 1 ? "#94A3B8" : i === 2 ? "#CD7F32" : "var(--ch-text-muted)" }}>
                  #{i + 1}
                </span>
                <img src={c.photo} alt={c.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold truncate" style={{ color: "var(--ch-text)" }}>{c.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {platformIcon(c.platform)}
                    <span className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{c.handle}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-extrabold" style={{ color: "var(--ch-text)" }}>
                    {formatNum(c.followers)}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>followers</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

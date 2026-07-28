import { ArrowLeft, MapPin, Route, Users, Instagram, Youtube, Camera } from "lucide-react";
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

const KREATOR_DATA = [
  {
    id: "1",
    name: "Putri Rahmawati",
    handle: "@putri.nusa.travel",
    platform: "instagram" as const,
    followers: 12400,
    photo: "https://i.pravatar.cc/150?img=1",
    category: "Travel & Lifestyle",
  },
  {
    id: "2",
    name: "Faisal Ramadhan",
    handle: "@faisal.nusa.food",
    platform: "instagram" as const,
    followers: 8700,
    photo: "https://i.pravatar.cc/150?img=3",
    category: "Food & Culinary",
  },
  {
    id: "3",
    name: "Nisa Aulia",
    handle: "@nisa.nusa.vlog",
    platform: "youtube" as const,
    followers: 15200,
    photo: "https://i.pravatar.cc/150?img=5",
    category: "Vlog & Education",
  },
];

function formatFollowers(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function platformIcon(p: string) {
  if (p === "instagram") return <Instagram className="w-3.5 h-3.5" />;
  if (p === "youtube") return <Youtube className="w-3.5 h-3.5" />;
  return <Camera className="w-3.5 h-3.5" />;
}

export default function GampongNusa() {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-6" style={{ background: "var(--ch-bg)" }}>
      {/* Back button */}
      <button
        onClick={() => navigate("/dashboard/ekrafhub/desa-kreative")}
        className="flex items-center gap-2 text-[13px] font-semibold mb-4 transition-colors hover:opacity-80"
        style={{ color: "var(--ch-primary)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Peta Desa Kreatif
      </button>

      {/* Hero Section */}
      <div className="rounded-xl border overflow-hidden mb-6"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        {/* Gradient banner */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Description */}
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

          {/* Location & Route */}
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

          {/* Map */}
          <div className="rounded-xl border overflow-hidden"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <div className="px-5 py-3 border-b" style={{ borderColor: "var(--ch-border)" }}>
              <h2 className="text-[15px] font-extrabold"
                style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Peta Lokasi
              </h2>
            </div>
            <div className="h-[300px]" style={{ background: "#0B1120" }}>
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

        {/* Sidebar - Creator table */}
        <div className="space-y-4">
          {/* Creator count */}
          <div className="rounded-xl border p-4"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-orange-500/10 text-orange-500">
                <Users className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[22px] font-extrabold" style={{ color: "var(--ch-text)" }}>{KREATOR_DATA.length}</p>
                <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>Kreator Aktif</p>
              </div>
            </div>
          </div>

          {/* Creator list */}
          <div className="rounded-xl border overflow-hidden"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: "var(--ch-border)" }}>
              <h3 className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>
                Daftar Konten Kreator
              </h3>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>
                Kreator yang berdomisili di Gampong Nusa
              </p>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--ch-border)" }}>
              {KREATOR_DATA.map((k) => (
                <div key={k.id} className="px-4 py-3 flex items-center gap-3 hover:bg-black/[0.02] transition-colors">
                  <img
                    src={k.photo}
                    alt={k.name}
                    className="w-10 h-10 rounded-full object-cover border-2 shrink-0"
                    style={{ borderColor: "var(--ch-border)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold truncate" style={{ color: "var(--ch-text)" }}>{k.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span style={{ color: "#E1306C" }}>{platformIcon(k.platform)}</span>
                      <span className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{k.handle}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] font-extrabold" style={{ color: "var(--ch-text)" }}>
                      {formatFollowers(k.followers)}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{k.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

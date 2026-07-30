import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, Polyline, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { FeatureCollection } from "geojson";
import * as topojson from "topojson-client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Sprout, TrendingUp, MapPin, X, ChevronDown, Clock, Eye, Heart, MessageCircle, BarChart3, Award, Instagram, Youtube, Camera, Compass } from "lucide-react";

const PROVINCE_URL = "https://gist.githubusercontent.com/ajie31/3144875bad9705e2b2b544909c022276/raw/Peta%20Indonesia%20Provinsi.json";

interface ProvincePoint {
  name: string;
  count: number;
  lat: number;
  lng: number;
  markerLat: number;
  markerLng: number;
  region: string;
}

const PROVINCE_DATA: ProvincePoint[] = [
  { name: "Aceh", count: 10, lat: 4.6951, lng: 96.7494, markerLat: 4.6951, markerLng: 96.7494, region: "Sumatera" },
  { name: "Sumatera Utara", count: 10, lat: 2.1154, lng: 99.5451, markerLat: 2.1154, markerLng: 99.5451, region: "Sumatera" },
  { name: "Sumatera Barat", count: 7, lat: -0.7399, lng: 100.8000, markerLat: -0.7399, markerLng: 100.8000, region: "Sumatera" },
  { name: "Riau", count: 4, lat: 1.7600, lng: 102.2700, markerLat: 1.7600, markerLng: 102.2700, region: "Sumatera" },
  { name: "Sumatera Selatan", count: 4, lat: -3.3194, lng: 103.9144, markerLat: -3.3194, markerLng: 103.9144, region: "Sumatera" },
  { name: "Kep. Bangka Belitung", count: 4, lat: -2.7411, lng: 106.4406, markerLat: -2.7411, markerLng: 106.4406, region: "Sumatera" },
  { name: "Bengkulu", count: 5, lat: -3.5778, lng: 102.3464, markerLat: -3.5778, markerLng: 102.3464, region: "Sumatera" },
  { name: "Lampung", count: 5, lat: -4.5586, lng: 105.4068, markerLat: -4.5586, markerLng: 105.4068, region: "Sumatera" },
  { name: "Banten", count: 5, lat: -6.4058, lng: 106.0640, markerLat: -6.4058, markerLng: 106.0640, region: "Jawa" },
  { name: "Jawa Barat", count: 12, lat: -6.9175, lng: 107.6191, markerLat: -6.9175, markerLng: 107.6191, region: "Jawa" },
  { name: "Jawa Tengah", count: 24, lat: -7.1510, lng: 110.1403, markerLat: -7.1510, markerLng: 110.1403, region: "Jawa" },
  { name: "DI Yogyakarta", count: 9, lat: -7.7972, lng: 110.3688, markerLat: -7.7972, markerLng: 110.3688, region: "Jawa" },
  { name: "Jawa Timur", count: 9, lat: -7.5361, lng: 112.2384, markerLat: -7.5361, markerLng: 112.2384, region: "Jawa" },
  { name: "Bali", count: 4, lat: -8.3405, lng: 115.0920, markerLat: -8.3405, markerLng: 115.0920, region: "Bali & Nusa Tenggara" },
  { name: "Nusa Tenggara Barat", count: 5, lat: -8.6529, lng: 117.3616, markerLat: -8.6529, markerLng: 117.3616, region: "Bali & Nusa Tenggara" },
  { name: "Nusa Tenggara Timur", count: 4, lat: -8.6574, lng: 121.0794, markerLat: -8.6574, markerLng: 121.0794, region: "Bali & Nusa Tenggara" },
  { name: "Kalimantan Barat", count: 4, lat: -0.2788, lng: 111.4753, markerLat: -0.2788, markerLng: 111.4753, region: "Kalimantan" },
  { name: "Kalimantan Selatan", count: 5, lat: -3.0926, lng: 115.2838, markerLat: -3.0926, markerLng: 115.2838, region: "Kalimantan" },
  { name: "Kalimantan Timur", count: 4, lat: 0.5071, lng: 116.4194, markerLat: 0.5071, markerLng: 116.4194, region: "Kalimantan" },
  { name: "Kalimantan Utara", count: 4, lat: 2.8377, lng: 116.5687, markerLat: 2.8377, markerLng: 116.5687, region: "Kalimantan" },
  { name: "Sulawesi Utara", count: 4, lat: 0.6247, lng: 123.9750, markerLat: 0.6247, markerLng: 123.9750, region: "Sulawesi" },
  { name: "Sulawesi Selatan", count: 6, lat: -3.6688, lng: 119.9741, markerLat: -3.6688, markerLng: 119.9741, region: "Sulawesi" },
  { name: "Sulawesi Tenggara", count: 6, lat: -4.1449, lng: 122.1748, markerLat: -4.1449, markerLng: 122.1748, region: "Sulawesi" },
  { name: "Gorontalo", count: 4, lat: 0.5435, lng: 123.0568, markerLat: 0.5435, markerLng: 123.0568, region: "Sulawesi" },
  { name: "Maluku", count: 5, lat: -3.2385, lng: 130.1453, markerLat: -3.2385, markerLng: 130.1453, region: "Maluku & Papua" },
  { name: "Maluku Utara", count: 4, lat: 1.5710, lng: 127.8088, markerLat: 1.5710, markerLng: 127.8088, region: "Maluku & Papua" },
  { name: "Papua", count: 5, lat: -3.0, lng: 139.5, markerLat: -3.0, markerLng: 139.5, region: "Maluku & Papua" },
  { name: "Papua Barat", count: 4, lat: -1.5, lng: 133.5, markerLat: -1.5, markerLng: 133.5, region: "Maluku & Papua" },
  { name: "Papua Barat Daya", count: 4, lat: -0.9, lng: 131.5, markerLat: -0.9, markerLng: 131.5, region: "Maluku & Papua" },
  { name: "Papua Tengah", count: 4, lat: -3.5, lng: 136.0, markerLat: -3.5, markerLng: 136.0, region: "Maluku & Papua" },
];

const TOTAL_DESA = PROVINCE_DATA.reduce((s, p) => s + p.count, 0);

const REGION_COLORS: Record<string, string> = {
  "Sumatera": "#F97316",
  "Jawa": "#3B82F6",
  "Bali & Nusa Tenggara": "#10B981",
  "Kalimantan": "#8B5CF6",
  "Sulawesi": "#EC4899",
  "Maluku & Papua": "#F59E0B",
};

const REGIONS = Object.keys(REGION_COLORS);

interface Village {
  name: string;
  location: string;
  slug?: string;
}

const PROVINCE_VILLAGES: Record<string, Village[]> = {
  "Aceh": [
    { name: "Gampong Nusa", location: "Aceh Besar", slug: "gampongnusa" },
    { name: "Desa Wisata Jaboi", location: "Sabang" },
    { name: "Gampong Lampulo", location: "Banda Aceh" },
    { name: "Desa Iboih", location: "Sabang" },
    { name: "Gampong Ulee Lhue", location: "Banda Aceh" },
    { name: "Desa Alue Jang", location: "Aceh Jaya" },
    { name: "Desa Aneuk Laot", location: "Sabang" },
    { name: "Desa Suak Timah", location: "Aceh Barat" },
    { name: "Desa Geunteut", location: "Aceh Besar" },
    { name: "Desa Ulee Nyeue", location: "Aceh Utara" },
  ],
};

const LAST_ACTIVITIES = [
  { id: "1", name: "Putri Rahmawati", handle: "@putri.nusa.travel", platform: "instagram", action: "posted a reel", content: "Sunrise di Bukit Gampong Nusa", time: "2 jam lalu", likes: 1240, comments: 89, photo: "https://i.pravatar.cc/150?img=1" },
  { id: "2", name: "Faisal Ramadhan", handle: "@faisal.nusa.food", platform: "instagram", action: "posted a carousel", content: "Kuliner Khas Aceh di Desa Nusa", time: "5 jam lalu", likes: 892, comments: 54, photo: "https://i.pravatar.cc/150?img=3" },
  { id: "3", name: "Nisa Aulia", handle: "@nisa.nusa.vlog", platform: "youtube", action: "uploaded a video", content: "Vlog: Sehari di Gampong Nusa", time: "1 hari lalu", likes: 2100, comments: 156, photo: "https://i.pravatar.cc/150?img=5" },
  { id: "4", name: "Rizky Pratama", handle: "@rizky.nusa.tiktok", platform: "tiktok", action: "posted a video", content: "Eco-Tourism Gampong Nusa Tour", time: "2 hari lalu", likes: 3400, comments: 210, photo: "https://i.pravatar.cc/150?img=7" },
];

const HOMELESS_MEDIA_ACTIVITIES = [
  { id: "1", name: "Jakarta Keras", handle: "@jakartakeras", platform: "instagram", action: "posted a story", content: "Update terkini proyek desa kreatif", time: "1 jam lalu", likes: 560, comments: 32, photo: "https://i.pravatar.cc/150?img=10" },
  { id: "2", name: "Lambe Turah", handle: "@lameturah", platform: "instagram", action: "posted a reel", content: "Behind the scene content creation", time: "3 jam lalu", likes: 1200, comments: 78, photo: "https://i.pravatar.cc/150?img=12" },
  { id: "3", name: "Info Depok", handle: "@infodepok", platform: "tiktok", action: "posted a video", content: "Potensi desa kreatif di Depok", time: "8 jam lalu", likes: 890, comments: 45, photo: "https://i.pravatar.cc/150?img=14" },
  { id: "4", name: "City Of Bandung", handle: "@cityofbandung", platform: "instagram", action: "posted a carousel", content: "Wisata desa kreatif Bandung", time: "1 hari lalu", likes: 1500, comments: 92, photo: "https://i.pravatar.cc/150?img=16" },
];

const TOP_PERFORMERS = [
  { id: "1", name: "Nisa Aulia", handle: "@nisa.nusa.vlog", platform: "youtube", views: 45200, engagement: 8.7, photo: "https://i.pravatar.cc/150?img=5", category: "Vlog & Education" },
  { id: "2", name: "Rizky Pratama", handle: "@rizky.nusa.tiktok", platform: "tiktok", views: 38500, engagement: 12.3, photo: "https://i.pravatar.cc/150?img=7", category: "Travel & Eco-Tourism" },
  { id: "3", name: "Putri Rahmawati", handle: "@putri.nusa.travel", platform: "instagram", views: 28900, engagement: 6.5, photo: "https://i.pravatar.cc/150?img=1", category: "Travel & Lifestyle" },
  { id: "4", name: "Faisal Ramadhan", handle: "@faisal.nusa.food", platform: "instagram", views: 19200, engagement: 5.2, photo: "https://i.pravatar.cc/150?img=3", category: "Food & Culinary" },
];

const TOP_CREATORS_BY_FOLLOWERS = [
  { id: "3", name: "Nisa Aulia", handle: "@nisa.nusa.vlog", platform: "youtube", followers: 15200, photo: "https://i.pravatar.cc/150?img=5", category: "Vlog & Education" },
  { id: "1", name: "Putri Rahmawati", handle: "@putri.nusa.travel", platform: "instagram", followers: 12400, photo: "https://i.pravatar.cc/150?img=1", category: "Travel & Lifestyle" },
  { id: "4", name: "Rizky Pratama", handle: "@rizky.nusa.tiktok", platform: "tiktok", followers: 9800, photo: "https://i.pravatar.cc/150?img=7", category: "Travel & Eco-Tourism" },
  { id: "2", name: "Faisal Ramadhan", handle: "@faisal.nusa.food", platform: "instagram", followers: 8700, photo: "https://i.pravatar.cc/150?img=3", category: "Food & Culinary" },
];

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function platformIcon(p: string) {
  if (p === "instagram") return <Instagram className="w-3.5 h-3.5" style={{ color: "#E1306C" }} />;
  if (p === "youtube") return <Youtube className="w-3.5 h-3.5" style={{ color: "#FF0000" }} />;
  if (p === "tiktok") return <Camera className="w-3.5 h-3.5" style={{ color: "#000" }} />;
  return <Camera className="w-3.5 h-3.5" />;
}

function getMarkerSize(count: number): number {
  if (count >= 20) return 34;
  if (count >= 10) return 28;
  if (count >= 6) return 24;
  return 22;
}

function createMarkerIcon(p: ProvincePoint, isSelected: boolean): L.DivIcon {
  const size = getMarkerSize(p.count);
  const hasLine = Math.abs(p.lat - p.markerLat) > 0.3 || Math.abs(p.lng - p.markerLng) > 0.3;
  const html = `
    <div style="position:relative;cursor:pointer;display:flex;flex-direction:column;align-items:center;${isSelected ? "z-index:9999;" : ""}">
      <div style="
        width:${size}px;height:${size}px;border-radius:50%;
        background:${isSelected ? "#FB923C" : "#F97316"};
        border:2.5px solid #fff;
        box-shadow:0 2px 8px rgba(0,0,0,0.4),0 0 0 1px rgba(249,115,22,0.3);
        display:flex;align-items:center;justify-content:center;
        font-weight:800;font-size:${p.count >= 10 ? 11 : 12}px;color:#fff;
        font-family:'Plus Jakarta Sans',sans-serif;
        transition:transform 0.15s,box-shadow 0.15s;
        ${isSelected ? "transform:scale(1.15);box-shadow:0 4px 16px rgba(249,115,22,0.5);" : ""}
      ">${p.count}</div>
      <div style="
        margin-top:2px;
        font-size:9px;font-weight:700;color:#F97316;
        text-shadow:0 1px 3px rgba(0,0,0,0.8),0 0 8px rgba(0,0,0,0.6);
        white-space:nowrap;letter-spacing:0.2px;
        font-family:'Plus Jakarta Sans',sans-serif;
      ">${p.name}</div>
      ${hasLine ? `<div style="
        position:absolute;top:${size / 2}px;left:50%;
        width:6px;height:6px;border-radius:50%;
        background:rgba(249,115,22,0.5);
        transform:translate(-50%,-50%);
      "></div>` : ""}
    </div>
  `;
  return L.divIcon({
    html,
    className: "",
    iconSize: [size + 20, size + 20],
    iconAnchor: [(size + 20) / 2, size / 2],
  });
}

function MapEventsHandler({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({ click: () => onMapClick() });
  return null;
}

function LastActivitiesCard() {
  const [activeTab, setActiveTab] = useState<"koc" | "homeless">("koc");
  const data = activeTab === "koc" ? LAST_ACTIVITIES : HOMELESS_MEDIA_ACTIVITIES;

  return (
    <div className="rounded-xl border overflow-hidden"
      style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
      <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--ch-border)" }}>
        <Clock className="w-4 h-4 text-blue-500" />
        <h3 className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>Last Activities</h3>
      </div>
      {/* Tabs */}
      <div className="px-4 py-2 border-b flex items-center gap-1" style={{ borderColor: "var(--ch-border)" }}>
        <button
          onClick={() => setActiveTab("koc")}
          className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors"
          style={activeTab === "koc"
            ? { background: "var(--ch-primary)", color: "#fff" }
            : { background: "var(--ch-muted)", color: "var(--ch-text-muted)" }}
        >
          Key Opinion Community
        </button>
        <button
          onClick={() => setActiveTab("homeless")}
          className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors"
          style={activeTab === "homeless"
            ? { background: "#8B5CF6", color: "#fff" }
            : { background: "var(--ch-muted)", color: "var(--ch-text-muted)" }}
        >
          Homeless Media
        </button>
      </div>
      <div className="divide-y" style={{ borderColor: "var(--ch-border)" }}>
        {data.map((a) => (
          <div key={a.id} className="px-4 py-3 hover:bg-black/[0.02] transition-colors">
            <div className="flex items-center gap-2 mb-1.5">
              <img src={a.photo} alt={a.name} className="w-7 h-7 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold truncate" style={{ color: "var(--ch-text)" }}>{a.name}</p>
                <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{a.time}</p>
              </div>
              {platformIcon(a.platform)}
            </div>
            <p className="text-[11px] mb-1" style={{ color: "var(--ch-text-muted)" }}>
              <span className="font-semibold" style={{ color: "var(--ch-text)" }}>{a.action}</span> — {a.content}
            </p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--ch-text-muted)" }}>
                <Heart className="w-3 h-3" /> {formatNum(a.likes)}
              </span>
              <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--ch-text-muted)" }}>
                <MessageCircle className="w-3 h-3" /> {a.comments}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapViewController() {
  const map = useMap();
  useEffect(() => {
    map.setView([-2.5, 118.0], 5);
    map.scrollWheelZoom.enable();
    const container = map.getContainer();
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", onWheel);
    };
  }, [map]);
  return null;
}

export default function DesaKreative() {
  const [provinceGeoJson, setProvinceGeoJson] = useState<FeatureCollection | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedProvince, setSelectedProvince] = useState<ProvincePoint | null>(null);
  const [selectedDropdown, setSelectedDropdown] = useState<string>("all");
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    fetch(PROVINCE_URL)
      .then((r) => r.json())
      .then((topo: any) => {
        setProvinceGeoJson(topojson.feature(topo, topo.objects.gadm36_IDN_1) as unknown as FeatureCollection);
      })
      .catch(() => {});
  }, []);

  const regionProvinces = useMemo(() => {
    if (selectedRegion === "all") return PROVINCE_DATA;
    return PROVINCE_DATA.filter((p) => p.region === selectedRegion);
  }, [selectedRegion]);

  const displayProvinces = useMemo(() => {
    if (selectedDropdown === "all") return regionProvinces;
    return regionProvinces.filter((p) => p.name === selectedDropdown);
  }, [regionProvinces, selectedDropdown]);

  const handleProvinceClick = useCallback((p: ProvincePoint) => {
    setSelectedProvince(p);
    setSelectedDropdown(p.name);
    mapRef.current?.setView([p.lat, p.lng], 6);
  }, []);

  const handleMapClick = useCallback(() => {
    setSelectedProvince(null);
  }, []);

  const handleDropdownChange = useCallback((value: string) => {
    setSelectedDropdown(value);
    if (value === "all") {
      setSelectedProvince(null);
      mapRef.current?.setView([-2.5, 118.0], 5);
    } else {
      const p = PROVINCE_DATA.find((pr) => pr.name === value);
      if (p) {
        setSelectedProvince(p);
        mapRef.current?.setView([p.lat, p.lng], 6);
      }
    }
  }, []);

  return (
    <div className="p-4 md:p-6" style={{ background: "var(--ch-bg)" }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #F97316, #FB923C)", color: "white" }}>
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
              style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Desa Kreatif
            </h1>
            <p className="text-[13px]" style={{ color: "var(--ch-text-muted)" }}>
              Peta Sebaran Usulan Pilot Project Desa/Kelurahan Kreatif
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border p-4"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-orange-500/10 text-orange-500">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[22px] font-extrabold" style={{ color: "var(--ch-text)" }}>133</p>
              <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>Kab/Kota di 31 Provinsi</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border p-4"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-500">
              <Sprout className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[22px] font-extrabold" style={{ color: "var(--ch-text)" }}>{TOTAL_DESA}</p>
              <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>Desa/Kelurahan Berpotensi Ekraf</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border p-4"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-green-500/10 text-green-500">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[22px] font-extrabold" style={{ color: "var(--ch-text)" }}>31</p>
              <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>Provinsi Teridentifikasi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map - Full Width */}
      <div className="mb-6">
        <div className="rounded-xl border overflow-hidden"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          {/* Map title */}
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--ch-border)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <h2 className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>
                  PETA SEBARAN USULAN PILOT PROJECT DESA/KELURAHAN KREATIF
                </h2>
              </div>
              <button
                className="group flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #F97316, #FB923C, #F59E0B)",
                  boxShadow: "0 2px 12px rgba(249,115,22,0.3)",
                }}
                onClick={() => {
                  const el = document.getElementById("desa-sebaran-chart");
                  el?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
              >
                <Compass className="w-4 h-4 animate-[spin_3s_linear_infinite]" />
                <span>Discover</span>
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-[10px] font-extrabold">
                  {TOTAL_DESA}
                </span>
              </button>
            </div>
            <p className="text-[12px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
              133 Kab/Kota di 31 Provinsi — total {TOTAL_DESA} desa/kelurahan berpotensi ekraf
            </p>
          </div>

          {/* Region tabs */}
          <div className="px-4 py-2.5 border-b flex items-center gap-2 overflow-x-auto" style={{ borderColor: "var(--ch-border)" }}>
            <button
              onClick={() => { setSelectedRegion("all"); setSelectedDropdown("all"); setSelectedProvince(null); }}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors shrink-0"
              style={selectedRegion === "all"
                ? { background: "var(--ch-primary)", color: "#fff" }
                : { background: "var(--ch-muted)", color: "var(--ch-text-muted)" }}
            >
              Semua Wilayah
            </button>
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => { setSelectedRegion(r); setSelectedDropdown("all"); setSelectedProvince(null); }}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors shrink-0"
                style={selectedRegion === r
                  ? { background: REGION_COLORS[r], color: "#fff" }
                  : { background: "var(--ch-muted)", color: "var(--ch-text-muted)" }}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="relative h-[480px]" style={{ background: "#0B1120" }}>
            <MapContainer
              ref={mapRef}
              center={[-2.5, 118.0]}
              zoom={5}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%", background: "#0B1120" }}
              zoomControl={false}
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
              />
              <MapViewController />
              <MapEventsHandler onMapClick={handleMapClick} />
              {provinceGeoJson && (
                <GeoJSON
                  data={provinceGeoJson}
                  style={() => ({
                    fillColor: "#3B82F6",
                    fillOpacity: 0.25,
                    color: "#60A5FA",
                    weight: 0.3,
                  })}
                />
              )}
              {displayProvinces.map((p) => {
                const hasLine = Math.abs(p.lat - p.markerLat) > 0.3 || Math.abs(p.lng - p.markerLng) > 0.3;
                return (
                  <div key={p.name}>
                    {hasLine && (
                      <Polyline
                        positions={[[p.lat, p.lng], [p.markerLat, p.markerLng]]}
                        pathOptions={{ color: "rgba(249,115,22,0.5)", weight: 1.5, dashArray: "4 3" }}
                      />
                    )}
                    <Polyline
                      positions={[[p.lat, p.lng], [p.markerLat, p.markerLng]]}
                      pathOptions={{ color: "transparent", weight: 0 }}
                      eventHandlers={{ click: () => handleProvinceClick(p) }}
                    />
                  </div>
                );
              })}
              {displayProvinces.map((p) => (
                <MarkerWithIcon
                  key={p.name}
                  position={[p.markerLat, p.markerLng]}
                  icon={createMarkerIcon(p, selectedProvince?.name === p.name)}
                  onClick={() => handleProvinceClick(p)}
                />
              ))}
            </MapContainer>

            {/* Province popup */}
            {selectedProvince && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-4 right-4 z-[1000] rounded-xl border p-4 w-80 max-h-[80vh] overflow-y-auto"
                style={{ background: "rgba(15,23,42,0.95)", borderColor: "rgba(249,115,22,0.4)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: REGION_COLORS[selectedProvince.region] }} />
                    <span className="text-[11px] font-semibold" style={{ color: REGION_COLORS[selectedProvince.region] }}>
                      {selectedProvince.region}
                    </span>
                  </div>
                  <button onClick={() => { setSelectedProvince(null); setSelectedDropdown("all"); }} className="text-white/40 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[15px] font-extrabold text-white mb-1">{selectedProvince.name}</p>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-[28px] font-extrabold" style={{ color: "#F97316" }}>{selectedProvince.count}</span>
                  <span className="text-[12px] text-white/50">desa/kelurahan</span>
                </div>
                {PROVINCE_VILLAGES[selectedProvince.name] && (
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-[11px] font-bold text-white/60 mb-2 uppercase tracking-wider">Desa/Kelurahan Kreatif</p>
                    <div className="space-y-2">
                      {PROVINCE_VILLAGES[selectedProvince.name].map((v, i) => (
                        v.slug ? (
                          <a
                            key={i}
                            href={`/dashboard/ekrafhub/desa-kreatif/${v.slug}`}
                            className="block rounded-lg p-2.5 transition-colors hover:bg-white/10"
                            style={{ background: "rgba(255,255,255,0.05)" }}
                          >
                            <div className="flex items-start gap-2">
                              <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                                style={{ background: "#F97316", color: "#fff" }}>{i + 1}</span>
                              <div className="min-w-0">
                                <p className="text-[12px] font-bold text-orange-400 hover:text-orange-300">{v.name}</p>
                                <p className="text-[10px] text-white/40 mt-0.5">{v.location}</p>
                              </div>
                            </div>
                          </a>
                        ) : (
                          <div key={i} className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.05)" }}>
                            <div className="flex items-start gap-2">
                              <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                                style={{ background: "#F97316", color: "#fff" }}>{i + 1}</span>
                              <div className="min-w-0">
                                <p className="text-[12px] font-bold text-white">{v.name}</p>
                                <p className="text-[10px] text-white/40 mt-0.5">{v.location}</p>
                              </div>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
                {!PROVINCE_VILLAGES[selectedProvince.name] && (
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-[11px] text-white/30 italic">Data desa kreatif belum tersedia</p>
                  </div>
                )}
              </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-[1000] rounded-lg border p-3"
              style={{ background: "rgba(15,23,42,0.9)", borderColor: "rgba(255,255,255,0.1)" }}>
              <p className="text-[10px] font-bold text-white/60 mb-2 uppercase tracking-wider">Legenda</p>
              <div className="space-y-1.5">
                {[
                  { label: "20+ desa", opacity: 0.7 },
                  { label: "10-19 desa", opacity: 0.5 },
                  { label: "5-9 desa", opacity: 0.35 },
                  { label: "1-4 desa", opacity: 0.2 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ background: `rgba(59,130,246,${item.opacity})` }} />
                    <span className="text-[10px] text-white/50">{item.label}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#F97316", border: "1.5px solid #fff" }} />
                  <span className="text-[10px] text-white/50">Jumlah desa/kelurahan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Province dropdown below map */}
          <div className="px-4 py-3 border-t flex items-center gap-3 flex-wrap" style={{ borderColor: "var(--ch-border)" }}>
            <span className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Filter Provinsi:</span>
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <select
                value={selectedDropdown}
                onChange={(e) => handleDropdownChange(e.target.value)}
                className="w-full appearance-none px-3 py-2 pr-8 rounded-lg text-[12px] font-semibold border cursor-pointer"
                style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
              >
                <option value="all">Semua Provinsi</option>
                {[...regionProvinces].sort((a, b) => b.count - a.count).map((p) => (
                  <option key={p.name} value={p.name}>{p.name} ({p.count})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--ch-text-muted)" }} />
            </div>
            {selectedDropdown !== "all" && (
              <button
                onClick={() => handleDropdownChange("all")}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors"
                style={{ background: "var(--ch-muted)", color: "var(--ch-text-muted)" }}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3 Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Last Activities with Tabs */}
        <LastActivitiesCard />

        {/* Top Performing Creators */}
        <div className="rounded-xl border overflow-hidden"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--ch-border)" }}>
            <BarChart3 className="w-4 h-4 text-green-500" />
            <h3 className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>Top Performing Content Creators</h3>
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

      {/* Bar Chart */}
      <div id="desa-sebaran-chart" className="mt-6 rounded-xl border overflow-hidden"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--ch-border)" }}>
          <h2 className="text-[15px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Peta Sebaran Usulan Pilot Project Desa/Kelurahan Kreatif
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#3B82F6" }} />
            <span className="text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Jumlah Desa</span>
          </div>
        </div>
        <div className="px-5 pt-4 pb-2">
          <p className="text-[18px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            31 Provinsi
          </p>
        </div>
        <div className="px-2 pb-4" style={{ height: 380 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={PROVINCE_DATA}
              margin={{ top: 8, right: 12, left: 0, bottom: 55 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fontWeight: 600, fill: "var(--ch-text-muted)", angle: -45, textAnchor: "end" }}
                axisLine={{ stroke: "var(--ch-border)" }}
                tickLine={false}
                interval={0}
                height={60}
              />
              <YAxis
                tick={{ fontSize: 11, fontWeight: 600, fill: "var(--ch-text-muted)" }}
                axisLine={false}
                tickLine={false}
                domain={[0, 26]}
                ticks={[0, 5, 10, 15, 20, 25]}
              />
              <Tooltip
                cursor={{ fill: "rgba(249,115,22,0.08)" }}
                contentStyle={{
                  background: "rgba(15,23,42,0.95)",
                  border: "1px solid rgba(249,115,22,0.3)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#fff",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                }}
                formatter={(value, _name, props: any) => [`${value} desa`, props.payload.name]}
                labelFormatter={() => ""}
              />
              <Bar
                dataKey="count"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
                label={{ position: "top", fontSize: 11, fontWeight: 700, fill: "#3B82F6", offset: 4 }}
              >
                {PROVINCE_DATA.map((entry) => (
                  <Cell key={entry.name} fill="#3B82F6" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MarkerWithIcon({ position, icon, onClick }: {
  position: [number, number];
  icon: L.DivIcon;
  onClick: () => void;
}) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const marker = L.marker(position, { icon, interactive: true })
      .addTo(map);
    marker.on("click", onClick);
    markerRef.current = marker;
    return () => { marker.remove(); };
  }, [map, position[0], position[1], icon, onClick]);

  return null;
}

import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Users, ArrowLeft,
  Megaphone, Newspaper, Podcast, Radio,
  Send,
} from "lucide-react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import type { GeoJSON as LeafletGeoJSON } from "leaflet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/* ---------- Types ---------- */
interface ProvinceData {
  name: string;
  count: number;
  studioNum: number;
  baseLat: number;
  baseLng: number;
}

/* ---------- Data ---------- */
const PROVINCES: ProvinceData[] = [
  { name: "Aceh", studioNum: 1, baseLat: 5.5483, baseLng: 95.3238, count: 16 },
  { name: "North Sumatra", studioNum: 1, baseLat: 3.5952, baseLng: 98.6722, count: 52 },
  { name: "West Sumatra", studioNum: 1, baseLat: -0.9471, baseLng: 100.4172, count: 20 },
  { name: "Riau", studioNum: 1, baseLat: 0.5071, baseLng: 101.4478, count: 25 },
  { name: "Riau Islands", studioNum: 1, baseLat: 1.0881, baseLng: 104.0305, count: 14 },
  { name: "Jambi", studioNum: 1, baseLat: -1.6101, baseLng: 103.6131, count: 10 },
  { name: "South Sumatra", studioNum: 1, baseLat: -2.9909, baseLng: 104.7567, count: 28 },
  { name: "Bengkulu", studioNum: 1, baseLat: -3.7928, baseLng: 102.2608, count: 10 },
  { name: "Lampung", studioNum: 1, baseLat: -5.3971, baseLng: 105.2663, count: 28 },
  { name: "Bangka Belitung", studioNum: 1, baseLat: -2.1301, baseLng: 106.1161, count: 8 },
  { name: "Banten", studioNum: 1, baseLat: -6.1149, baseLng: 106.1502, count: 62 },
  { name: "DKI Jakarta", studioNum: 1, baseLat: -6.2088, baseLng: 106.8456, count: 140 },
  { name: "West Java", studioNum: 1, baseLat: -6.9175, baseLng: 107.6191, count: 185 },
  { name: "Central Java", studioNum: 1, baseLat: -6.9667, baseLng: 110.4167, count: 128 },
  { name: "DI Yogyakarta", studioNum: 1, baseLat: -7.7956, baseLng: 110.3695, count: 52 },
  { name: "East Java", studioNum: 1, baseLat: -7.2575, baseLng: 112.7521, count: 152 },
  { name: "Bali", studioNum: 1, baseLat: -8.6705, baseLng: 115.2126, count: 38 },
  { name: "West Nusa Tenggara", studioNum: 1, baseLat: -8.5833, baseLng: 116.1167, count: 16 },
  { name: "East Nusa Tenggara", studioNum: 1, baseLat: -10.1772, baseLng: 123.607, count: 12 },
  { name: "West Kalimantan", studioNum: 1, baseLat: -0.0263, baseLng: 109.3425, count: 18 },
  { name: "Central Kalimantan", studioNum: 1, baseLat: -2.2083, baseLng: 113.9167, count: 10 },
  { name: "South Kalimantan", studioNum: 1, baseLat: -3.3167, baseLng: 114.59, count: 14 },
  { name: "East Kalimantan", studioNum: 1, baseLat: -1.2654, baseLng: 116.8312, count: 14 },
  { name: "North Kalimantan", studioNum: 1, baseLat: 3.3, baseLng: 117.6333, count: 8 },
  { name: "North Sulawesi", studioNum: 1, baseLat: 1.4748, baseLng: 124.8428, count: 12 },
  { name: "Gorontalo", studioNum: 1, baseLat: 0.543, baseLng: 123.056, count: 8 },
  { name: "Central Sulawesi", studioNum: 1, baseLat: -0.8917, baseLng: 119.8708, count: 10 },
  { name: "South Sulawesi", studioNum: 1, baseLat: -5.1477, baseLng: 119.4327, count: 35 },
  { name: "Southeast Sulawesi", studioNum: 1, baseLat: -3.988, baseLng: 122.514, count: 10 },
  { name: "West Sulawesi", studioNum: 1, baseLat: -2.6772, baseLng: 118.8922, count: 8 },
  { name: "Maluku", studioNum: 1, baseLat: -3.6954, baseLng: 128.1814, count: 10 },
  { name: "North Maluku", studioNum: 1, baseLat: 0.79, baseLng: 127.38, count: 8 },
  { name: "West Papua", studioNum: 1, baseLat: -0.8614, baseLng: 134.062, count: 8 },
  { name: "Southwest Papua", studioNum: 1, baseLat: -0.8667, baseLng: 131.25, count: 8 },
  { name: "Central Papua", studioNum: 1, baseLat: -3.3667, baseLng: 135.4833, count: 8 },
  { name: "Highland Papua", studioNum: 1, baseLat: -4.095, baseLng: 138.948, count: 8 },
  { name: "South Papua", studioNum: 1, baseLat: -8.5, baseLng: 140.4, count: 6 },
  { name: "Papua", studioNum: 1, baseLat: -2.5488, baseLng: 140.669, count: 10 },
];

const PLATFORM_FEATURES = [
  { title: "Content Creators", desc: "Find and connect with trusted creators who align with your niche, target audience, and campaign objectives.", icon: Users, bg: "bg-blue-500/10", color: "text-blue-400", border: "border-blue-500/20", link: "/dashboard/marketplace" },
  { title: "Homeless Media", desc: "Explore strategic media placement opportunities across influential digital channels, online communities, and publisher networks.", icon: Newspaper, bg: "bg-orange-500/10", color: "text-orange-400", border: "border-orange-500/20", link: "/dashboard/homeless-media" },
  { title: "Publishers", desc: "Find the right publishers and digital media platforms to expand your campaign reach and increase public visibility.", icon: Megaphone, bg: "bg-purple-500/10", color: "text-purple-400", border: "border-purple-500/20", link: "/dashboard/marketplace" },
  { title: "Podcast / Live Streaming", desc: "Promote your products and services through podcasts, live streams, live shopping sessions, and creator-driven conversations.", icon: Podcast, bg: "bg-teal-500/10", color: "text-teal-400", border: "border-teal-500/20", link: "/dashboard" },
  { title: "Media Monitoring Tools", desc: "Monitor conversations, mentions, reach, sentiment, and campaign performance in real time across multiple digital platforms.", icon: Radio, bg: "bg-red-500/10", color: "text-red-400", border: "border-red-500/20", link: "/dashboard" },
];

const ACTIVE_CAMPAIGNS = [
  { name: "GlowUp Skincare", type: "Micro Influencer Campaign", date: "May 10 - May 30, 2024", status: "Live", color: "text-green-600 bg-green-50" },
  { name: "SoundCore Indonesia", type: "Product Awareness", date: "May 12 - Jun 2, 2024", status: "In Progress", color: "text-blue-600 bg-blue-50" },
  { name: "Wanderlust Travel", type: "Destination Promotion", date: "May 18 - Jun 8, 2024", status: "Pending", color: "text-amber-600 bg-amber-50" },
];

const RECENT_MESSAGES = [
  { name: "Andi Pratama", role: "Content Creator", message: "Hi Yael! I'm excited about the campaign brief. Can we discuss the deliverables in more detail?", time: "5m ago" },
  { name: "Andi Pratama", role: "Content Creator", message: "Hi Yael! I'm excited about the campaign brief. Can we discuss the deliverables in more detail?", time: "5m ago" },
  { name: "Andi Pratama", role: "Content Creator", message: "Hi Yael! I'm excited about the campaign brief. Can we discuss the deliverables in more detail?", time: "5m ago" },
];

const CAMPAIGN_EVENTS = [
  { date: 20, month: "May", year: "2024", label: "Skincare Launch Campaign", color: "bg-blue-600" },
  { date: 28, month: "May", year: "2024", label: "Tech Gadget Review", color: "bg-white border" },
];

/* ---------- Helpers ---------- */
function getProvinceColor(count: number): string {
  if (count === 0) return "rgba(30,41,59,0.4)";
  if (count <= 5) return "#1e3a5f";
  if (count <= 15) return "#1d4ed8";
  if (count <= 40) return "#3b82f6";
  if (count <= 100) return "#60a5fa";
  return "#93c5fd";
}

/* ---------- Sub-components ---------- */
function MapController({
  selectedProvince,
  geoJsonData,
  onProvinceClick,
}: {
  selectedProvince: string;
  geoJsonData: GeoJSON.FeatureCollection | null;
  onProvinceClick: (name: string) => void;
}) {
  const map = useMap();
  const geoJsonLayerRef = useRef<LeafletGeoJSON | null>(null);

  useEffect(() => {
    if (selectedProvince !== "all" && geoJsonLayerRef.current) {
      geoJsonLayerRef.current.eachLayer((layer: any) => {
        if (layer.feature?.properties?.PROVINSI) {
          const provName = mapGeoJSONProvince(layer.feature.properties.PROVINSI);
          if (provName === selectedProvince) {
            map.fitBounds(layer.getBounds());
          }
        }
      });
    } else {
      map.setView([-2.5, 118.0], 5);
    }
  }, [selectedProvince, map, geoJsonData]);

  const geoJsonKey = `${selectedProvince}-${geoJsonData ? "loaded" : "empty"}`;

  if (!geoJsonData) return null;

  return (
    <GeoJSON
      key={geoJsonKey}
      data={geoJsonData}
      ref={geoJsonLayerRef}
      style={(feature) => {
        if (!feature) return {};
        const provName = mapGeoJSONProvince(feature.properties.PROVINSI);
        const p = PROVINCES.find((x) => x.name === provName);
        const count = p?.count ?? 0;

        if (selectedProvince !== "all") {
          const isSelected = provName === selectedProvince;
          return {
            fillColor: getProvinceColor(count),
            weight: isSelected ? 2.5 : 0.5,
            opacity: isSelected ? 1 : 0.3,
            color: "rgba(148,163,184,0.4)",
            fillOpacity: isSelected ? 0.85 : 0.15,
          };
        }

        return {
          fillColor: getProvinceColor(count),
          weight: 1,
          opacity: 0.5,
          color: "rgba(148,163,184,0.3)",
          fillOpacity: 0.7,
        };
      }}
      onEachFeature={(feature, layer) => {
        const provName = mapGeoJSONProvince(feature.properties.PROVINSI);
        const p = PROVINCES.find((x) => x.name === provName);
        const count = p?.count ?? 0;

        layer.bindTooltip(
          `<div style="font-family:Inter,sans-serif;padding:4px;line-height:1.4;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:8px;">
            <strong style="font-size:12px;color:#F1F5F9;">${provName}</strong><br>
            <span style="font-size:11px;color:#94A3B8;">${count} creators</span>
          </div>`,
          { direction: "top", sticky: true, className: "" },
        );

        layer.on("click", () => onProvinceClick(provName));
      }}
    />
  );
}

function mapGeoJSONProvince(geoName: string): string {
  const map: Record<string, string> = {
    "Aceh": "Aceh",
    "Sumatera Utara": "North Sumatra",
    "Sumatera Barat": "West Sumatra",
    "Riau": "Riau",
    "Kepulauan Riau": "Riau Islands",
    "Jambi": "Jambi",
    "Sumatera Selatan": "South Sumatra",
    "Bengkulu": "Bengkulu",
    "Lampung": "Lampung",
    "Kep. Bangka Belitung": "Bangka Belitung",
    "Banten": "Banten",
    "DKI Jakarta": "DKI Jakarta",
    "Jawa Barat": "West Java",
    "Jawa Tengah": "Central Java",
    "DI Yogyakarta": "DI Yogyakarta",
    "Jawa Timur": "East Java",
    "Bali": "Bali",
    "Nusa Tenggara Barat": "West Nusa Tenggara",
    "Nusa Tenggara Timur": "East Nusa Tenggara",
    "Kalimantan Barat": "West Kalimantan",
    "Kalimantan Tengah": "Central Kalimantan",
    "Kalimantan Selatan": "South Kalimantan",
    "Kalimantan Timur": "East Kalimantan",
    "Kalimantan Utara": "North Kalimantan",
    "Sulawesi Utara": "North Sulawesi",
    "Gorontalo": "Gorontalo",
    "Sulawesi Tengah": "Central Sulawesi",
    "Sulawesi Selatan": "South Sulawesi",
    "Sulawesi Tenggara": "Southeast Sulawesi",
    "Sulawesi Barat": "West Sulawesi",
    "Maluku": "Maluku",
    "Maluku Utara": "North Maluku",
    "Papua Barat": "West Papua",
    "Papua Barat Daya": "Southwest Papua",
    "Papua Tengah": "Central Papua",
    "Papua Pegunungan": "Highland Papua",
    "Papua Selatan": "South Papua",
    "Papua": "Papua",
  };
  return map[geoName] ?? geoName;
}

/* ---------- Main Component ---------- */
export default function ServiceHub() {
  const [province, setProvince] = useState("all");
  const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [mapKey] = useState(0);
  const [mapTab, setMapTab] = useState<"creator" | "homeless">("creator");

  useEffect(() => {
    fetch("/indonesia-38-provinces.geojson")
      .then((r) => r.json())
      .then(setGeoJsonData)
      .catch(() => {});
  }, []);

  const handleProvinceClick = useCallback((name: string) => {
    setProvince((prev) => (prev === name ? "all" : name));
  }, []);

  const sortedProvinces = [...PROVINCES].sort((a, b) => b.count - a.count);

  const leftHalf = sortedProvinces.slice(0, 20);
  const rightHalf = sortedProvinces.slice(20);

  return (
    <div className="p-4 md:p-6 space-y-5" style={{ background: "var(--ch-bg)", minHeight: "100%" }}>
      {/* Hero Banner */}
      <div
        className="relative rounded-2xl overflow-hidden border border-white/10"
        style={{ background: "#040e1f", minHeight: 240 }}
      >
        <div className="relative z-10 grid lg:grid-cols-2 gap-0 items-center">
          {/* Left: Text */}
          <div className="px-8 py-10 lg:px-12 lg:py-12">
            <h2
              className="text-2xl lg:text-[2rem] font-extrabold text-white leading-[1.15] tracking-tight mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              One Platform to Connect with{" "}
              <span className="text-orange-400">Creators</span>,{" "}
              <span className="text-blue-400">Homeless Media</span>, and{" "}
              <span className="text-blue-500">Publishers</span>
            </h2>
            <p className="text-sm text-slate-400 mb-6 max-w-md leading-relaxed">
              The all-in-one marketplace connecting brands with the right creators to achieve real impact.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/dashboard/marketplace">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/25 text-sm px-5">
                  <Users className="w-4 h-4 mr-1.5" /> Find Creators
                </Button>
              </Link>
              <Link to="/dashboard/campaigns">
                <Button variant="outline" className="border-white/25 text-white hover:bg-white/10 font-semibold text-sm px-5">
                  Create Campaign
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Hero Image — centered in column, not edge-to-edge */}
          <div className="hidden lg:flex items-center justify-center relative px-6 py-5">
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background: `
                  radial-gradient(ellipse at 0% 0%, #040e1f 0%, transparent 50%),
                  linear-gradient(to right, #040e1f 0%, transparent 15%),
                  linear-gradient(to bottom, #040e1f 0%, transparent 12%),
                  linear-gradient(to left, #040e1f 0%, transparent 15%),
                  linear-gradient(to top, #040e1f 0%, transparent 10%)
                `
              }}
            />
            <img
              src="/hero-banner.jpg"
              alt="CreatorHub Platform"
              className="rounded-xl object-cover w-full max-h-[280px]"
            />
          </div>
        </div>
      </div>

      {/* Map Section — full width */}
      <div className="rounded-xl border flex flex-col" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-4 pb-3 border-b" style={{ borderColor: "var(--ch-border)" }}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMapTab("creator")}
              className={`text-[13px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                mapTab === "creator"
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "text-white/50 hover:text-white/80"
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Content Creator Coverage in Indonesia
            </button>
            <button
              onClick={() => setMapTab("homeless")}
              className={`text-[13px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                mapTab === "homeless"
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "text-white/50 hover:text-white/80"
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Homeless Media Coverage in Indonesia
            </button>
          </div>
          <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>
              <span>Low</span>
              <div className="flex gap-0.5">
                {["#1e3a5f", "#1d4ed8", "#3b82f6", "#60a5fa", "#93c5fd"].map((c) => (
                  <span key={c} className="inline-block w-3.5 h-2.5 rounded-sm" style={{ background: c }} />
                ))}
              </div>
              <span>High</span>
            </div>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="text-[12px] font-semibold border rounded-lg px-3 py-1.5 outline-none"
              style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)", background: "var(--ch-surface)" }}
            >
              <option value="all">Indonesia</option>
              {PROVINCES.map((p) => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="relative min-h-[380px]">
          <MapContainer
            key={mapKey}
            center={[-2.5, 118.0]}
            zoom={5}
            zoomControl={true}
            className="w-full h-full absolute inset-0 z-0"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <MapController
              selectedProvince={province}
              geoJsonData={geoJsonData}
              onProvinceClick={handleProvinceClick}
            />
          </MapContainer>
        </div>
        <div className="flex items-center gap-4 px-5 py-3 border-t text-[10px] font-semibold" style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
          <span>{mapTab === "creator" ? "KOLs / Creators" : "Media Channels"}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#93c5fd] inline-block" /> 150+</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#60a5fa] inline-block" /> 50 - 149</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] inline-block" /> 20 - 49</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#1e3a5f] inline-block" /> &lt; 20</span>
          </div>
        </div>
      </div>

      {/* Platform Features */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Platform Features
          </h3>
          <Link to="/dashboard/marketplace" className="text-xs font-semibold text-blue-400 hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PLATFORM_FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <Link key={feat.title} to={feat.link}>
                <div className="rounded-xl border border-white/[0.06] p-4 flex flex-col items-center text-center gap-2 hover:border-white/15 transition-all cursor-pointer group"
                  style={{ background: "rgba(15,23,42,0.6)" }}>
                  <div className={`w-12 h-12 ${feat.bg} border ${feat.border} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${feat.color}`} />
                  </div>
                  <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{feat.title}</p>
                  <p className="text-[11px] leading-snug" style={{ color: "var(--ch-text-muted)" }}>{feat.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Table + Right Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">
        {/* Main: Table */}
        <div className="space-y-5">
          {/* Creators by Province Table */}
          <div className="rounded-xl border" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b" style={{ borderColor: "var(--ch-border)" }}>
              <h3 className="text-[15px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Creators by Province
              </h3>
              {province !== "all" && (
                <button onClick={() => setProvince("all")} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Back to All
                </button>
              )}
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                {/* Left column */}
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="text-[10px] uppercase border-b" style={{ color: "var(--ch-text-soft)", borderColor: "var(--ch-border)" }}>
                      <th className="py-2 text-left w-8">#</th>
                      <th className="py-2 text-left">Province</th>
                      <th className="py-2 text-right">KOLs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leftHalf.map((p, i) => (
                      <tr
                        key={p.name}
                        className="cursor-pointer hover:bg-slate-50"
                        style={{
                          borderBottom: "1px solid var(--ch-border)",
                          background: province === p.name ? "#EFF6FF" : "transparent",
                        }}
                        onClick={() => handleProvinceClick(p.name)}
                      >
                        <td className="py-2" style={{ color: "var(--ch-text-muted)" }}>{i + 1}</td>
                        <td className="py-2 font-semibold" style={{ color: "var(--ch-text)" }}>{p.name}</td>
                        <td className="py-2 text-right font-bold" style={{ color: "var(--ch-text)" }}>{p.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Right column */}
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="text-[10px] uppercase border-b" style={{ color: "var(--ch-text-soft)", borderColor: "var(--ch-border)" }}>
                      <th className="py-2 text-left w-8">#</th>
                      <th className="py-2 text-left">Province</th>
                      <th className="py-2 text-right">KOLs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rightHalf.map((p, i) => (
                      <tr
                        key={p.name}
                        className="cursor-pointer hover:bg-slate-50"
                        style={{
                          borderBottom: "1px solid var(--ch-border)",
                          background: province === p.name ? "#EFF6FF" : "transparent",
                        }}
                        onClick={() => handleProvinceClick(p.name)}
                      >
                        <td className="py-2" style={{ color: "var(--ch-text-muted)" }}>{i + 21}</td>
                        <td className="py-2 font-semibold" style={{ color: "var(--ch-text)" }}>{p.name}</td>
                        <td className="py-2 text-right font-bold" style={{ color: "var(--ch-text)" }}>{p.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t text-[11px]" style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
                <span>Total 38 provinces</span>
                <span>Last updated: May 20, 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Campaign Calendar */}
          <div className="rounded-xl border p-4" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[13px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Campaign Calendar</h4>
              <Link to="/dashboard/campaigns" className="text-[11px] font-semibold text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="flex gap-3">
              {CAMPAIGN_EVENTS.map((ev, i) => (
                <div key={i} className={`flex-1 rounded-xl p-3 text-center ${ev.color === "bg-white border" ? "border border-slate-200" : "bg-blue-600 text-white"}`}>
                  <p className={`text-[10px] font-semibold ${ev.color === "bg-white border" ? "text-slate-500" : "text-blue-100"}`}>{ev.month}</p>
                  <p className={`text-2xl font-extrabold ${ev.color === "bg-white border" ? "text-slate-800" : "text-white"}`}>{ev.date}</p>
                  <p className={`text-[10px] font-semibold ${ev.color === "bg-white border" ? "text-slate-500" : "text-blue-100"}`}>{ev.year}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1.5">
              {CAMPAIGN_EVENTS.map((ev, i) => (
                <p key={i} className="text-[10px] font-medium" style={{ color: "var(--ch-text-muted)" }}>{ev.label}</p>
              ))}
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="rounded-xl border p-4" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[13px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Active Campaigns</h4>
              <Link to="/dashboard/campaigns" className="text-[11px] font-semibold text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {ACTIVE_CAMPAIGNS.map((c, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shrink-0">
                    <Megaphone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold truncate" style={{ color: "var(--ch-text)" }}>{c.name}</span>
                      <Badge variant={c.status === "Live" ? "success" : c.status === "In Progress" ? "default" : "secondary"} className="text-[9px] shrink-0">
                        {c.status}
                      </Badge>
                    </div>
                    <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{c.type}</p>
                    <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{c.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="rounded-xl border p-4" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[13px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recent Messages</h4>
              <Link to="/dashboard/messages" className="text-[11px] font-semibold text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {RECENT_MESSAGES.map((m, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-[12px] font-bold text-blue-600 shrink-0">
                    {m.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold" style={{ color: "var(--ch-text)" }}>{m.name}</span>
                      <Badge variant="success" className="text-[9px] px-1 py-0">✓</Badge>
                      <span className="text-[10px] ml-auto shrink-0" style={{ color: "var(--ch-text-muted)" }}>{m.time}</span>
                    </div>
                    <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{m.role}</p>
                    <p className="text-[11px] mt-1 line-clamp-2" style={{ color: "var(--ch-text-muted)" }}>{m.message}</p>
                    <Button variant="outline" size="sm" className="mt-2 h-7 text-[11px] gap-1">
                      <Send className="w-3 h-3" /> Reply
                    </Button>
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

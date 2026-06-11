import { useState, useEffect, useCallback, useRef } from "react";
import {
  Users, MapPin, Award, MapPinOff, Briefcase, Wallet,
  TrendingUp, Target, ChevronDown, Tag, Info,
  LayoutGrid, Globe, ArrowLeft
} from "lucide-react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import type { GeoJSON as LeafletGeoJSON } from "leaflet";

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
  { name: "Aceh", studioNum: 1, baseLat: 5.5483, baseLng: 95.3238, count: 15 },
  { name: "North Sumatra", studioNum: 1, baseLat: 3.5952, baseLng: 98.6722, count: 48 },
  { name: "West Sumatra", studioNum: 1, baseLat: -0.9471, baseLng: 100.4172, count: 14 },
  { name: "Riau", studioNum: 1, baseLat: 0.5071, baseLng: 101.4478, count: 24 },
  { name: "Riau Islands", studioNum: 1, baseLat: 1.0881, baseLng: 104.0305, count: 12 },
  { name: "Jambi", studioNum: 1, baseLat: -1.6101, baseLng: 103.6131, count: 11 },
  { name: "South Sumatra", studioNum: 1, baseLat: -2.9909, baseLng: 104.7567, count: 20 },
  { name: "Bengkulu", studioNum: 1, baseLat: -3.7928, baseLng: 102.2608, count: 10 },
  { name: "Lampung", studioNum: 1, baseLat: -5.3971, baseLng: 105.2663, count: 21 },
  { name: "Bangka Belitung", studioNum: 1, baseLat: -2.1301, baseLng: 106.1161, count: 9 },
  { name: "Banten", studioNum: 1, baseLat: -6.1149, baseLng: 106.1502, count: 62 },
  { name: "DKI Jakarta", studioNum: 1, baseLat: -6.2088, baseLng: 106.8456, count: 118 },
  { name: "West Java", studioNum: 1, baseLat: -6.9175, baseLng: 107.6191, count: 156 },
  { name: "Central Java", studioNum: 1, baseLat: -6.9667, baseLng: 110.4167, count: 104 },
  { name: "DI Yogyakarta", studioNum: 1, baseLat: -7.7956, baseLng: 110.3695, count: 28 },
  { name: "East Java", studioNum: 1, baseLat: -7.2575, baseLng: 112.7521, count: 132 },
  { name: "Bali", studioNum: 1, baseLat: -8.6705, baseLng: 115.2126, count: 32 },
  { name: "West Nusa Tenggara", studioNum: 1, baseLat: -8.5833, baseLng: 116.1167, count: 9 },
  { name: "East Nusa Tenggara", studioNum: 1, baseLat: -10.1772, baseLng: 123.607, count: 8 },
  { name: "West Kalimantan", studioNum: 1, baseLat: -0.0263, baseLng: 109.3425, count: 18 },
  { name: "Central Kalimantan", studioNum: 1, baseLat: -2.2083, baseLng: 113.9167, count: 8 },
  { name: "South Kalimantan", studioNum: 1, baseLat: -3.3167, baseLng: 114.59, count: 8 },
  { name: "East Kalimantan", studioNum: 1, baseLat: -1.2654, baseLng: 116.8312, count: 16 },
  { name: "North Kalimantan", studioNum: 1, baseLat: 3.3, baseLng: 117.6333, count: 7 },
  { name: "North Sulawesi", studioNum: 1, baseLat: 1.4748, baseLng: 124.8428, count: 10 },
  { name: "Gorontalo", studioNum: 1, baseLat: 0.543, baseLng: 123.056, count: 6 },
  { name: "Central Sulawesi", studioNum: 1, baseLat: -0.8917, baseLng: 119.8708, count: 8 },
  { name: "South Sulawesi", studioNum: 1, baseLat: -5.1477, baseLng: 119.4327, count: 35 },
  { name: "Southeast Sulawesi", studioNum: 1, baseLat: -3.988, baseLng: 122.514, count: 7 },
  { name: "West Sulawesi", studioNum: 1, baseLat: -2.6772, baseLng: 118.8922, count: 5 },
  { name: "Maluku", studioNum: 1, baseLat: -3.6954, baseLng: 128.1814, count: 6 },
  { name: "North Maluku", studioNum: 1, baseLat: 0.79, baseLng: 127.38, count: 5 },
  { name: "West Papua", studioNum: 1, baseLat: -0.8614, baseLng: 134.062, count: 4 },
  { name: "Southwest Papua", studioNum: 1, baseLat: -0.8667, baseLng: 131.25, count: 3 },
  { name: "Central Papua", studioNum: 1, baseLat: -3.3667, baseLng: 135.4833, count: 3 },
  { name: "Highland Papua", studioNum: 1, baseLat: -4.095, baseLng: 138.948, count: 2 },
  { name: "South Papua", studioNum: 1, baseLat: -8.5, baseLng: 140.4, count: 3 },
  { name: "Papua", studioNum: 1, baseLat: -2.5488, baseLng: 140.669, count: 5 },
];

const NICHE_OPTIONS = [
  "All Niches", "Beauty", "Food", "UMKM", "Finance",
  "Lifestyle", "Politics", "Tech", "Parenting", "Travel",
];

const PLATFORMS = [
  { id: "all", label: "All Active Creators", icon: LayoutGrid },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube" },
  { id: "x", label: "X" },
  { id: "facebook", label: "Facebook" },
] as const;

/* ---------- Helpers ---------- */
function getProvinceColor(count: number): string {
  if (count === 0) return "#f0f0f0";
  if (count <= 5) return "#dce7f6";
  if (count <= 15) return "#adcbf7";
  if (count <= 40) return "#6ea4ef";
  if (count <= 100) return "#2973e3";
  return "#0a4fa7";
}

const TOTAL_CREATORS = PROVINCES.reduce((s, p) => s + p.count, 0);

const INSIGHT_PROVINCES = {
  highest: "West Java",
  growth: "East Nusa Tenggara",
  gap: "Maluku & Papua",
};

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
            opacity: isSelected ? 1 : 0.2,
            color: "#ffffff",
            fillOpacity: isSelected ? 0.85 : 0.15,
          };
        }

        return {
          fillColor: getProvinceColor(count),
          weight: 1,
          opacity: 0.6,
          color: "#ffffff",
          fillOpacity: 0.7,
        };
      }}
      onEachFeature={(feature, layer) => {
        const provName = mapGeoJSONProvince(feature.properties.PROVINSI);
        const p = PROVINCES.find((x) => x.name === provName);
        const count = p?.count ?? 0;

        layer.bindTooltip(
          `<div style="font-family:Inter,sans-serif;padding:4px;line-height:1.4;">
            <strong style="font-size:12px;color:#0F172A;">${provName}</strong><br>
            <span style="font-size:11px;color:#64748B;">${count} creators</span>
          </div>`,
          { direction: "top", sticky: true },
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
export default function Dashboard() {
  const [niche, setNiche] = useState("all");
  const [province, setProvince] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [podcastMode, setPodcastMode] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    fetch("/indonesia-38-provinces.geojson")
      .then((r) => r.json())
      .then(setGeoJsonData)
      .catch(() => {});
  }, []);

  const handleProvinceClick = useCallback((name: string) => {
    setProvince((prev) => (prev === name ? "all" : name));
  }, []);

  const handleResetProvince = () => setProvince("all");

  const sortedProvinces = [...PROVINCES].sort((a, b) => {
    if (a.count !== b.count) return b.count - a.count;
    return a.name.localeCompare(b.name);
  });

  const statFiltered = province === "all"
    ? PROVINCES
    : PROVINCES.filter((p) => p.name === province);

  const totalFiltered = statFiltered.reduce((s, p) => s + p.count, 0);
  const highestProv = sortedProvinces[0];
  const lowestProv = sortedProvinces[sortedProvinces.length - 1];

  useEffect(() => {
    setMapKey((k) => k + 1);
  }, [platform]);

  return (
    <div className="p-4 md:p-6 space-y-5" style={{ background: "var(--ch-bg)", minHeight: "100%" }}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold leading-tight" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Creator Coverage Intelligence Dashboard
          </h1>
          <p className="text-[13px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
            Provincial distribution, creator density, and campaign coverage across Indonesia.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-bold shrink-0" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>
          <Users className="w-3.5 h-3.5" />
          <span>{TOTAL_CREATORS.toLocaleString()} Creators Tracked</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl border" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-md border" style={{ borderColor: "var(--ch-border)" }}>
          <Tag className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--ch-text-muted)" }} />
          <select
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="flex-1 bg-transparent text-[12px] font-semibold outline-none cursor-pointer"
            style={{ color: "var(--ch-text)" }}
          >
            {NICHE_OPTIONS.map((n) => (
              <option key={n} value={n === "All Niches" ? "all" : n.toLowerCase()}>
                {n === "All Niches" ? "Niche: All Niches" : `Niche: ${n}`}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--ch-text-muted)" }} />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-md border" style={{ borderColor: "var(--ch-border)" }}>
          <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--ch-text-muted)" }} />
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="flex-1 bg-transparent text-[12px] font-semibold outline-none cursor-pointer"
            style={{ color: "var(--ch-text)" }}
          >
            <option value="all">Region: All Indonesia</option>
            {PROVINCES.map((p) => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--ch-text-muted)" }} />
        </div>
      </div>

      {/* Insight Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-xl border" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
        <div className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>
          <TrendingUp className="w-4 h-4" style={{ color: "#16A34A" }} />
          Highest Coverage: <strong style={{ color: "#16A34A" }}>{INSIGHT_PROVINCES.highest}</strong>
        </div>
        <div className="hidden sm:block w-px h-5" style={{ background: "var(--ch-border)" }} />
        <div className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>
          <Target className="w-4 h-4" style={{ color: "#F59E0B" }} />
          Growth Opportunity: <strong style={{ color: "#F59E0B" }}>{INSIGHT_PROVINCES.growth}</strong>
        </div>
        <div className="hidden sm:block w-px h-5" style={{ background: "var(--ch-border)" }} />
        <div className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>
          <Globe className="w-4 h-4" style={{ color: "#2563EB" }} />
          Coverage Gap: <strong style={{ color: "#2563EB" }}>{INSIGHT_PROVINCES.gap}</strong>
        </div>
      </div>

      {/* Map + Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.1fr] gap-5 items-stretch">
        {/* Map Card */}
        <div className="rounded-xl border flex flex-col" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-4 pb-3 border-b" style={{ borderColor: "var(--ch-border)" }}>
            <h3 className="text-[14px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Indonesia Creator Density by Province
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>
              <span>Low</span>
              <div className="flex gap-0.5">
                {["#dce7f6", "#adcbf7", "#6ea4ef", "#2973e3", "#0a4fa7"].map((c) => (
                  <span key={c} className="inline-block w-3.5 h-2.5 rounded-sm" style={{ background: c }} />
                ))}
              </div>
              <span>High</span>
              <Info className="w-3 h-3" />
            </div>
          </div>
          <div className="flex-1 relative min-h-[400px]">
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
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              <MapController
                selectedProvince={province}
                geoJsonData={geoJsonData}
                onProvinceClick={handleProvinceClick}
              />
            </MapContainer>
          </div>
          {/* Platform Filters */}
          <div className="flex flex-wrap justify-center gap-2 px-4 py-3 border-t" style={{ borderColor: "var(--ch-border)" }}>
            {PLATFORMS.map((pf) => {
              const isActive = platform === pf.id;
              return (
                <button
                  key={pf.id}
                  onClick={() => setPlatform(pf.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-semibold transition-all"
                  style={{
                    background: isActive ? "var(--ch-primary)" : "var(--ch-surface)",
                    color: isActive ? "white" : "var(--ch-text-muted)",
                    border: isActive ? "none" : "1px solid var(--ch-border)",
                  }}
                >
                  {pf.id === "all" && <LayoutGrid className="w-3 h-3" />}
                  {pf.id === "instagram" && <span className="text-[11px]">📸</span>}
                  {pf.id === "tiktok" && <span className="text-[11px]">🎵</span>}
                  {pf.id === "youtube" && <span className="text-[11px]">▶</span>}
                  {pf.id === "x" && <span className="text-[11px]">𝕏</span>}
                  {pf.id === "facebook" && <span className="text-[11px]">f</span>}
                  <span>{pf.label}</span>
                </button>
              );
            })}
          </div>
          {/* Podcast toggle */}
          <div className="flex justify-center px-4 pb-4">
            <button
              onClick={() => setPodcastMode(!podcastMode)}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-semibold transition-all"
              style={{
                background: podcastMode ? "#006644" : "#F0FDF4",
                color: podcastMode ? "white" : "#006644",
                border: podcastMode ? "1px solid #005533" : "1.5px dashed #16A34A",
              }}
            >
              <MapPin className="w-3 h-3" />
              <span>Podcast Facilities by the Association of Indonesian Content Creators</span>
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-4">
          {/* Creators by Province */}
          <div className="rounded-xl border flex flex-col flex-1" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b" style={{ borderColor: "var(--ch-border)" }}>
              <h3 className="text-[13px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Creators by Province
              </h3>
              {province !== "all" && (
                <button
                  onClick={handleResetProvince}
                  className="flex items-center gap-1 text-[11px] font-semibold hover:underline"
                  style={{ color: "#2563EB" }}
                >
                  <ArrowLeft className="w-3 h-3" /> Back to All
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr style={{ color: "var(--ch-text-soft)", fontSize: 9, textTransform: "uppercase", borderBottom: "1px solid var(--ch-border)" }}>
                    <th className="p-1 text-left">#</th>
                    <th className="p-1 text-left">Province</th>
                    <th className="p-1 text-right">KOLs</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProvinces.map((p, i) => (
                    <tr
                      key={p.name}
                      className="cursor-pointer"
                      style={{
                        borderBottom: "1px solid var(--ch-border)",
                        background: province === p.name ? "#EFF6FF" : "transparent",
                      }}
                      onClick={() => handleProvinceClick(p.name)}
                    >
                      <td className="p-1" style={{ color: "var(--ch-text-muted)", fontWeight: 500, width: 20 }}>{i + 1}</td>
                      <td className="p-1 font-semibold" style={{ color: "var(--ch-text)" }}>{p.name}</td>
                      <td className="p-1 text-right font-bold" style={{ color: "var(--ch-text)" }}>{p.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommended Action */}
          <div className="rounded-xl border p-4" style={{ background: "linear-gradient(135deg, #f7f9ff 0%, #ffffff 100%)", borderColor: "#deebff" }}>
            <div className="flex items-center gap-2 mb-2" style={{ color: "var(--ch-primary)" }}>
              <Target className="w-4 h-4" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recommended Action</h4>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>
              Strengthen creator recruitment in eastern provinces and use West Java, East Java, DKI Jakarta, and Central Java as anchor hubs for nationwide campaigns.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Creators */}
        <div className="rounded-xl border p-3 flex items-center gap-3" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#EFF6FF" }}>
            <Users className="w-4 h-4" style={{ color: "#1D4ED8" }} />
          </div>
          <div>
            <p className="text-[10px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Total Creators</p>
            <p className="text-[16px] font-extrabold leading-tight" style={{ color: "var(--ch-text)" }}>
              {totalFiltered.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Provinces Covered */}
        <div className="rounded-xl border p-3 flex items-center gap-3" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#DCFCE7" }}>
            <MapPin className="w-4 h-4" style={{ color: "#16A34A" }} />
          </div>
          <div>
            <p className="text-[10px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Provinces Covered</p>
            <p className="text-[16px] font-extrabold leading-tight" style={{ color: "#16A34A" }}>
              {PROVINCES.length}
            </p>
          </div>
        </div>

        {/* Highest Province */}
        <div className="rounded-xl border p-3 flex items-center gap-3" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#EDE9FE" }}>
            <Award className="w-4 h-4" style={{ color: "#7C3AED" }} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Highest-Creator Province</p>
            <p className="text-[13px] font-bold leading-tight truncate" style={{ color: "#7C3AED" }}>
              {highestProv?.name ?? "-"}
            </p>
          </div>
        </div>

        {/* Lowest Province */}
        <div className="rounded-xl border p-3 flex items-center gap-3" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#FFF7ED" }}>
            <MapPinOff className="w-4 h-4" style={{ color: "#EA580C" }} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Lowest-Creator Province</p>
            <p className="text-[13px] font-bold leading-tight truncate" style={{ color: "#EA580C" }}>
              {lowestProv?.name ?? "-"}
            </p>
          </div>
        </div>

        {/* Total Campaigns */}
        <div className="rounded-xl border p-3 flex items-center gap-3" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#ECFEFF" }}>
            <Briefcase className="w-4 h-4" style={{ color: "#0891B2" }} />
          </div>
          <div>
            <p className="text-[10px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Total Campaigns</p>
            <p className="text-[16px] font-extrabold leading-tight" style={{ color: "var(--ch-text)" }}>247</p>
          </div>
        </div>

        {/* Total Budget Spent */}
        <div className="rounded-xl border p-3 flex items-center gap-3" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#DCFCE7" }}>
            <Wallet className="w-4 h-4" style={{ color: "#16A34A" }} />
          </div>
          <div>
            <p className="text-[10px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Total Budget Spent</p>
            <p className="text-[16px] font-extrabold leading-tight" style={{ color: "#16A34A" }}>Rp 4.2B</p>
          </div>
        </div>
      </div>
    </div>
  );
}

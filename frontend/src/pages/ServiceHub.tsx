import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Users, CheckCircle, MapPin, Share2, Tag, BarChart3, UsersRound, SlidersHorizontal, ChevronDown } from "lucide-react";
import { MapContainer, TileLayer, GeoJSON, Marker, ScaleControl, useMap } from "react-leaflet";
import L from "leaflet";
import type { FeatureCollection } from "geojson";
import * as topojson from "topojson-client";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip } from "recharts";
import { creatorsApi } from "@/lib/api";
import { formatFollowers } from "@/lib/utils";
import type { Creator } from "@/types";

const PROVINCE_URL = "https://gist.githubusercontent.com/ajie31/3144875bad9705e2b2b544909c022276/raw/Peta%20Indonesia%20Provinsi.json";
const KABUPATEN_KOTA_URL = "https://gist.githubusercontent.com/ajie31/3144875bad9705e2b2b544909c022276/raw/Peta%20Indonesia%20Kota%20Kabupaten%20simplified.json";

const JAKARTA_KAB = ["Jakarta Pusat", "Jakarta Selatan", "Jakarta Barat", "Jakarta Timur", "Jakarta Utara", "Kepulauan Seribu"];

const CITY_TO_PROVINCE: Record<string, string> = {
  "Jakarta Pusat": "DKI Jakarta", "Jakarta Selatan": "DKI Jakarta", "Jakarta Barat": "DKI Jakarta",
  "Jakarta Timur": "DKI Jakarta", "Jakarta Utara": "DKI Jakarta", "Kepulauan Seribu": "DKI Jakarta",
  "Jakarta": "DKI Jakarta", "DKI Jakarta": "DKI Jakarta", "Daerah Khusus Ibukota Jakarta": "DKI Jakarta", "Dk Jakarta": "DKI Jakarta",
  Bandung: "Jawa Barat", "Bandung Barat": "Jawa Barat", Bogor: "Jawa Barat", Depok: "Jawa Barat",
  Bekasi: "Jawa Barat", Cirebon: "Jawa Barat", Tasikmalaya: "Jawa Barat", Sukabumi: "Jawa Barat",
  Garut: "Jawa Barat", Karawang: "Jawa Barat", Subang: "Jawa Barat", Purwakarta: "Jawa Barat",
  Indramayu: "Jawa Barat", Majalaya: "Jawa Barat",
  Surabaya: "Jawa Timur", Malang: "Jawa Timur", "Kediri": "Jawa Timur", "Madiun": "Jawa Timur",
  "Probolinggo": "Jawa Timur", "Lumajang": "Jawa Timur", "Jember": "Jawa Timur",
  "Banyuwangi": "Jawa Timur", "Blitar": "Jawa Timur", "Pasuruan": "Jawa Timur",
  "Sidoarjo": "Jawa Timur", "Gresik": "Jawa Timur", "Tuban": "Jawa Timur",
  "Lamongan": "Jawa Timur", "Mojokerto": "Jawa Timur",
  Semarang: "Jawa Tengah", Solo: "Jawa Tengah", "Pekalongan": "Jawa Tengah",
  "Tegal": "Jawa Tengah", "Purwokerto": "Jawa Tengah", "Magelang": "Jawa Tengah",
  Bali: "Bali", Denpasar: "Bali",
  Yogyakarta: "DI Yogyakarta",
  Medan: "Sumatera Utara", "Pematangsiantar": "Sumatera Utara", "Binjai": "Sumatera Utara",
  Makassar: "Sulawesi Selatan", Palembang: "Sumatera Selatan", "Padang": "Sumatera Barat",
  "Pekanbaru": "Riau", "Jambi": "Jambi", "Bengkulu": "Bengkulu", "Bandar Lampung": "Lampung",
  "Pontianak": "Kalimantan Barat", "Palangkaraya": "Kalimantan Tengah", "Banjarmasin": "Kalimantan Selatan",
  Balikpapan: "Kalimantan Timur", Samarinda: "Kalimantan Timur", "Tanjung Selor": "Kalimantan Utara",
  Manado: "Sulawesi Utara", "Gorontalo": "Gorontalo", "Palu": "Sulawesi Tengah",
  "Kendari": "Sulawesi Tenggara", "Mamuju": "Sulawesi Barat", Ambon: "Maluku", "Sofifi": "Maluku Utara",
  "Manokwari": "Papua Barat", Jayapura: "Papua",
};

function normalizeJakartaCity(name: string): string {
  const lower = name.toLowerCase().trim();
  if (lower.includes("pusat")) return "Jakarta Pusat";
  if (lower.includes("selatan")) return "Jakarta Selatan";
  if (lower.includes("barat")) return "Jakarta Barat";
  if (lower.includes("timur")) return "Jakarta Timur";
  if (lower.includes("utara")) return "Jakarta Utara";
  if (lower.includes("kepulauan seribu") || lower.includes("seribu")) return "Kepulauan Seribu";
  return "Jakarta Pusat";
}

function getProvince(name: string): string {
  const direct = CITY_TO_PROVINCE[name];
  if (direct) return direct;
  const lower = name.toLowerCase();
  if (lower.includes("jakarta") || lower === "dki jakarta" || lower === "dk jakarta") return "DKI Jakarta";
  if (lower.includes("bandung")) return "Jawa Barat";
  if (lower.includes("surabaya")) return "Jawa Timur";
  if (lower.includes("semarang")) return "Jawa Tengah";
  if (lower.includes("medan")) return "Sumatera Utara";
  if (lower.includes("makassar")) return "Sulawesi Selatan";
  if (lower.includes("bali") || lower.includes("denpasar")) return "Bali";
  if (lower.includes("yogyakarta") || lower.includes("sleman")) return "DI Yogyakarta";
  if (lower.includes("malang")) return "Jawa Timur";
  return name;
}

function computeCentroid(geometry: any): [number, number] | null {
  if (!geometry) return null;
  let coords: number[][] = [];
  if (geometry.type === "Polygon") coords = geometry.coordinates[0];
  else if (geometry.type === "MultiPolygon") coords = geometry.coordinates[0][0];
  if (!coords || coords.length === 0) return null;
  let sumLng = 0, sumLat = 0;
  for (const c of coords) { sumLng += c[0]; sumLat += c[1]; }
  return [sumLat / coords.length, sumLng / coords.length];
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function hashString(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const MOCK_TRENDS: Record<string, string> = {};
const PROVINCE_LIST = Object.values(CITY_TO_PROVINCE);
const uniqueProvinces = [...new Set(PROVINCE_LIST)];
for (const p of uniqueProvinces) {
  const rng = seededRandom(hashString(p));
  const val = Math.floor(rng() * 25) + 3;
  MOCK_TRENDS[p] = `↑ ${val}%`;
}

const TIER_COLORS = ["#3B82F6", "#22C55E", "#A855F7", "#F97316"];
const PLATFORM_COLORS = ["#E4405F", "#000000", "#FF0000", "#1877F2", "#1DA1F2", "#94A3B8"];
const GENDER_COLORS = ["#EC4899", "#3B82F6", "#94A3B8"];
const TIER_PIN_COLORS: Record<string, string> = { Nano: "#22C55E", Micro: "#EAB308", Mid: "#F97316", Macro: "#EF4444", Mega: "#DC2626" };

function getTier(followers: number): string {
  if (followers >= 1000000) return "Mega";
  if (followers >= 500000) return "Macro";
  if (followers >= 100000) return "Mid";
  if (followers >= 10000) return "Micro";
  return "Nano";
}

/* ---------- Animated Counter ---------- */
function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);
  useEffect(() => {
    const start = ref.current;
    const diff = value - start;
    if (diff === 0) return;
    const startTime = performance.now();
    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + diff * eased);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(tick);
      else ref.current = value;
    }
    requestAnimationFrame(tick);
  }, [value, duration]);
  return <>{display.toLocaleString()}</>;
}

/* ---------- Map Components ---------- */
function ProvinceChoropleth({
  geoJsonData,
  provinceCounts,
  onProvinceClick,
}: {
  geoJsonData: FeatureCollection | null;
  provinceCounts: Map<string, number>;
  onProvinceClick: (name: string) => void;
}) {
  const map = useMap();
  const layerRef = useRef<any>(null);
  const maxCount = useMemo(() => Math.max(...Array.from(provinceCounts.values()), 1), [provinceCounts]);

  useEffect(() => {
    map.setView([-2.5, 118.0], 5);
  }, [map, geoJsonData]);

  if (!geoJsonData) return null;

  function getColor(count: number): string {
    const ratio = count / maxCount;
    if (ratio > 0.7) return "#1e40af";
    if (ratio > 0.5) return "#2563eb";
    if (ratio > 0.3) return "#3b82f6";
    if (ratio > 0.1) return "#60a5fa";
    if (ratio > 0) return "#93c5fd";
    return "rgba(30,41,59,0.3)";
  }

  return (
    <GeoJSON
      data={geoJsonData}
      ref={layerRef}
      style={(feature) => {
        if (!feature) return {};
        const name = feature.properties?.NAME_1 || "";
        const count = provinceCounts.get(name) ?? 0;
        return {
          fillColor: getColor(count),
          weight: 1,
          opacity: 0.6,
          color: "rgba(148,163,184,0.3)",
          fillOpacity: count > 0 ? 0.7 : 0.2,
        };
      }}
      onEachFeature={(feature, layer) => {
        const name = feature.properties?.NAME_1 || "Unknown";
        const count = provinceCounts.get(name) ?? 0;
        layer.bindTooltip(
          `<div style="font-family:Inter,sans-serif;padding:6px 10px;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:8px;">
            <strong style="font-size:13px;color:#F1F5F9;">${name}</strong><br/>
            <span style="font-size:12px;color:#93C5FD;">${count.toLocaleString()} creators</span>
          </div>`,
          { direction: "top", sticky: true }
        );
        layer.on("click", () => onProvinceClick(name));
      }}
    />
  );
}

/* ---------- Jakarta Region Choropleth ---------- */
function JakartaRegions({
  kotaGeoJson,
  creators,
}: {
  kotaGeoJson: FeatureCollection | null;
  creators: Creator[];
}) {
  const map = useMap();
  const [zoomed, setZoomed] = useState(false);
  const layerRef = useRef<any>(null);

  const jakartaFeatures = useMemo(() => {
    if (!kotaGeoJson) return null;
    const features = kotaGeoJson.features.filter((f) => {
      const name1 = f.properties?.NAME_1 || "";
      return name1 === "Jakarta Raya" || name1 === "DKI Jakarta";
    });
    if (features.length === 0) return null;
    return { type: "FeatureCollection", features } as unknown as FeatureCollection;
  }, [kotaGeoJson]);

  const cityCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of creators) {
      const city = normalizeJakartaCity(c.city);
      counts.set(city, (counts.get(city) ?? 0) + 1);
    }
    return counts;
  }, [creators]);

  const maxCount = useMemo(() => Math.max(...Array.from(cityCounts.values()), 1), [cityCounts]);

  useEffect(() => {
    if (!zoomed && jakartaFeatures) {
      map.setView([-6.175, 106.827], 11);
      setZoomed(true);
    }
  }, [jakartaFeatures, map, zoomed]);

  if (!jakartaFeatures) return null;

  const REGION_COLORS = [
    "#3B82F6",
    "#22C55E",
    "#F97316",
    "#A855F7",
    "#EC4899",
    "#14B8A6",
  ];

  const jakartaKab = ["Jakarta Pusat", "Jakarta Selatan", "Jakarta Barat", "Jakarta Timur", "Jakarta Utara", "Kepulauan Seribu"];

  function getRegionColor(name2: string, count: number): string {
    const idx = jakartaKab.indexOf(name2);
    const base = REGION_COLORS[idx >= 0 ? idx : 0];
    const ratio = count / maxCount;
    const opacity = 0.15 + ratio * 0.45;
    return base + Math.round(opacity * 255).toString(16).padStart(2, "0");
  }

  return (
    <GeoJSON
      ref={layerRef}
      data={jakartaFeatures}
      style={(feature) => {
        const name = feature?.properties?.NAME_2 || "";
        const count = cityCounts.get(name) ?? 0;
        return {
          weight: 2.5,
          color: "white",
          opacity: 0.95,
          fillColor: getRegionColor(name, count),
          fillOpacity: 0.6,
        };
      }}
      onEachFeature={(feature, layer) => {
        const name = feature.properties?.NAME_2 || "";
        const count = cityCounts.get(name) ?? 0;
        layer.bindTooltip(
          `<div style="font-family:'Plus Jakarta Sans',Inter,sans-serif;padding:8px 12px;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:10px;">
            <div style="font-weight:700;font-size:14px;color:#F1F5F9;">${name}</div>
            <div style="font-size:12px;color:#93C5FD;margin-top:2px;">${count.toLocaleString()} creators</div>
          </div>`,
          { direction: "top", sticky: true, opacity: 1 }
        );
      }}
    />
  );
}

/* ---------- Kabupaten Name Labels ---------- */
function KabupatenLabels({ kotaGeoJson }: { kotaGeoJson: FeatureCollection | null }) {
  const labels = useMemo(() => {
    if (!kotaGeoJson) return [];
    const jakartaFeatures = kotaGeoJson.features.filter((f) => {
      const name1 = f.properties?.NAME_1 || "";
      return name1 === "Jakarta Raya" || name1 === "DKI Jakarta";
    });
    return jakartaFeatures.map((f) => {
      const name = f.properties?.NAME_2 || "";
      const centroid = computeCentroid(f.geometry);
      const displayName = name === "Kep. Seribu" ? "Kabupaten\nKepulauan Seribu" : name;
      return { name, centroid, displayName };
    }).filter((l) => l.centroid);
  }, [kotaGeoJson]);

  return (
    <>
      {labels.map((l) => {
        const isMultiLine = l.displayName.includes("\n");
        const lines = l.displayName.split("\n");
        return (
          <Marker
            key={l.name}
            position={l.centroid!}
            icon={L.divIcon({
              className: "",
              iconSize: [0, 0],
              iconAnchor: [60, 12],
              html: `<div style="
                color: white;
                font-size: 14px;
                font-weight: 800;
                font-family: 'Plus Jakarta Sans', Inter, sans-serif;
                text-shadow: 1px 1px 3px rgba(0,0,0,0.7), -1px -1px 3px rgba(0,0,0,0.7), 1px -1px 3px rgba(0,0,0,0.7), -1px 1px 3px rgba(0,0,0,0.7);
                white-space: ${isMultiLine ? 'pre-line' : 'nowrap'};
                text-align: center;
                line-height: 1.3;
                pointer-events: none;
              ">${lines.join('<br/>')}</div>`,
            })}
          />
        );
      })}
    </>
  );
}

/* ---------- Region Legend Card ---------- */
function RegionLegend() {
  const regions: { label: string; color: string }[] = [
    { label: "Jakarta Pusat", color: "#3B82F6" },
    { label: "Jakarta Selatan", color: "#22C55E" },
    { label: "Jakarta Barat", color: "#F97316" },
    { label: "Jakarta Timur", color: "#A855F7" },
    { label: "Jakarta Utara", color: "#EC4899" },
    { label: "Kep. Seribu", color: "#14B8A6" },
  ];

  return (
    <div
      className="absolute z-[1000]"
      style={{
        bottom: 24,
        left: 24,
        background: "white",
        borderRadius: 14,
        padding: "16px 20px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
        minWidth: 190,
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a", marginBottom: 2 }}>Legend</div>
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>Jakarta Regions</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {regions.map((r) => (
          <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 14, height: 14, borderRadius: 4,
              background: r.color,
              opacity: 0.7,
            }} />
            <span style={{ fontSize: 12, color: "#334155", fontWeight: 500 }}>{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapViewController({ center, zoom, province }: { center: [number, number]; zoom: number; province?: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (province === "DKI Jakarta") {
      map.setView([-6.175, 106.827], 11);
    } else {
      map.setView(center, zoom);
    }
  }, [map, center, zoom, province]);
  return null;
}

/* ---------- Dashboard Cards ---------- */
function DonutCard({ title, data, colors, total }: {
  title: string;
  data: { name: string; value: number }[];
  colors: string[];
  total: number;
}) {
  return (
    <div className="rounded-xl border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[13px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h4>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <PieChart width={140} height={140}>
            <Pie
              data={data}
              cx={70}
              cy={70}
              innerRadius={42}
              outerRadius={62}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <RechartsTooltip
              contentStyle={{ background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px", color: "#F1F5F9" }}
              formatter={(value: any, name: any) => [`${Number(value).toLocaleString()} (${((Number(value) / total) * 100).toFixed(1)}%)`, String(name)]}
            />
          </PieChart>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[18px] font-extrabold" style={{ color: "var(--ch-text)" }}>{total.toLocaleString()}</span>
            <span className="text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Creators</span>
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          {data.map((item, i) => {
            const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
            return (
              <div key={item.name} className="flex items-center gap-2 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: colors[i % colors.length] }} />
                <span className="flex-1" style={{ color: "var(--ch-text-muted)" }}>{item.name}</span>
                <span className="font-bold" style={{ color: "var(--ch-text)" }}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BarCard({ title, data, maxVal }: {
  title: string;
  data: { name: string; value: number }[];
  maxVal: number;
}) {
  return (
    <div className="rounded-xl border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[13px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h4>
      </div>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{item.name}</span>
              <span className="text-[11px] font-bold" style={{ color: "var(--ch-text)" }}>{item.value.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: "var(--ch-border)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${maxVal > 0 ? (item.value / maxVal) * 100 : 0}%`,
                  background: "linear-gradient(90deg, #3B82F6, #60A5FA)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InsightsCard({ insights }: { insights: string[] }) {
  return (
    <div className="rounded-xl border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(59,130,246,0.1)" }}>
          <span className="text-[16px]">💡</span>
        </div>
        <h4 className="text-[13px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Key Insights</h4>
      </div>
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-blue-400 mt-0.5 shrink-0">✓</span>
            <p className="text-[12px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Creator Sidebar ---------- */
function CreatorSidebar({ creators, province }: { creators: Creator[]; province: string }) {
  const sorted = useMemo(() => [...creators].sort((a, b) => b.engagementRate - a.engagementRate), [creators]);
  const shown = sorted.slice(0, 20);
  const label = province === "DKI Jakarta" ? "All Jakarta" : province;
  return (
    <div className="rounded-xl border flex flex-col" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", maxHeight: "420px" }}>
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: "var(--ch-border)" }}>
        <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {creators.length.toLocaleString()} Creators in {label}
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>Sort by: Engagement Rate</p>
      </div>
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
        {shown.map((c) => (
          <a
            key={c.id}
            href={`/dashboard/creators/${c.id}`}
            className="flex items-center gap-3 px-4 py-3 border-b transition-colors hover:bg-white/5 no-underline"
            style={{ borderColor: "var(--ch-border)" }}
          >
            <img
              src={c.imageUrl || c.img || ""}
              alt={c.name}
              className="w-10 h-10 rounded-full object-cover shrink-0"
              style={{ border: "2px solid var(--ch-border)" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[12px] font-bold truncate" style={{ color: "var(--ch-text)" }}>@{c.handle}</span>
                {c.verified && <CheckCircle className="w-3 h-3 shrink-0" style={{ color: "#3B82F6" }} />}
              </div>
              <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>
                {c.platforms[0] ? c.platforms[0].charAt(0).toUpperCase() + c.platforms[0].slice(1) : ""} · {c.city}
              </p>
              <p className="text-[10px]" style={{ color: "var(--ch-text-soft)" }}>{c.category}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[12px] font-bold" style={{ color: "var(--ch-text)" }}>{formatFollowers(c.followers)}</p>
              <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>followers</p>
              <p className="text-[11px] font-bold mt-0.5" style={{ color: "#3B82F6" }}>{c.engagementRate}%</p>
              <p className="text-[9px]" style={{ color: "var(--ch-text-muted)" }}>ER</p>
            </div>
          </a>
        ))}
      </div>
      <div className="px-4 py-3 border-t" style={{ borderColor: "var(--ch-border)" }}>
        <a href="/dashboard/marketplace" className="block text-center text-[11px] font-bold py-2 rounded-lg transition-colors hover:bg-white/5 no-underline" style={{ color: "#3B82F6" }}>
          View All Creators →
        </a>
      </div>
    </div>
  );
}

/* ---------- Filter Select ---------- */
function FilterSelect({ icon, value, onChange, options }: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium"
        style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)", color: value === "all" ? "var(--ch-text-muted)" : "#3B82F6" }}>
        <span style={{ color: "#3B82F6" }}>{icon}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-transparent outline-none cursor-pointer pr-1"
          style={{ color: "inherit", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--ch-text-muted)" }} />
      </div>
    </div>
  );
}

/* ---------- Main Component ---------- */
export default function ServiceHub() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>("DKI Jakarta");
  const [provinceGeoJson, setProvinceGeoJson] = useState<FeatureCollection | null>(null);
  const [kotaGeoJson, setKotaGeoJson] = useState<FeatureCollection | null>(null);
  const [allCreators, setAllCreators] = useState<Creator[]>([]);
  const [loadingCreators, setLoadingCreators] = useState(true);

  const [filterCity, setFilterCity] = useState<string>("all");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [filterGender, setFilterGender] = useState<string>("all");

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      setLoadingCreators(true);
      try {
        const res = await creatorsApi.list({ page: 1, pageSize: 50000, verified: true });
        if (!cancelled) { setAllCreators(res.data); setLoadingCreators(false); }
      } catch {
        if (!cancelled) setLoadingCreators(false);
      }
    }
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    fetch(PROVINCE_URL)
      .then((r) => r.json())
      .then((topo: any) => {
        setProvinceGeoJson(topojson.feature(topo, topo.objects.gadm36_IDN_1) as unknown as FeatureCollection);
      })
      .catch(() => {});
    fetch(KABUPATEN_KOTA_URL)
      .then((r) => r.json())
      .then((topo: any) => {
        setKotaGeoJson(topojson.feature(topo, topo.objects.gadm36_IDN_2) as unknown as FeatureCollection);
      })
      .catch(() => {});
  }, []);

  const provinceCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of allCreators) {
      const prov = getProvince(c.city);
      counts.set(prov, (counts.get(prov) ?? 0) + 1);
    }
    return counts;
  }, [allCreators]);

  const provinceCities = useMemo(() => {
    if (!selectedProvince) return [];
    if (selectedProvince === "DKI Jakarta") return JAKARTA_KAB;
    const set = new Set<string>();
    for (const c of allCreators) {
      if (getProvince(c.city) === selectedProvince) set.add(c.city);
    }
    return Array.from(set).sort();
  }, [allCreators, selectedProvince]);

  const platformOptions = useMemo(() => {
    const set = new Set<string>();
    for (const c of allCreators) for (const p of c.platforms) set.add(p.toLowerCase());
    return Array.from(set).sort();
  }, [allCreators]);

  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    for (const c of allCreators) {
      if (c.category) {
        for (const cat of c.category.split(",")) {
          const trimmed = cat.trim();
          if (trimmed) set.add(trimmed);
        }
      }
    }
    return Array.from(set).sort();
  }, [allCreators]);

  const filteredCreators = useMemo(() => {
    return allCreators.filter((c) => {
      const cityForFilter = (selectedProvince === "DKI Jakarta") ? normalizeJakartaCity(c.city) : c.city;
      if (filterCity !== "all" && cityForFilter !== filterCity) return false;
      if (filterPlatform !== "all" && !c.platforms.map((p) => p.toLowerCase()).includes(filterPlatform)) return false;
      if (filterCategory !== "all") {
        const cats = (c.category || "").split(",").map((s) => s.trim().toLowerCase());
        if (!cats.includes(filterCategory.toLowerCase())) return false;
      }
      if (filterTier !== "all") {
        const tier = getTier(c.followers);
        if (tier.toLowerCase() !== filterTier.toLowerCase()) return false;
      }
      if (filterGender !== "all") {
        const rng = seededRandom(hashString(c.id));
        const r = rng();
        const gender = r < 0.612 ? "female" : r < 0.993 ? "male" : "other";
        if (gender !== filterGender.toLowerCase()) return false;
      }
      return true;
    });
  }, [allCreators, filterCity, filterPlatform, filterCategory, filterTier, filterGender, selectedProvince]);

  const totalCreators = allCreators.length;

  const topProvinces = useMemo(() => {
    return Array.from(provinceCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [provinceCounts]);

  const platformData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of allCreators) {
      for (const p of c.platforms) {
        const key = p.toLowerCase();
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
    const arr = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    const known = ["instagram", "tiktok", "youtube", "facebook", "x", "linkedin"];
    const result: { name: string; value: number }[] = [];
    let others = 0;
    for (const [name, val] of arr) {
      if (known.includes(name)) result.push({ name: name.charAt(0).toUpperCase() + name.slice(1), value: val });
      else others += val;
    }
    if (others > 0) result.push({ name: "Others", value: others });
    return result;
  }, [allCreators]);

  const tierData = useMemo(() => {
    let nano = 0, micro = 0, macro = 0, mega = 0;
    for (const c of allCreators) {
      if (c.followers >= 1000000) mega++;
      else if (c.followers >= 100000) macro++;
      else if (c.followers >= 10000) micro++;
      else nano++;
    }
    return [
      { name: "Nano (1K-10K)", value: nano },
      { name: "Micro (10K-100K)", value: micro },
      { name: "Macro (100K-1M)", value: macro },
      { name: "Mega (1M+)", value: mega },
    ];
  }, [allCreators]);

  const categoryData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of allCreators) {
      const cat = c.category || "Other";
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name, value }));
  }, [allCreators]);

  const insights = useMemo(() => {
    if (topProvinces.length === 0) return [];
    const topProv = topProvinces[0];
    const topPct = totalCreators > 0 ? ((topProv[1] / totalCreators) * 100).toFixed(1) : "0";
    const nanoCount = tierData.find(t => t.name.includes("Nano"))?.value ?? 0;
    const microCount = tierData.find(t => t.name.includes("Micro"))?.value ?? 0;
    const nmPct = totalCreators > 0 ? (((nanoCount + microCount) / totalCreators) * 100).toFixed(0) : "0";
    const topCat = categoryData[0];
    return [
      `The largest creator concentration is in ${topProv[0]}, with ${topProv[1].toLocaleString()} creators (${topPct}% of total).`,
      `Over ${nmPct}% of creators are Nano and Micro creators, forming the backbone of the creator ecosystem.`,
      topCat ? `Top category is ${topCat.name} with ${topCat.value.toLocaleString()} creators.` : "",
    ].filter(Boolean);
  }, [topProvinces, tierData, categoryData, totalCreators]);

  const selectedProvCount = selectedProvince ? provinceCounts.get(selectedProvince) ?? 0 : 0;
  const selectedProvTrend = selectedProvince ? MOCK_TRENDS[selectedProvince] ?? "↑ 5%" : "";

  const selectedProvCreators = useMemo(() => {
    if (!selectedProvince) return [];
    return filteredCreators.filter((c) => getProvince(c.city) === selectedProvince);
  }, [filteredCreators, selectedProvince]);

  const genderData = useMemo(() => {
    const source = selectedProvince ? selectedProvCreators : allCreators;
    let female = 0, male = 0, other = 0;
    for (const c of source) {
      const rng = seededRandom(hashString(c.id));
      const r = rng();
      if (r < 0.612) female++;
      else if (r < 0.993) male++;
      else other++;
    }
    return [
      { name: "Female", value: female },
      { name: "Male", value: male },
      { name: "Other", value: other },
    ];
  }, [selectedProvCreators, selectedProvince, allCreators]);
  const genderTotal = genderData.reduce((s, d) => s + d.value, 0);

  const displayLabel = selectedProvince === "DKI Jakarta" ? "All Jakarta" : selectedProvince;

  return (
    <div className="p-4 md:p-6 space-y-5" style={{ background: "var(--ch-bg)", minHeight: "100%" }}>
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10" style={{ background: "#040e1f", minHeight: 240 }}>
        <div className="relative z-10 grid lg:grid-cols-2 gap-0 items-center">
          <div className="px-8 py-10 lg:px-12 lg:py-12">
            <h2 className="text-2xl lg:text-[2rem] font-extrabold text-white leading-[1.15] tracking-tight mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Creator <span className="text-blue-400">Distribution</span> Analytics
            </h2>
            <p className="text-sm text-slate-400 mb-6 max-w-md leading-relaxed">
              Explore how {totalCreators.toLocaleString()} creators are distributed across Indonesia's provinces and cities.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/dashboard/marketplace">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/25 text-sm px-5 py-2.5 rounded-lg transition-colors">
                  <Users className="w-4 h-4 mr-1.5 inline" /> Find Creators
                </button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center relative px-6 py-5">
            <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: `radial-gradient(ellipse at 0% 0%, #040e1f 0%, transparent 50%), linear-gradient(to right, #040e1f 0%, transparent 15%), linear-gradient(to bottom, #040e1f 0%, transparent 12%), linear-gradient(to left, #040e1f 0%, transparent 15%), linear-gradient(to top, #040e1f 0%, transparent 10%)` }} />
            <img src="/hero-banner.jpg?v=9" alt="CreatorHub Platform" className="rounded-xl object-cover w-full max-h-[280px]" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterSelect icon={<MapPin className="w-4 h-4" />} value={filterCity} onChange={setFilterCity}
          options={[{ value: "all", label: displayLabel || "All Cities" }, ...provinceCities.map((c) => ({ value: c, label: c }))]} />
        <FilterSelect icon={<Share2 className="w-4 h-4" />} value={filterPlatform} onChange={setFilterPlatform}
          options={[{ value: "all", label: "All Platform" }, ...platformOptions.map((p) => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) }))]} />
        <FilterSelect icon={<Tag className="w-4 h-4" />} value={filterCategory} onChange={setFilterCategory}
          options={[{ value: "all", label: "All Category" }, ...categoryOptions.map((c) => ({ value: c, label: c }))]} />
        <FilterSelect icon={<BarChart3 className="w-4 h-4" />} value={filterTier} onChange={setFilterTier}
          options={[
            { value: "all", label: "All Tier" },
            { value: "nano", label: "Nano (<10K)" },
            { value: "micro", label: "Micro (10K-100K)" },
            { value: "mid", label: "Mid (100K-500K)" },
            { value: "macro", label: "Macro (500K-1M)" },
            { value: "mega", label: "Mega (>1M)" },
          ]} />
        <FilterSelect icon={<UsersRound className="w-4 h-4" />} value={filterGender} onChange={setFilterGender}
          options={[
            { value: "all", label: "All Gender" },
            { value: "female", label: "Female" },
            { value: "male", label: "Male" },
          ]} />
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors"
          style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)", color: "var(--ch-text-muted)" }}>
          <SlidersHorizontal className="w-4 h-4" /> More Filter
        </button>
      </div>

      {/* Single unified card: Map + Sidebar + Analytics */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
        {/* Card header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b" style={{ borderColor: "var(--ch-border)" }}>
          <div className="flex items-center gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] mb-0.5" style={{ color: "var(--ch-text-muted)" }}>
                <span>Indonesia</span>
                {selectedProvince && <><span>›</span><span style={{ color: "#3B82F6" }}>{displayLabel}</span></>}
              </div>
              <h3 className="text-[14px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {selectedProvince ? `${displayLabel} Creators` : "Creator Distribution by Province"}
              </h3>
            </div>
          </div>
          {selectedProvince ? (
            <div className="flex items-center gap-3 text-[10px]">
              {Object.entries(TIER_PIN_COLORS).map(([tier, color]) => (
                <div key={tier} className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <span style={{ color: "var(--ch-text-muted)" }}>{tier}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--ch-text-muted)" }}>
              <span>Least</span>
              <div className="flex gap-0.5">
                {["#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1e40af"].map((c) => (
                  <span key={c} className="inline-block w-4 h-2.5 rounded-sm" style={{ background: c }} />
                ))}
              </div>
              <span>Most</span>
            </div>
          )}
        </div>

        {/* Map + Sidebar row */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px]">
          {/* Map area */}
          <div className="relative" style={{ height: "420px" }}>
            <MapContainer
              preferCanvas
              center={[-2.5, 118.0]}
              zoom={5}
              zoomControl={false}
              className="w-full h-full"
              scrollWheelZoom={true}
              style={{ background: "#e8f0e8" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              {selectedProvince ? (
                <>
                  <MapViewController center={[-2.5, 118.0]} zoom={5} province={selectedProvince} />
                  {kotaGeoJson && (
                    <JakartaRegions
                      kotaGeoJson={kotaGeoJson}
                      creators={filteredCreators}
                    />
                  )}
                  <KabupatenLabels kotaGeoJson={kotaGeoJson} />
                  <ScaleControl position="bottomright" />
                </>
              ) : (
                provinceGeoJson && (
                  <ProvinceChoropleth
                    geoJsonData={provinceGeoJson}
                    provinceCounts={provinceCounts}
                    onProvinceClick={setSelectedProvince}
                  />
                )
              )}
            </MapContainer>

            {/* Province info overlay */}
            {selectedProvince && (
              <div className="absolute top-4 left-4 z-[1000] rounded-xl p-4 min-w-[200px]" style={{ background: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0", backdropFilter: "blur(8px)" }}>
                <p className="text-[12px] font-semibold mb-1" style={{ color: "#1e293b" }}>{displayLabel}</p>
                <p className="text-[28px] font-extrabold leading-none" style={{ color: "#0f172a" }}>
                  <AnimatedNumber value={selectedProvCount} />
                </p>
                <p className="text-[11px] mt-1" style={{ color: "#64748b" }}>Total Creators</p>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(34,197,94,0.15)", color: "#16a34a" }}>
                  {selectedProvTrend} <span style={{ color: "#64748b", fontWeight: 500 }}>vs last month</span>
                </div>
              </div>
            )}

            {/* Loading overlay */}
            {loadingCreators && (
              <div className="absolute inset-0 z-[1001] flex items-center justify-center" style={{ background: "rgba(7,11,20,0.7)" }}>
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--ch-text-muted)" }}>
                  <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  Loading creators...
                </div>
              </div>
            )}

            {/* Region legend */}
            {selectedProvince && <RegionLegend />}
          </div>

          {/* Right sidebar */}
          {selectedProvince && <CreatorSidebar creators={selectedProvCreators} province={selectedProvince} />}
        </div>

        {/* Bottom analytics inside same card */}
        <div className="border-t p-5" style={{ borderColor: "var(--ch-border)" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            <DonutCard title="Platform Distribution" data={platformData} colors={PLATFORM_COLORS} total={totalCreators} />
            <DonutCard title="Creator Tier Distribution" data={tierData} colors={TIER_COLORS} total={totalCreators} />
            <BarCard title="Top Categories" data={categoryData} maxVal={categoryData[0]?.value ?? 1} />
            <DonutCard title="Audience Gender" data={genderData} colors={GENDER_COLORS} total={genderTotal} />
            <InsightsCard insights={insights} />
          </div>
        </div>
      </div>
    </div>
  );
}

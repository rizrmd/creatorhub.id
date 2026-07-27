import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, GeoJSON, useMap } from "react-leaflet";
import type { FeatureCollection } from "geojson";
import * as topojson from "topojson-client";
import {
  Sprout, TrendingUp, MapPin,
} from "lucide-react";

const PROVINCE_URL = "https://gist.githubusercontent.com/ajie31/3144875bad9705e2b2b544909c022276/raw/Peta%20Indonesia%20Provinsi.json";

const PROVINCE_DATA = [
  { name: "Aceh", count: 10, lat: 4.6951, lng: 96.7494, region: "Sumatera" },
  { name: "Sumatera Utara", count: 10, lat: 2.1154, lng: 99.5451, region: "Sumatera" },
  { name: "Sumatera Barat", count: 4, lat: -0.7399, lng: 100.8000, region: "Sumatera" },
  { name: "Riau", count: 5, lat: 1.7600, lng: 102.2700, region: "Sumatera" },
  { name: "Jambi", count: 4, lat: -1.4852, lng: 102.4381, region: "Sumatera" },
  { name: "Sumatera Selatan", count: 4, lat: -3.3194, lng: 103.9144, region: "Sumatera" },
  { name: "Bengkulu", count: 5, lat: -3.5778, lng: 102.3464, region: "Sumatera" },
  { name: "Lampung", count: 4, lat: -4.5586, lng: 105.4068, region: "Sumatera" },
  { name: "Kep. Bangka Belitung", count: 5, lat: -2.7411, lng: 106.4406, region: "Sumatera" },
  { name: "DKI Jakarta", count: 24, lat: -6.2088, lng: 106.8456, region: "Jawa" },
  { name: "Banten", count: 5, lat: -6.4058, lng: 106.0640, region: "Jawa" },
  { name: "Jawa Barat", count: 12, lat: -6.9175, lng: 107.6191, region: "Jawa" },
  { name: "Jawa Tengah", count: 9, lat: -7.1510, lng: 110.1403, region: "Jawa" },
  { name: "DI Yogyakarta", count: 15, lat: -7.7972, lng: 110.3688, region: "Jawa" },
  { name: "Jawa Timur", count: 9, lat: -7.5361, lng: 112.2384, region: "Jawa" },
  { name: "Bali", count: 4, lat: -8.3405, lng: 115.0920, region: "Bali & Nusa Tenggara" },
  { name: "Nusa Tenggara Barat", count: 6, lat: -8.6529, lng: 117.3616, region: "Bali & Nusa Tenggara" },
  { name: "Nusa Tenggara Timur", count: 6, lat: -8.6574, lng: 121.0794, region: "Bali & Nusa Tenggara" },
  { name: "Kalimantan Barat", count: 4, lat: -0.2788, lng: 111.4753, region: "Kalimantan" },
  { name: "Kalimantan Tengah", count: 4, lat: -1.6383, lng: 113.3824, region: "Kalimantan" },
  { name: "Kalimantan Selatan", count: 4, lat: -3.0926, lng: 115.2838, region: "Kalimantan" },
  { name: "Kalimantan Timur", count: 4, lat: 0.5071, lng: 116.4194, region: "Kalimantan" },
  { name: "Kalimantan Utara", count: 4, lat: 2.8377, lng: 116.5687, region: "Kalimantan" },
  { name: "Sulawesi Utara", count: 4, lat: 0.6247, lng: 123.9750, region: "Sulawesi" },
  { name: "Sulawesi Tengah", count: 4, lat: -1.4300, lng: 121.4456, region: "Sulawesi" },
  { name: "Sulawesi Selatan", count: 5, lat: -3.6688, lng: 119.9741, region: "Sulawesi" },
  { name: "Sulawesi Tenggara", count: 4, lat: -4.1449, lng: 122.1748, region: "Sulawesi" },
  { name: "Gorontalo", count: 4, lat: 0.5435, lng: 123.0568, region: "Sulawesi" },
  { name: "Maluku", count: 4, lat: -3.2385, lng: 130.1453, region: "Maluku & Papua" },
  { name: "Maluku Utara", count: 5, lat: 1.5710, lng: 127.8088, region: "Maluku & Papua" },
  { name: "Papua", count: 5, lat: -4.2699, lng: 138.0804, region: "Maluku & Papua" },
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

function MapViewController() {
  const map = useMap();
  useEffect(() => {
    map.setView([-2.5, 118.0], 5);
  }, [map]);
  return null;
}

export default function DesaKreative() {
  const [provinceGeoJson, setProvinceGeoJson] = useState<FeatureCollection | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  useEffect(() => {
    fetch(PROVINCE_URL)
      .then((r) => r.json())
      .then((topo: any) => {
        setProvinceGeoJson(topojson.feature(topo, topo.objects.gadm36_IDN_1) as unknown as FeatureCollection);
      })
      .catch(() => {});
  }, []);

  const filteredProvinces = useMemo(() => {
    if (selectedRegion === "all") return PROVINCE_DATA;
    return PROVINCE_DATA.filter((p) => p.region === selectedRegion);
  }, [selectedRegion]);

  const regionStats = useMemo(() => {
    const map = new Map<string, { count: number; provinces: number }>();
    for (const p of PROVINCE_DATA) {
      const existing = map.get(p.region) ?? { count: 0, provinces: 0 };
      map.set(p.region, { count: existing.count + p.count, provinces: existing.provinces + 1 });
    }
    return Array.from(map.entries()).sort((a, b) => b[1].count - a[1].count);
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
              Desa Kreative
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
              <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>Kab/Kota di 31 Propinsi</p>
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
              <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>Propinsi Teridentifikasi</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border overflow-hidden"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: "var(--ch-border)" }}>
              <h2 className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>
                Peta Sebaran Usulan Pilot Project Desa/Kelurahan Kreatif
              </h2>
            </div>
            <div className="h-[500px]">
              <MapContainer
                center={[-2.5, 118.0]}
                zoom={5}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%", background: "#E8F0FE" }}
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <MapViewController />
                {provinceGeoJson && (
                  <GeoJSON
                    data={provinceGeoJson}
                    style={{ fillColor: "#93C5FD", fillOpacity: 0.3, color: "#3B82F6", weight: 1 }}
                  />
                )}
                {filteredProvinces.map((p) => (
                  <CircleMarker
                    key={p.name}
                    center={[p.lat, p.lng]}
                    radius={Math.max(12, Math.min(22, p.count * 1.2))}
                    fillColor="#F97316"
                    fillOpacity={0.9}
                    color="#FFFFFF"
                    weight={2}
                  >
                    <Tooltip permanent direction="top" offset={[0, -8]} className="desa-kreative-tooltip">
                      <span style={{ fontWeight: 700, fontSize: "13px", color: "#fff" }}>{p.count}</span>
                    </Tooltip>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Region filter */}
          <div className="rounded-xl border p-4"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <h3 className="text-[13px] font-bold mb-3" style={{ color: "var(--ch-text)" }}>Filter Wilayah</h3>
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedRegion("all")}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold text-left transition-colors"
                style={selectedRegion === "all"
                  ? { background: "var(--ch-primary-50)", color: "var(--ch-primary)" }
                  : { color: "var(--ch-text-muted)" }}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--ch-primary)" }} />
                Semua Wilayah
                <span className="ml-auto">{TOTAL_DESA}</span>
              </button>
              {regionStats.map(([region, stats]) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold text-left transition-colors"
                  style={selectedRegion === region
                    ? { background: `${REGION_COLORS[region]}15`, color: REGION_COLORS[region] }
                    : { color: "var(--ch-text-muted)" }}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: REGION_COLORS[region] }} />
                  {region}
                  <span className="ml-auto">{stats.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Province list */}
          <div className="rounded-xl border p-4"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <h3 className="text-[13px] font-bold mb-3" style={{ color: "var(--ch-text)" }}>
              Data per Propinsi
            </h3>
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {filteredProvinces.sort((a, b) => b.count - a.count).map((p) => (
                <div key={p.name} className="flex items-center gap-2 py-1.5 border-b last:border-0"
                  style={{ borderColor: "var(--ch-border)" }}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: REGION_COLORS[p.region] }} />
                  <span className="text-[12px] font-medium flex-1" style={{ color: "var(--ch-text)" }}>{p.name}</span>
                  <span className="text-[12px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "#F9731615", color: "#F97316" }}>
                    {p.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

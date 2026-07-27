import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, Polyline, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { FeatureCollection } from "geojson";
import * as topojson from "topojson-client";
import { Sprout, TrendingUp, MapPin, X } from "lucide-react";

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
  { name: "Aceh", count: 10, lat: 4.6951, lng: 96.7494, markerLat: 5.5, markerLng: 95.5, region: "Sumatera" },
  { name: "Sumatera Utara", count: 10, lat: 2.1154, lng: 99.5451, markerLat: 3.2, markerLng: 98.5, region: "Sumatera" },
  { name: "Sumatera Barat", count: 4, lat: -0.7399, lng: 100.8000, markerLat: 0.3, markerLng: 99.5, region: "Sumatera" },
  { name: "Riau", count: 5, lat: 1.7600, lng: 102.2700, markerLat: 2.8, markerLng: 101.5, region: "Sumatera" },
  { name: "Jambi", count: 4, lat: -1.4852, lng: 102.4381, markerLat: -0.8, markerLng: 101.5, region: "Sumatera" },
  { name: "Sumatera Selatan", count: 4, lat: -3.3194, lng: 103.9144, markerLat: -2.5, markerLng: 103.0, region: "Sumatera" },
  { name: "Bengkulu", count: 5, lat: -3.5778, lng: 102.3464, markerLat: -3.8, markerLng: 101.2, region: "Sumatera" },
  { name: "Lampung", count: 4, lat: -4.5586, lng: 105.4068, markerLat: -5.0, markerLng: 104.5, region: "Sumatera" },
  { name: "Kep. Bangka Belitung", count: 5, lat: -2.7411, lng: 106.4406, markerLat: -2.2, markerLng: 105.8, region: "Sumatera" },
  { name: "DKI Jakarta", count: 24, lat: -6.2088, lng: 106.8456, markerLat: -5.0, markerLng: 105.5, region: "Jawa" },
  { name: "Banten", count: 5, lat: -6.4058, lng: 106.0640, markerLat: -6.8, markerLng: 105.2, region: "Jawa" },
  { name: "Jawa Barat", count: 12, lat: -6.9175, lng: 107.6191, markerLat: -7.2, markerLng: 108.5, region: "Jawa" },
  { name: "Jawa Tengah", count: 9, lat: -7.1510, lng: 110.1403, markerLat: -7.8, markerLng: 110.8, region: "Jawa" },
  { name: "DI Yogyakarta", count: 15, lat: -7.7972, lng: 110.3688, markerLat: -8.3, markerLng: 109.8, region: "Jawa" },
  { name: "Jawa Timur", count: 9, lat: -7.5361, lng: 112.2384, markerLat: -7.8, markerLng: 113.2, region: "Jawa" },
  { name: "Bali", count: 4, lat: -8.3405, lng: 115.0920, markerLat: -8.8, markerLng: 114.5, region: "Bali & Nusa Tenggara" },
  { name: "Nusa Tenggara Barat", count: 6, lat: -8.6529, lng: 117.3616, markerLat: -8.8, markerLng: 116.8, region: "Bali & Nusa Tenggara" },
  { name: "Nusa Tenggara Timur", count: 6, lat: -8.6574, lng: 121.0794, markerLat: -8.5, markerLng: 122.0, region: "Bali & Nusa Tenggara" },
  { name: "Kalimantan Barat", count: 4, lat: -0.2788, lng: 111.4753, markerLat: 0.5, markerLng: 109.8, region: "Kalimantan" },
  { name: "Kalimantan Tengah", count: 4, lat: -1.6383, lng: 113.3824, markerLat: -2.2, markerLng: 112.5, region: "Kalimantan" },
  { name: "Kalimantan Selatan", count: 4, lat: -3.0926, lng: 115.2838, markerLat: -3.5, markerLng: 114.5, region: "Kalimantan" },
  { name: "Kalimantan Timur", count: 4, lat: 0.5071, lng: 116.4194, markerLat: 1.0, markerLng: 115.5, region: "Kalimantan" },
  { name: "Kalimantan Utara", count: 4, lat: 2.8377, lng: 116.5687, markerLat: 3.5, markerLng: 115.8, region: "Kalimantan" },
  { name: "Sulawesi Utara", count: 4, lat: 0.6247, lng: 123.9750, markerLat: 1.2, markerLng: 123.2, region: "Sulawesi" },
  { name: "Sulawesi Tengah", count: 4, lat: -1.4300, lng: 121.4456, markerLat: -1.8, markerLng: 120.5, region: "Sulawesi" },
  { name: "Sulawesi Selatan", count: 5, lat: -3.6688, lng: 119.9741, markerLat: -4.2, markerLng: 119.2, region: "Sulawesi" },
  { name: "Sulawesi Tenggara", count: 4, lat: -4.1449, lng: 122.1748, markerLat: -4.5, markerLng: 123.0, region: "Sulawesi" },
  { name: "Gorontalo", count: 4, lat: 0.5435, lng: 123.0568, markerLat: 0.8, markerLng: 122.2, region: "Sulawesi" },
  { name: "Maluku", count: 4, lat: -3.2385, lng: 130.1453, markerLat: -3.5, markerLng: 129.2, region: "Maluku & Papua" },
  { name: "Maluku Utara", count: 5, lat: 1.5710, lng: 127.8088, markerLat: 2.0, markerLng: 127.0, region: "Maluku & Papua" },
  { name: "Papua", count: 5, lat: -4.2699, lng: 138.0804, markerLat: -4.5, markerLng: 137.0, region: "Maluku & Papua" },
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
  const [selectedProvince, setSelectedProvince] = useState<ProvincePoint | null>(null);
  const mapRef = useRef<L.Map | null>(null);

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
    const m = new Map<string, { count: number; provinces: number }>();
    for (const p of PROVINCE_DATA) {
      const existing = m.get(p.region) ?? { count: 0, provinces: 0 };
      m.set(p.region, { count: existing.count + p.count, provinces: existing.provinces + 1 });
    }
    return Array.from(m.entries()).sort((a, b) => b[1].count - a[1].count);
  }, []);

  const handleProvinceClick = useCallback((p: ProvincePoint) => {
    setSelectedProvince(p);
  }, []);

  const handleMapClick = useCallback(() => {
    setSelectedProvince(null);
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
            {/* Map title bar */}
            <div className="px-4 py-3 border-b" style={{ borderColor: "var(--ch-border)" }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <h2 className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>
                  PETA SEBARAN USULAN PILOT PROJECT DESA/KELURAHAN KREATIF
                </h2>
              </div>
              <p className="text-[12px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
                133 Kab/Kota di 31 Propinsi — total desa/kelurahan berpotensi ekraf teridentifikasi sebanyak {TOTAL_DESA} desa/kelurahan
              </p>
            </div>
            <div className="relative h-[550px]" style={{ background: "#0B1120" }}>
              <MapContainer
                ref={mapRef}
                center={[-2.5, 118.0]}
                zoom={5}
                scrollWheelZoom={false}
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
                    style={(feature) => {
                      const name = feature?.properties?.NAME_1 || "";
                      const province = PROVINCE_DATA.find((p) => p.name === name);
                      const count = province?.count ?? 0;
                      const opacity = count >= 20 ? 0.7 : count >= 10 ? 0.5 : count >= 5 ? 0.35 : 0.2;
                      return {
                        fillColor: "#3B82F6",
                        fillOpacity: opacity,
                        color: "#60A5FA",
                        weight: 0.8,
                      };
                    }}
                  />
                )}
                {filteredProvinces.map((p) => {
                  const hasLine = Math.abs(p.lat - p.markerLat) > 0.3 || Math.abs(p.lng - p.markerLng) > 0.3;
                  return (
                    <div key={p.name}>
                      {hasLine && (
                        <Polyline
                          positions={[[p.lat, p.lng], [p.markerLat, p.markerLng]]}
                          pathOptions={{
                            color: "rgba(249,115,22,0.5)",
                            weight: 1.5,
                            dashArray: "4 3",
                          }}
                        />
                      )}
                      <Polyline
                        positions={[[p.lat, p.lng], [p.markerLat, p.markerLng]]}
                        pathOptions={{ color: "transparent", weight: 0 }}
                        eventHandlers={{
                          click: () => handleProvinceClick(p),
                        }}
                      />
                    </div>
                  );
                })}
                {filteredProvinces.map((p) => {
                  const icon = createMarkerIcon(p, selectedProvince?.name === p.name);
                  return (
                    <MarkerWithIcon
                      key={p.name}
                      position={[p.markerLat, p.markerLng]}
                      icon={icon}
                      onClick={() => handleProvinceClick(p)}
                    />
                  );
                })}
              </MapContainer>

              {/* Selected province popup */}
              {selectedProvince && (
                <div className="absolute top-4 right-4 z-[1000] rounded-xl border p-4 w-64"
                  style={{ background: "rgba(15,23,42,0.95)", borderColor: "rgba(249,115,22,0.4)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: REGION_COLORS[selectedProvince.region] }} />
                      <span className="text-[11px] font-semibold" style={{ color: REGION_COLORS[selectedProvince.region] }}>
                        {selectedProvince.region}
                      </span>
                    </div>
                    <button onClick={() => setSelectedProvince(null)} className="text-white/40 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[15px] font-extrabold text-white mb-1">{selectedProvince.name}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[28px] font-extrabold" style={{ color: "#F97316" }}>{selectedProvince.count}</span>
                    <span className="text-[12px] text-white/50">desa/kelurahan</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-[10px] text-white/40">
                      Koordinat: {selectedProvince.lat.toFixed(2)}°, {selectedProvince.lng.toFixed(2)}°
                    </p>
                  </div>
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
              {[...filteredProvinces].sort((a, b) => b.count - a.count).map((p) => (
                <button
                  key={p.name}
                  onClick={() => handleProvinceClick(p)}
                  className="w-full flex items-center gap-2 py-1.5 border-b last:border-0 text-left transition-colors hover:bg-black/5 rounded px-1"
                  style={{ borderColor: "var(--ch-border)" }}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: REGION_COLORS[p.region] }} />
                  <span className="text-[12px] font-medium flex-1" style={{ color: "var(--ch-text)" }}>{p.name}</span>
                  <span className="text-[12px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "#F9731615", color: "#F97316" }}>
                    {p.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Helper component: marker with click handler */

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

    return () => {
      marker.remove();
    };
  }, [map, position[0], position[1], icon, onClick]);

  return null;
}

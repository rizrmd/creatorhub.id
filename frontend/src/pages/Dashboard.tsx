import { useState } from "react";
import { Users, Megaphone, TrendingUp, DollarSign, ArrowUpRight, RefreshCw, FileText, Heart, Radio } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";

const stats = [
  { label: "Total Kreator", value: "1.247", change: "+18.6%", icon: Users, color: "bg-blue-50 text-blue-600" },
  { label: "Kampanye Aktif", value: "8", change: "+12.4%", icon: Megaphone, color: "bg-orange-50 text-orange-600" },
  { label: "Avg. Engagement", value: "3.87%", change: "+0.6%", icon: TrendingUp, color: "bg-cyan-50 text-cyan-600" },
  { label: "Budget Dikelola", value: "Rp 8.42B", change: "+24.7%", icon: DollarSign, color: "bg-amber-50 text-amber-600" },
];

const cities = [
  { name: "Jakarta", lat: -6.2088, lng: 106.8456, count: 342, status: "red" },
  { name: "Bandung", lat: -6.9175, lng: 107.6191, count: 187, status: "orange" },
  { name: "Surabaya", lat: -7.2575, lng: 112.7521, count: 156, status: "green" },
  { name: "Yogyakarta", lat: -7.7956, lng: 110.3695, count: 98, status: "orange" },
  { name: "Bali", lat: -8.3405, lng: 115.092, count: 203, status: "green" },
  { name: "Medan", lat: 3.5952, lng: 98.6722, count: 89, status: "green" },
  { name: "Makassar", lat: -5.1477, lng: 119.4327, count: 67, status: "green" },
  { name: "Balikpapan", lat: -1.2654, lng: 116.8312, count: 45, status: "green" },
  { name: "Semarang", lat: -6.9932, lng: 110.4203, count: 72, status: "orange" },
  { name: "Palembang", lat: -2.9761, lng: 104.7754, count: 54, status: "green" },
  { name: "Manado", lat: 1.4748, lng: 124.8421, count: 33, status: "green" },
];

const statusColor: Record<string, string> = {
  red: "#ef4444",
  orange: "#f97316",
  green: "#22c55e",
};

const initialActivities = [
  { text: "Nadia Aurellia menerima tawaran kampanye Ramadan", time: "2 menit lalu", type: "success" },
  { text: "Kampanye 'Brand Awareness Q1' dibuat", time: "15 menit lalu", type: "info" },
  { text: "Reza Alvaro diundang ke kampanye baru", time: "1 jam lalu", type: "info" },
  { text: "Pembayaran Rp 8.000.000 ke Andi Pratama selesai", time: "3 jam lalu", type: "success" },
  { text: "Laporan analytics Q4 tersedia", time: "5 jam lalu", type: "info" },
  { text: "Dimas Arya bergabung sebagai kreator baru", time: "6 jam lalu", type: "success" },
  { text: "Brief kampanye 'Summer Getaway' dikirim ke 3 kreator", time: "8 jam lalu", type: "info" },
];

export default function Dashboard() {
  const [activities, setActivities] = useState(initialActivities);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setActivities([
        { text: "Andi Pratama mengunggah konten kampanye terbaru", time: "Baru saja", type: "success" },
        { text: "Maya Putri mengkonfirmasi jadwal posting", time: "1 menit lalu", type: "info" },
        ...initialActivities.slice(0, 5),
      ]);
      setRefreshing(false);
    }, 800);
  };

  const sortedCities = [...cities].sort((a, b) => b.count - a.count);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Selamat datang kembali, Arif Budiman</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{s.value}</p>
                  <div className="flex items-center gap-1 mt-2 text-green-600 text-xs font-medium">
                    <ArrowUpRight className="w-3 h-3" />
                    {s.change} vs bulan lalu
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Map */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">KOL Geographic Distribution (Indonesia)</CardTitle>
            <Badge variant="secondary">1.000+ Kreator</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden rounded-b-xl">
          <div className="flex">
            <div className="flex-1" style={{ height: 380 }}>
              <MapContainer
                center={[-2.5, 117.5]}
                zoom={5}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {cities.map((city) => (
                  <CircleMarker
                    key={city.name}
                    center={[city.lat, city.lng]}
                    radius={Math.max(8, Math.min(22, city.count / 18))}
                    pathOptions={{
                      fillColor: statusColor[city.status],
                      fillOpacity: 0.75,
                      color: "#fff",
                      weight: 2,
                    }}
                  >
                    <Tooltip permanent={false} direction="top">
                      <span className="font-medium">{city.name}</span>: {city.count} kreator
                    </Tooltip>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
            {/* Legend */}
            <div className="w-44 shrink-0 p-4 border-l border-slate-100 space-y-2 overflow-auto">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Top Kota</p>
              {sortedCities.map((city) => (
                <div key={city.name} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: statusColor[city.status] }}
                  />
                  <span className="text-xs text-slate-700 flex-1 truncate">{city.name}</span>
                  <span className="text-xs font-semibold text-slate-500">{city.count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Creator vs Amplifier Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Creator Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: "Total Konten", value: "432" },
                { label: "Avg. ER", value: "3.4%" },
                { label: "Est. Reach", value: "1.5M" },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <p className="text-xl font-bold text-slate-800">{item.value}</p>
                  <p className="text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2">
              {[
                { label: "Instagram", pct: 55, color: "bg-pink-500" },
                { label: "TikTok", pct: 30, color: "bg-slate-700" },
                { label: "YouTube", pct: 15, color: "bg-red-500" },
              ].map((p) => (
                <div key={p.label}>
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>{p.label}</span><span>{p.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className={`${p.color} h-1.5 rounded-full`} style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500" />
              Amplifier Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: "Total Engagement", value: "15.7K" },
                { label: "Total Komentar", value: "3.2K" },
                { label: "Est. Reach", value: "5.2M" },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <p className="text-xl font-bold text-slate-800">{item.value}</p>
                  <p className="text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              {[
                { label: "Likes & Shares", value: "15.7K", pct: 75, color: "bg-pink-500" },
                { label: "Comments", value: "3.2K", pct: 20, color: "bg-purple-500" },
                { label: "Saves", value: "1.1K", pct: 5, color: "bg-blue-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-24 shrink-0">{item.label}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                    <div className={`${item.color} h-1.5 rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 w-10 text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity stream */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-600" />
              Activity & Event Stream
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh Stream
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {activities.map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${a.type === "success" ? "bg-green-500" : "bg-blue-500"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700">{a.text}</p>
                <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

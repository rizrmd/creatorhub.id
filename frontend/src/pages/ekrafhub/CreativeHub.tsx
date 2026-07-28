import { Building2, Rocket, MapPin } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const STAT_CARDS = [
  { label: "Total Ruang Kreatif", value: "263", icon: Building2, bg: "#EFF6FF", color: "#2563EB", desc: "Tersebar di Indonesia" },
  { label: "Flagship Program 2026", value: "60", icon: Rocket, bg: "#EFF6FF", color: "#2563EB", desc: "Aktivasi Creative Hub" },
  { label: "Provinsi Terbanyak", value: "5", icon: MapPin, bg: "#ECFDF5", color: "#059669", desc: "Provinsi dengan jumlah hub tertinggi" },
];

const PIE_DATA = [
  { name: "Jawa Barat", value: 73 },
  { name: "Bali", value: 33 },
  { name: "Jambi", value: 30 },
  { name: "Aceh", value: 25 },
  { name: "Kalimantan Timur", value: 16 },
  { name: "Jawa Timur", value: 15 },
  { name: "Lampung", value: 15 },
  { name: "Kep. Bangka Belitung", value: 9 },
  { name: "Kalimantan Selatan", value: 8 },
  { name: "Kep. Riau", value: 6 },
  { name: "Sumatera Selatan", value: 2 },
];

const PIE_COLORS = [
  "#1E40AF", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD",
  "#BFDBFE", "#DBEAFE", "#1E3A5F", "#1D4ED8", "#2563EB", "#6B7280",
];

const TOP_PROVINCES = [
  { rank: 1, name: "Jawa Barat", count: 73 },
  { rank: 2, name: "Bali", count: 33 },
  { rank: 3, name: "Jambi", count: 30 },
  { rank: 4, name: "Aceh", count: 25 },
  { rank: 5, name: "Kalimantan Timur", count: 16 },
];

const KURASI_LOKUS = [
  "Kabupaten kota kreatif",
  "15 provinsi prioritas dan provinsi non prioritas",
  "7+2 subsektor prioritas.",
  "Keberadaan Dinas Ekraf",
  "Kawasan Kemiskinan Ekstrem",
];

function customLabel({ cx, cy, midAngle, innerRadius, outerRadius, name, value }: any) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (value < 10) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700}>
      {`${name} (${value})`}
    </text>
  );
}

function externalLabel({ cx, cy, midAngle, outerRadius, name, value, percent }: any) {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const anchor = x > cx ? "start" : "end";
  return (
    <text x={x} y={y} fill="var(--ch-text-muted)" textAnchor={anchor} dominantBaseline="central" fontSize={10} fontWeight={600}>
      {`${name} (${value})`}
      <tspan x={x} dy={13} fontSize={9} fill="var(--ch-text-muted)">{`${(percent * 100).toFixed(1)}%`}</tspan>
    </text>
  );
}

export default function CreativeHub() {
  return (
    <div className="p-4 md:p-6 min-h-screen" style={{ background: "var(--ch-bg)" }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Creative Hub
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Kelola data, pemetaan, dan aktivasi Creative Hub di seluruh Indonesia.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {STAT_CARDS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border p-5 flex items-center gap-4"
              style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: s.bg }}>
                <Icon className="w-6 h-6" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--ch-text-muted)" }}>{s.label}</p>
                <p className="text-2xl font-extrabold leading-none" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[11px] mt-1" style={{ color: "var(--ch-text-muted)" }}>{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content: Pie Chart + Flagship Program + Kurasi Lokus */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        {/* Pie Chart - 3/5 */}
        <div className="lg:col-span-3 rounded-xl border p-5"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <h2 className="text-lg font-extrabold mb-1" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Data Sebaran Creative Hub di Indonesia
          </h2>
          <div className="relative" style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={120}
                  dataKey="value"
                  stroke="none"
                  label={customLabel}
                  labelLine={false}
                >
                  {PIE_DATA.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={120}
                  outerRadius={130}
                  dataKey="value"
                  stroke="none"
                  label={externalLabel}
                  labelLine={false}
                >
                  {PIE_DATA.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} opacity={0.5} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom info boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="rounded-lg p-3" style={{ background: "var(--ch-primary)", color: "white" }}>
              <p className="text-[11px] leading-relaxed">
                <strong>263 ruang kreatif</strong> sudah tersebar di Indonesia, tetapi belum seluruhnya berfungsi sebagai creative hub yang aktif dan produktif.
              </p>
              <p className="text-[9px] mt-2 opacity-70 italic">
                Sumber: Pemetaan Direktorat Fasilitas Infrastruktur (2025) [masih dalam proses updating]
              </p>
            </div>
            <div className="rounded-lg p-3" style={{ background: "var(--ch-primary)", color: "white" }}>
              <p className="text-[11px] font-bold mb-2">Provinsi dengan jumlah ruang kreatif terbanyak</p>
              <div className="space-y-1">
                {TOP_PROVINCES.map((p) => (
                  <div key={p.rank} className="flex items-center justify-between text-[11px]">
                    <span>{p.rank}. {p.name}</span>
                    <span className="font-bold">: {p.count} Ruang Kreatif</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Flagship + Kurasi Lokus - 2/5 */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Flagship Program 2026 */}
          <div className="rounded-xl p-6 text-center text-white relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #3B82F6 100%)" }}>
            <div className="absolute inset-0 opacity-10 flex items-center justify-center">
              <span className="text-[80px] font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>FLAGSHIP PROGRAM 2026</span>
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
                <MapPin className="w-10 h-10" />
              </div>
              <p className="text-xs font-bold tracking-widest uppercase mb-1">Flagship Program 2026</p>
              <p className="text-xs font-semibold opacity-90 mb-1">AKTIVASI</p>
              <p className="text-2xl font-extrabold">60 CREATIVE HUB</p>
            </div>
          </div>

          {/* Kurasi Lokus */}
          <div className="rounded-xl p-5 flex-1"
            style={{ background: "var(--ch-primary)", color: "white" }}>
            <h3 className="text-sm font-extrabold mb-4">Kurasi Lokus :</h3>
            <ul className="space-y-2.5">
              {KURASI_LOKUS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[12px]">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

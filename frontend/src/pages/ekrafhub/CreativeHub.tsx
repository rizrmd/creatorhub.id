import { Search, Bell, HelpCircle, Building2, Rocket, MapPin, ChevronDown, Download, ArrowRight } from "lucide-react";

const STAT_CARDS = [
  { label: "Total Ruang Kreatif", value: "263", icon: Building2, bg: "#EFF6FF", color: "#2563EB", desc: "Tersebar di Indonesia" },
  { label: "Flagship Program 2026", value: "60", icon: Rocket, bg: "#EFF6FF", color: "#2563EB", desc: "Aktivasi Creative Hub" },
  { label: "Provinsi Terbanyak", value: "5", icon: MapPin, bg: "#ECFDF5", color: "#059669", desc: "Provinsi dengan jumlah hub tertinggi" },
];

export default function CreativeHub() {
  return (
    <div className="p-4 md:p-6 min-h-screen" style={{ background: "var(--ch-bg)" }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Creative Hub
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--ch-text-muted)" }}>
            Kelola data, pemetaan, dan aktivasi Creative Hub di seluruh Indonesia.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-muted)" }} />
            <input
              type="text"
              placeholder="Cari data, program, atau hub..."
              className="pl-9 pr-4 py-2 rounded-lg border text-sm w-64"
              style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
            />
          </div>
          <button className="relative p-2 rounded-lg border" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
            <Bell className="w-5 h-5" style={{ color: "var(--ch-text-muted)" }} />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white" style={{ background: "#EF4444" }}>3</span>
          </button>
          <button className="p-2 rounded-lg border" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
            <HelpCircle className="w-5 h-5" style={{ color: "var(--ch-text-muted)" }} />
          </button>
          <div className="flex items-center gap-2 pl-3 border-l" style={{ borderColor: "var(--ch-border)" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "#2563EB" }}>AR</div>
            <span className="text-sm font-semibold hidden md:block" style={{ color: "var(--ch-text)" }}>Admin CreatorHub</span>
            <ChevronDown className="w-4 h-4" style={{ color: "var(--ch-text-muted)" }} />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between mb-6">
        <div />
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}>
            <Download className="w-4 h-4" />
            Unduh Laporan
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}>
            Semua Provinsi
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
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

      {/* Flagship Program 2026 */}
      <div className="rounded-xl p-6 text-center text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #3B82F6 100%)" }}>
        <div className="absolute top-4 right-4">
          <Rocket className="w-5 h-5 opacity-50" />
        </div>
        <h3 className="text-sm font-extrabold mb-4 opacity-90">Flagship Program 2026</h3>
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
          <MapPin className="w-8 h-8" />
        </div>
        <p className="text-xs font-semibold opacity-90 mb-1">AKTIVASI</p>
        <p className="text-xl font-extrabold mb-4">60 CREATIVE HUB</p>
        <button className="px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 mx-auto"
          style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
          Lihat Detail Program
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

import { Search, Bell, HelpCircle, Building2, Rocket, MapPin, LayoutGrid, Users, Link2, Zap, ArrowRight, Info, ChevronDown, Download } from "lucide-react";

const STAT_CARDS = [
  { label: "Total Ruang Kreatif", value: "263", icon: Building2, bg: "#EFF6FF", color: "#2563EB", desc: "Tersebar di Indonesia" },
  { label: "Flagship Program 2026", value: "60", icon: Rocket, bg: "#EFF6FF", color: "#2563EB", desc: "Aktivasi Creative Hub" },
  { label: "Provinsi Terbanyak", value: "5", icon: MapPin, bg: "#ECFDF5", color: "#059669", desc: "Provinsi dengan jumlah hub tertinggi" },
  { label: "Subsektor Prioritas", value: "7+2", icon: LayoutGrid, bg: "#FFF7ED", color: "#EA580C", desc: "Subsektor prioritas" },
];

const TOP_PROVINCES = [
  { rank: 1, name: "Jawa Barat", count: 73 },
  { rank: 2, name: "Bali", count: 33 },
  { rank: 3, name: "Jambi", count: 30 },
  { rank: 4, name: "Aceh", count: 25 },
  { rank: 5, name: "Kalimantan Timur", count: 16 },
];

const KURASI_LOKUS = [
  { label: "Kabupaten/kota kreatif", icon: Building2 },
  { label: "15 provinsi prioritas dan provinsi non-prioritas", icon: MapPin },
  { label: "7+2 subsektor prioritas", icon: LayoutGrid },
  { label: "Keberadaan Dinas Ekraf", icon: Users },
  { label: "Kawasan Kemiskinan Ekstrem", icon: HelpCircle },
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

      {/* Three Column Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Konsep & Arah Kebijakan */}
        <div className="rounded-xl border p-5"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <h3 className="text-sm font-extrabold mb-3" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Konsep & Arah Kebijakan Ruang Kreatif
          </h3>
          <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--ch-text-muted)" }}>
            Ruang Kreatif adalah platform ekosistem ekraf, bukan sekadar ruang fisik. Mendukung pertumbuhan ekosistem yang inklusif, berdaya saing, dan berkelanjutan sebagai wadah interaksi dan kolaborasi.
          </p>
          <div className="flex items-center gap-2">
            <div className="px-3 py-2 rounded-lg text-[11px] font-bold text-white" style={{ background: "#2563EB" }}>
              Ide, Ekspressi & Aspirasi
            </div>
            <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--ch-text-muted)" }} />
            <div className="px-3 py-2 rounded-lg text-[11px] font-bold text-white" style={{ background: "#7C3AED" }}>
              Karya & Inovasi
            </div>
            <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--ch-text-muted)" }} />
            <div className="px-3 py-2 rounded-lg text-[11px] font-bold text-white" style={{ background: "#059669" }}>
              Nilai Ekonomi
            </div>
          </div>
        </div>

        {/* 3 Peran Utama */}
        <div className="rounded-xl border p-5"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <h3 className="text-sm font-extrabold mb-4" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            3 Peran Utama
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { title: "Fasilitasi", desc: "Penyediaan sarana dan prasarana", tag: "Enabling", icon: Users, color: "#2563EB", bg: "#EFF6FF" },
              { title: "Katalisasi", desc: "Penghubung lintas sektor", tag: "Connecting", icon: Link2, color: "#7C3AED", bg: "#F5F3FF" },
              { title: "Akselerasi", desc: "Peningkatan kapasitas pelaku ekraf", tag: "Empowering", icon: Zap, color: "#059669", bg: "#ECFDF5" },
            ].map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.title} className="text-center">
                  <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                    style={{ background: r.bg }}>
                    <Icon className="w-6 h-6" style={{ color: r.color }} />
                  </div>
                  <p className="text-xs font-bold mb-1" style={{ color: "var(--ch-text)" }}>{r.title}</p>
                  <p className="text-[10px] leading-tight mb-2" style={{ color: "var(--ch-text-muted)" }}>{r.desc}</p>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: r.bg, color: r.color }}>
                    {r.tag}
                  </span>
                </div>
              );
            })}
          </div>
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

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Sebaran Creative Hub */}
        <div className="rounded-xl border overflow-hidden"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--ch-border)" }}>
            <h3 className="text-sm font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Sebaran Creative Hub di Indonesia
            </h3>
            <div className="flex items-center gap-4">
              <button className="text-xs font-bold border-b-2 pb-1" style={{ color: "#2563EB", borderColor: "#2563EB" }}>
                Peta Sebaran
              </button>
              <button className="text-xs font-semibold pb-1" style={{ color: "var(--ch-text-muted)" }}>
                Daftar Provinsi
              </button>
            </div>
          </div>
          <div className="p-5">
            {/* Map placeholder */}
            <div className="rounded-lg mb-4 relative overflow-hidden" style={{ background: "#1E3A5F", height: "220px" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-12 h-12 opacity-30" style={{ color: "#3B82F6" }} />
              </div>
              {/* Legend */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(0,0,0,0.5)" }}>
                <span className="text-[10px] font-semibold text-white">Jumlah Ruang Kreatif</span>
                <div className="flex items-center gap-1">
                  {[1, 10, 30, 50, 75].map((v) => (
                    <div key={v} className="w-5 h-3 rounded-sm" style={{ background: `rgba(59,130,246,${0.15 + v / 100})` }} />
                  ))}
                </div>
                <span className="text-[10px] text-white/70">1</span>
                <span className="text-[10px] text-white/70">10</span>
                <span className="text-[10px] text-white/70">30</span>
                <span className="text-[10px] text-white/70">50</span>
                <span className="text-[10px] text-white/70">75+</span>
              </div>
            </div>

            {/* Top Provinsi */}
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-extrabold" style={{ color: "var(--ch-text)" }}>Top Provinsi</h4>
              <button className="text-[11px] font-bold" style={{ color: "#2563EB" }}>Lihat Semua</button>
            </div>
            <div className="space-y-2">
              {TOP_PROVINCES.map((p) => (
                <div key={p.rank} className="flex items-center gap-3 py-1.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ background: "#2563EB" }}>
                    {p.rank}
                  </div>
                  <span className="text-xs font-semibold flex-1" style={{ color: "var(--ch-text)" }}>{p.name}</span>
                  <span className="text-xs font-extrabold" style={{ color: "var(--ch-text)" }}>{p.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-lg text-xs" style={{ background: "#EFF6FF", color: "#1E40AF" }}>
              <strong>263</strong> ruang kreatif sudah tersebar di Indonesia, namun masih terus bertambah.
            </div>
            <p className="text-[10px] mt-3 flex items-center gap-1" style={{ color: "var(--ch-text-muted)" }}>
              <Info className="w-3 h-3" />
              Warna lebih gelap menunjukkan jumlah ruang kreatif yang lebih banyak.
            </p>
          </div>
        </div>

        {/* Kurasi Lokus */}
        <div className="rounded-xl border p-5"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <h3 className="text-sm font-extrabold mb-5" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Kurasi Lokus
          </h3>
          <div className="space-y-4">
            {KURASI_LOKUS.map((k) => {
              const Icon = k.icon;
              return (
                <div key={k.label} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "var(--ch-bg)" }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "#EFF6FF", color: "#2563EB" }}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: "var(--ch-text)" }}>{k.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="rounded-xl border p-4 flex items-start gap-3"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "#EFF6FF", color: "#2563EB" }}>
          <Info className="w-4 h-4" />
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>
          <strong style={{ color: "#2563EB" }}>Sumber:</strong> Pemetaan & Pedoman Pengembangan Ruang Kreatif oleh Direktorat Infrastruktur (data per Mei 2025, masih dalam proses updating).
        </p>
      </div>
    </div>
  );
}

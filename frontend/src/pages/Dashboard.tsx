import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Megaphone, TrendingUp, DollarSign, ArrowUpRight, RefreshCw, Radio, Rocket } from "lucide-react";

const STATS = [
  { label: "Total Kreator",   value: "1.247",   change: "+18.6%", barColor: "#2563EB", href: "/marketplace",  icon: Users },
  { label: "Kampanye Aktif",  value: "8",        change: "+12.4%", barColor: "#F97316", href: "/campaigns",    icon: Megaphone },
  { label: "Avg. Engagement", value: "3.87%",    change: "+0.6%",  barColor: "#06B6D4", href: "/analytics",    icon: TrendingUp },
  { label: "Budget Dikelola", value: "Rp 8.42B", change: "+24.7%", barColor: "#F59E0B", href: "/payments",     icon: DollarSign },
];

const CITIES = [
  { name: "Jakarta",    count: 342, color: "#EF4444" },
  { name: "Bali",       count: 203, color: "#22C55E" },
  { name: "Bandung",    count: 187, color: "#F97316" },
  { name: "Surabaya",   count: 156, color: "#22C55E" },
  { name: "Yogyakarta", count: 98,  color: "#F97316" },
  { name: "Medan",      count: 89,  color: "#22C55E" },
  { name: "Semarang",   count: 72,  color: "#F97316" },
  { name: "Makassar",   count: 67,  color: "#22C55E" },
  { name: "Palembang",  count: 54,  color: "#22C55E" },
  { name: "Balikpapan", count: 45,  color: "#22C55E" },
  { name: "Manado",     count: 33,  color: "#22C55E" },
];

const NEEDS_ATTENTION = [
  { title: "Deliverable Overdue",     desc: "Tasya Farasya — Ramadan Glow 2026", tag: "Overdue", tagColor: "#EF4444", tagBg: "#FEE2E2" },
  { title: "Brief Awaiting Review",   desc: "Indomie Goreng × Fadil (in-review)", tag: "In Review", tagColor: "#B45309", tagBg: "#FEF3C7" },
  { title: "Budget 90% Used",         desc: "Mendoan Education Drop · Rp 148.2jt / 150jt", tag: "Warning", tagColor: "#B45309", tagBg: "#FEF3C7" },
];

const ACTIVE_CAMPAIGNS = [
  { name: "Ramadan Glow 2026",   brand: "Wardah",    pct: 57, hue: 340, daysLeft: 16 },
  { name: "Lebaran Travel Series",brand: "Traveloka", pct: 53, hue: 200, daysLeft: 21 },
];

const initialActivities = [
  { text: "Nadia Aurellia menerima tawaran kampanye Ramadan",    time: "2 mnt lalu",  type: "success", href: "/campaigns" },
  { text: "Kampanye 'Brand Awareness Q1' dibuat",                 time: "15 mnt lalu", type: "info",    href: "/campaigns" },
  { text: "Reza Alvaro diundang ke kampanye baru",                time: "1 jam lalu",  type: "info",    href: "/marketplace" },
  { text: "Pembayaran Rp 8.000.000 ke Andi Pratama selesai",     time: "3 jam lalu",  type: "success", href: "/payments" },
  { text: "Laporan analytics Q4 tersedia",                        time: "5 jam lalu",  type: "info",    href: "/analytics" },
  { text: "Dimas Arya bergabung sebagai kreator baru",            time: "6 jam lalu",  type: "success", href: "/marketplace" },
  { text: "Brief 'Summer Getaway' dikirim ke 3 kreator",         time: "8 jam lalu",  type: "info",    href: "/campaigns" },
];

const QUICK_ACTIONS = [
  { label: "Buat Kampanye",   icon: Megaphone, href: "/campaigns",  bg: "#EFF6FF", fg: "#2563EB" },
  { label: "Cari Kreator",    icon: Users,     href: "/marketplace", bg: "#FFF7ED", fg: "#F97316" },
  { label: "Boost Ads",       icon: Rocket,    href: "/boost-ads",   bg: "#F0FDF4", fg: "#16A34A" },
  { label: "Lihat Analytics", icon: TrendingUp,href: "/analytics",   bg: "#FFFBEB", fg: "#B45309" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState(initialActivities);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setActivities([
        { text: "Andi Pratama mengunggah konten kampanye terbaru", time: "Baru saja",   type: "success", href: "/campaigns" },
        { text: "Maya Putri mengkonfirmasi jadwal posting",          time: "1 mnt lalu",  type: "info",    href: "/marketplace" },
        ...initialActivities.slice(0, 5),
      ]);
      setRefreshing(false);
    }, 800);
  };

  return (
    <div className="p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden px-8 py-7" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        {/* Radial gradient accents */}
        <div style={{ position: "absolute", top: 0, right: 0, width: 280, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: 200, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="relative flex items-center gap-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shrink-0 animate-bob"
            style={{ background: "linear-gradient(135deg, var(--ch-primary-100), #EDE9FE)" }}>
            👋
          </div>
          <div>
            <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.5px]" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Selamat datang, Arif Budiman!
            </h1>
            <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
              Kamu punya <strong style={{ color: "var(--ch-primary)" }}>3 deliverable</strong> yang perlu direview dan <strong style={{ color: "var(--ch-orange)" }}>2 kampanye aktif</strong> berjalan.
            </p>
          </div>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <button
            key={s.label}
            onClick={() => navigate(s.href)}
            className="text-left rounded-xl p-5 border transition-all hover:-translate-y-0.5"
            style={{
              background: "var(--ch-surface)",
              borderColor: "var(--ch-border)",
              boxShadow: "var(--ch-shadow-sm)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--ch-shadow-md)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--ch-shadow-sm)")}
          >
            <div className="flex items-start gap-3">
              <div className="w-1 h-12 rounded-full shrink-0 mt-0.5" style={{ background: s.barColor }} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px]" style={{ color: "var(--ch-text-muted)" }}>{s.label}</p>
                <p className="text-[22px] font-extrabold leading-tight mt-0.5 tracking-[-0.3px]" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {s.value}
                </p>
                <div className="flex items-center gap-1 mt-1 text-[12px] font-semibold" style={{ color: "#16A34A" }}>
                  <ArrowUpRight style={{ width: 12, height: 12 }} />
                  {s.change} vs bulan lalu
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 opacity-60"
                style={{ background: s.barColor + "1a" }}>
                <s.icon style={{ width: 18, height: 18, color: s.barColor }} />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Needs attention */}
        <div className="rounded-xl border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <h2 className="text-[15px] font-bold mb-4" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Perlu Perhatian ⚠️
          </h2>
          <div className="space-y-3">
            {NEEDS_ATTENTION.map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "var(--ch-bg)" }}>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{item.title}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{item.desc}</p>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: item.tagBg, color: item.tagColor }}>
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active campaigns */}
        <div className="rounded-xl border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <h2 className="text-[15px] font-bold mb-4" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Kampanye Aktif 🚀
          </h2>
          <div className="space-y-4">
            {ACTIVE_CAMPAIGNS.map((c) => (
              <button key={c.name} onClick={() => navigate("/campaigns")}
                className="w-full text-left p-3 rounded-lg transition-colors hover:bg-slate-50"
                style={{ background: "var(--ch-bg)" }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{c.name}</p>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#DCFCE7", color: "#15803D" }}>
                    {c.daysLeft}h lagi
                  </span>
                </div>
                <p className="text-[12px] mb-2" style={{ color: "var(--ch-text-muted)" }}>{c.brand}</p>
                <div className="w-full rounded-full h-1.5" style={{ background: "var(--ch-border)" }}>
                  <div className="h-1.5 rounded-full transition-all" style={{ width: `${c.pct}%`, background: `hsl(${c.hue}, 80%, 55%)` }} />
                </div>
                <p className="text-[11px] mt-1 text-right" style={{ color: "var(--ch-text-soft)" }}>{c.pct}% selesai</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <h2 className="text-[15px] font-bold mb-4" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Quick Actions ⚡
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map((q) => (
              <button key={q.label} onClick={() => navigate(q.href)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:-translate-y-0.5"
                style={{ borderColor: "var(--ch-border)", background: q.bg }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--ch-shadow-sm)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <q.icon style={{ width: 20, height: 20, color: q.fg }} />
                <span className="text-[12px] font-semibold text-center leading-tight" style={{ color: "var(--ch-text)" }}>{q.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Creator map + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* City distribution */}
        <div className="rounded-xl border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <h2 className="text-[15px] font-bold mb-1" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Distribusi Kreator 🗺️
          </h2>
          <p className="text-[12px] mb-4" style={{ color: "var(--ch-text-muted)" }}>Klik kota untuk filter di Marketplace</p>
          <div className="space-y-2">
            {CITIES.map((city) => (
              <button key={city.name} onClick={() => navigate(`/marketplace?city=${encodeURIComponent(city.name)}`)}
                className="w-full flex items-center gap-3 py-1.5 px-2 rounded-lg transition-colors hover:bg-slate-50 group">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: city.color }} />
                <span className="text-[13px] flex-1 text-left group-hover:text-blue-600 transition-colors" style={{ color: "var(--ch-text)" }}>
                  {city.name}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 rounded-full" style={{ background: "var(--ch-border)" }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${(city.count / 342) * 100}%`, background: city.color }} />
                  </div>
                  <span className="text-[12px] font-semibold w-8 text-right" style={{ color: "var(--ch-text-muted)" }}>{city.count}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Activity stream */}
        <div className="rounded-xl border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold flex items-center gap-2" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <Radio style={{ width: 16, height: 16, color: "var(--ch-primary)" }} />
              Activity Stream
            </h2>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-semibold transition-colors hover:bg-slate-50"
              style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}
            >
              <RefreshCw style={{ width: 12, height: 12 }} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
          <div className="space-y-0.5">
            {activities.map((a, i) => (
              <button key={i} onClick={() => navigate(a.href)}
                className="w-full flex items-start gap-3 p-2.5 rounded-lg transition-colors hover:bg-slate-50 text-left group">
                <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: a.type === "success" ? "#16A34A" : "var(--ch-primary)" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] group-hover:text-blue-600 transition-colors" style={{ color: "var(--ch-text)" }}>{a.text}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--ch-text-soft)" }}>{a.time}</p>
                </div>
                <ArrowUpRight style={{ width: 14, height: 14, flexShrink: 0, marginTop: 2, color: "var(--ch-text-soft)" }}
                  className="group-hover:text-blue-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

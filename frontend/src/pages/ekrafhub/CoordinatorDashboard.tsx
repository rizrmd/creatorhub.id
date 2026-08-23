import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin, Users, FileVideo, Clock, TrendingUp,
  Eye, Heart, MessageCircle, Bookmark,
  CalendarDays, Filter, BarChart3,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const CONTENT_PER_PERIOD = [
  { week: "1-7 Ags", foto: 24, video: 12, total: 36 },
  { week: "8-14 Ags", foto: 31, video: 18, total: 49 },
  { week: "15-18 Ags", foto: 12, video: 5, total: 17 },
];

const CONTENT_STATUS = [
  { name: "Published", value: 62, color: "#22C55E" },
  { name: "In Progress", value: 23, color: "#F59E0B" },
  { name: "Draft", value: 15, color: "#94A3B8" },
];

const PLATFORM_DATA = [
  { name: "Instagram", value: 38, color: "#E1306C" },
  { name: "TikTok", value: 28, color: "#000000" },
  { name: "YouTube", value: 18, color: "#FF0000" },
  { name: "Media Online", value: 10, color: "#3B82F6" },
  { name: "WhatsApp", value: 6, color: "#25D366" },
];

const TOP_CONTENT = [
  { title: "Ga Bisa Yura, Tsunami Ambil Semua Yang Aku Punya", platform: "TikTok", views: "40.3M", likes: "3.1M", comments: "9.6K", favorites: "133.4K", status: "published", date: "7 Agu 2024", url: "https://www.tiktok.com/@itsbanuun/video/7400106989990300933", thumb: "/creators/itsbanuun-tiktok-1.webp" },
  { title: "Tips Usaha Kopi Aceh untuk Pemula", platform: "Instagram", views: "12.4K", likes: "892", comments: "45", favorites: "120", status: "published", date: "5 Ags 2026", url: "#", thumb: "" },
  { title: "Vlog Desa Gampong Aceh - Daya Tarik Wisata", platform: "TikTok", views: "45.2K", likes: "3.1K", comments: "189", favorites: "2.1K", status: "published", date: "3 Ags 2026", url: "#", thumb: "" },
  { title: "Tutorial Kerajinan Tangan dari Bahan Lokal", platform: "YouTube", views: "8.7K", likes: "456", comments: "67", favorites: "89", status: "in_progress", date: "2 Ags 2026", url: "#", thumb: "" },
  { title: "Profil Pelaku UMKM Aceh - Sentra Kopi", platform: "Instagram", views: "6.3K", likes: "321", comments: "34", favorites: "56", status: "published", date: "1 Ags 2026", url: "#", thumb: "" },
];

export default function CoordinatorDashboard() {
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-08-18");

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      {/* Header */}
      <div>
        <h1 className="text-lg font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Dashboard Koordinator
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--ch-text-muted)" }}>
          Monitoring konten & desa kreatif — Provinsi Aceh
        </p>
      </div>

      {/* Period Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}>
          <CalendarDays className="w-3.5 h-3.5" style={{ color: "var(--ch-primary)" }} />
          <span className="font-semibold">Periode:</span>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="bg-transparent border-0 outline-none text-xs font-semibold" style={{ color: "var(--ch-text)" }} />
          <span style={{ color: "var(--ch-text-muted)" }}>-</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="bg-transparent border-0 outline-none text-xs font-semibold" style={{ color: "var(--ch-text)" }} />
        </div>
        <div className="flex items-center gap-1 px-3 py-2 rounded-lg border text-xs font-semibold"
          style={{ background: "var(--ch-primary)", borderColor: "var(--ch-primary)", color: "white" }}>
          <Filter className="w-3.5 h-3.5" />
          Filter
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Desa Kreatif", value: "10", icon: MapPin, bg: "#ECFDF5", color: "#059669", desc: "di Provinsi Aceh", link: "/dashboard/ekrafhub/desa-kreatif/discover" },
          { label: "Konten Kreator", value: "100", icon: Users, bg: "#F0F9FF", color: "#0284C7", desc: "di bawah koordinasi", link: "/dashboard/ekrafhub/marketplace?city=Aceh+Jaya" },
          { label: "Total Konten", value: "102", icon: FileVideo, bg: "#EFF6FF", color: "#2563EB", desc: "1 Ags — 18 Ags 2026" },
          { label: "In Progress", value: "23", icon: Clock, bg: "#FEF3C7", color: "#D97706", desc: "konten sedang dibuat" },
        ].map((s) => {
          const Icon = s.icon;
          const card = (
            <div key={s.label} className={`rounded-xl border p-4 flex items-center gap-3 ${s.link ? "cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md" : ""}`}
              style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: s.bg }}>
                <Icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-[22px] md:text-[26px] font-extrabold leading-none" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[11px] mt-1 font-medium" style={{ color: "var(--ch-text-muted)" }}>{s.label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{s.desc}</p>
              </div>
            </div>
          );
          return s.link ? <Link key={s.label} to={s.link} className="no-underline block">{card}</Link> : card;
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Content Per Period */}
        <div className="lg:col-span-2 rounded-xl border overflow-hidden"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--ch-border)" }}>
            <h3 className="text-[13px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Konten per Periode
            </h3>
            <div className="flex items-center gap-3 text-[10px] font-semibold">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Foto</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Video</span>
            </div>
          </div>
          <div className="p-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CONTENT_PER_PERIOD} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--ch-border)" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "var(--ch-text-muted)" }} />
                <YAxis tick={{ fontSize: 10, fill: "var(--ch-text-muted)" }} />
                <Tooltip
                  contentStyle={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)", borderRadius: 8, fontSize: 11 }}
                  labelStyle={{ color: "var(--ch-text)" }}
                />
                <Bar dataKey="foto" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="video" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Status */}
        <div className="rounded-xl border overflow-hidden"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--ch-border)" }}>
            <h3 className="text-[13px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Status Konten
            </h3>
          </div>
          <div className="p-4 flex flex-col items-center">
            <div className="relative w-[160px] h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={CONTENT_STATUS} cx="50%" cy="50%" innerRadius={50} outerRadius={72} dataKey="value" stroke="none">
                    {CONTENT_STATUS.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[20px] font-extrabold" style={{ color: "var(--ch-text)" }}>102</p>
                  <p className="text-[9px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Total</p>
                </div>
              </div>
            </div>
            <div className="w-full mt-3 space-y-1.5">
              {CONTENT_STATUS.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="text-[11px] font-semibold flex-1" style={{ color: "var(--ch-text)" }}>{s.name}</span>
                  <span className="text-[11px] font-extrabold" style={{ color: "var(--ch-text)" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Platform & Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Platform Distribution */}
        <div className="rounded-xl border overflow-hidden"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--ch-border)" }}>
            <h3 className="text-[13px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Distribusi Platform
            </h3>
          </div>
          <div className="p-4 space-y-2">
            {PLATFORM_DATA.map((p) => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold" style={{ color: "var(--ch-text)" }}>{p.name}</span>
                  <span className="text-[11px] font-extrabold" style={{ color: "var(--ch-text)" }}>{p.value}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--ch-border)" }}>
                  <div className="h-full rounded-full" style={{ width: `${p.value}%`, background: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Content */}
        <div className="lg:col-span-2 rounded-xl border overflow-hidden"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--ch-border)" }}>
            <h3 className="text-[13px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Konten Terpopuler
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--ch-primary)", color: "white" }}>
              1 Ags — 18 Ags
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--ch-border)" }}>
            {TOP_CONTENT.map((c, i) => {
              const isTop = i === 0 && c.thumb;
              return (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5" style={{ borderBottomColor: "var(--ch-border)" }}>
                {isTop ? (
                  <>
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg overflow-hidden shrink-0 block">
                      <img src={c.thumb} alt={c.title} className="w-full h-full object-cover" />
                    </a>
                    <div className="flex-1 min-w-0">
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold truncate block no-underline" style={{ color: "var(--ch-text)" }}>{c.title}</a>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[9px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{c.platform} · {c.date}</span>
                        <span className="flex items-center gap-0.5 text-[9px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>
                          <Eye className="w-2.5 h-2.5" /> {c.views}
                        </span>
                        <span className="flex items-center gap-0.5 text-[9px] font-semibold" style={{ color: "#FE2C55" }}>
                          <Heart className="w-2.5 h-2.5" /> {c.likes}
                        </span>
                        <span className="flex items-center gap-0.5 text-[9px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>
                          <MessageCircle className="w-2.5 h-2.5" /> {c.comments}
                        </span>
                        <span className="flex items-center gap-0.5 text-[9px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>
                          <Bookmark className="w-2.5 h-2.5" /> {c.favorites}
                        </span>
                      </div>
                    </div>
                    <a href={c.url} target="_blank" rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold no-underline transition-all hover:scale-[1.03]"
                      style={{ background: "linear-gradient(135deg, #FE2C55, #25F4EE)", color: "white", boxShadow: "0 2px 8px rgba(254,44,85,.25)" }}>
                      <BarChart3 className="w-3 h-3" />
                      Analyze
                    </a>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold"
                      style={{ background: i < 3 ? "rgba(249,115,22,.12)" : "var(--ch-border)", color: i < 3 ? "#F97316" : "var(--ch-text-muted)" }}>
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold truncate" style={{ color: "var(--ch-text)" }}>{c.title}</p>
                      <p className="text-[9px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{c.platform} · {c.date}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="flex items-center gap-0.5 text-[9px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>
                        <Eye className="w-2.5 h-2.5" /> {c.views}
                      </span>
                      <span className="flex items-center gap-0.5 text-[9px] font-semibold" style={{ color: "#FE2C55" }}>
                        <Heart className="w-2.5 h-2.5" /> {c.likes}
                      </span>
                      <span className="flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{
                          background: c.status === "published" ? "#DCFCE7" : c.status === "in_progress" ? "#FEF3C7" : "#F1F5F9",
                          color: c.status === "published" ? "#16A34A" : c.status === "in_progress" ? "#D97706" : "#94A3B8",
                        }}>
                        {c.status === "published" ? "Published" : c.status === "in_progress" ? "In Progress" : "Draft"}
                      </span>
                    </div>
                  </>
                )}
              </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="rounded-xl border p-4 flex items-start gap-3"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "#ECFDF5", color: "#059669" }}>
          <TrendingUp className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[12px] font-bold" style={{ color: "var(--ch-text)" }}>Ringkasan Periode</p>
          <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>
            1 Agustus — 18 Agustus 2026: Total <strong>102 konten</strong> diproduksi oleh <strong>100 kreator</strong> dari <strong>10 desa kreatif</strong> di Provinsi Aceh. <strong>23 konten</strong> masih dalam proses pengerjaan.
          </p>
        </div>
      </div>
    </div>
  );
}

import { Camera, Video, User, BookOpen, FileText, Calendar, Upload, CheckCircle, Share2, Archive, Info, Globe, Send, PenTool, Image as ImageIcon, Film as FilmIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const STAT_CARDS = [
  { label: "Aset Konten", value: "3.200", icon: ImageIcon, bg: "#EFF6FF", color: "#2563EB" },
  { label: "Video", value: "1.000", icon: FilmIcon, bg: "#F0F4FF", color: "#3B5BDB" },
  { label: "Artikel & Caption", value: "800", icon: FileText, bg: "#F0F9FF", color: "#0284C7" },
  { label: "Portal Content Hub", value: "1", icon: Globe, bg: "#FFF7ED", color: "#EA580C" },
];

const ASET_ITEMS = [
  { label: "Foto Produk", icon: Camera, img: "https://picsum.photos/seed/fotoproduk/200/140" },
  { label: "Video Reels", icon: Video, img: "https://picsum.photos/seed/videoreels/200/140" },
  { label: "Profil Pelaku", icon: User, img: "https://picsum.photos/seed/profilpelaku/200/140" },
  { label: "Katalog Digital", icon: BookOpen, img: "https://picsum.photos/seed/katalogdigital/200/140" },
  { label: "Press Release", icon: FileText, img: "https://picsum.photos/seed/pressrelease/200/140" },
  { label: "Dokumentasi Acara", icon: Calendar, img: "https://picsum.photos/seed/dokumentasiacara/200/140" },
];

const ALUR_DISTRIBUSI = [
  { label: "Produksi", desc: "Pembuatan konten oleh pelaku dan tim program.", icon: PenTool },
  { label: "Review", desc: "Kurasi dan validasi konten oleh tim editor.", icon: CheckCircle },
  { label: "Upload", desc: "Unggah konten ke CreatorHub.id dan tagging.", icon: Upload },
  { label: "Distribusi", desc: "Distribusi konten ke berbagai kanal digital.", icon: Share2 },
  { label: "Arsip", desc: "Penyimpanan dan pengelolaan aset secara terstruktur.", icon: Archive },
];

const KANAL_DATA = [
  { name: "Instagram", value: 30, color: "#E1306C" },
  { name: "TikTok", value: 20, color: "#000000" },
  { name: "YouTube", value: 20, color: "#FF0000" },
  { name: "Media Online", value: 15, color: "#3B82F6" },
  { name: "WhatsApp", value: 10, color: "#25D366" },
  { name: "Website", value: 5, color: "#F97316" },
];

const OUTPUT_FEATURES = [
  { title: "Content management", desc: "Pengelolaan aset konten terpusat dengan struktur yang rapi dan mudah diakses.", icon: FileText },
  { title: "Asset tagging", desc: "Penandaan konten berdasarkan kategori, tema, pelaku, dan lokasi untuk kemudahan pencarian.", icon: Share2 },
  { title: "Multichannel publishing", desc: "Penerbitan konten otomatis ke berbagai kanal sesuai strategi distribusi program.", icon: Send },
  { title: "Editorial calendar", desc: "Perencanaan konten terstruktur untuk menjaga konsistensi dan relevansi publikasi.", icon: Calendar },
];

export default function EkrafHubDashboard() {
  return (
    <div className="p-4 md:p-6" style={{ background: "var(--ch-bg)" }}>
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STAT_CARDS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border p-4 flex items-center gap-3"
              style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: s.bg }}>
                <Icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-[22px] md:text-[26px] font-extrabold leading-none" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[11px] mt-1 font-medium" style={{ color: "var(--ch-text-muted)" }}>{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Pusat Aset Konten */}
        <div className="rounded-xl border overflow-hidden"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--ch-border)" }}>
            <h3 className="text-[14px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Pusat Aset Konten
            </h3>
          </div>
          <div className="p-3 grid grid-cols-3 gap-2">
            {ASET_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-lg overflow-hidden group cursor-pointer">
                  <div className="relative h-[80px] overflow-hidden">
                    <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="px-2 py-2 flex items-center gap-1.5">
                    <Icon className="w-3 h-3 shrink-0" style={{ color: "#2563EB" }} />
                    <span className="text-[10px] font-semibold leading-tight" style={{ color: "var(--ch-text)" }}>{item.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alur Distribusi */}
        <div className="rounded-xl border overflow-hidden"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--ch-border)" }}>
            <h3 className="text-[14px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Alur Distribusi
            </h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              {ALUR_DISTRIBUSI.map((step, i) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.label} className="flex items-center">
                    <div className="flex flex-col items-center text-center w-[60px]">
                      <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center mb-1.5"
                        style={{ borderColor: "#2563EB", color: "#2563EB", background: "#EFF6FF" }}>
                        <StepIcon className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold leading-tight" style={{ color: "var(--ch-text)" }}>{step.label}</span>
                    </div>
                    {i < ALUR_DISTRIBUSI.length - 1 && (
                      <div className="flex items-center mx-0.5">
                        <div className="w-4 h-[2px]" style={{ borderStyle: "dashed", borderColor: "#94A3B8" }} />
                        <svg className="w-3 h-3 shrink-0" style={{ color: "#94A3B8" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="space-y-2">
              {ALUR_DISTRIBUSI.map((step) => (
                <div key={step.label} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "#2563EB" }} />
                  <div>
                    <span className="text-[11px] font-bold" style={{ color: "var(--ch-text)" }}>{step.label}:</span>
                    <span className="text-[10px] ml-1" style={{ color: "var(--ch-text-muted)" }}>{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kanal Distribusi */}
        <div className="rounded-xl border overflow-hidden"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--ch-border)" }}>
            <h3 className="text-[14px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Kanal Distribusi
            </h3>
          </div>
          <div className="p-4 flex flex-col items-center">
            <div className="relative w-[180px] h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={KANAL_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    dataKey="value"
                    stroke="none"
                  >
                    {KANAL_DATA.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[22px] font-extrabold" style={{ color: "var(--ch-text)" }}>6</p>
                  <p className="text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Kanal</p>
                </div>
              </div>
            </div>
            <div className="w-full mt-3 space-y-1.5">
              {KANAL_DATA.map((k) => (
                <div key={k.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: k.color }} />
                  <span className="text-[11px] font-semibold flex-1" style={{ color: "var(--ch-text)" }}>{k.name}</span>
                  <span className="text-[11px] font-extrabold" style={{ color: "var(--ch-text)" }}>{k.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Output CreatorHub.id */}
      <div className="rounded-xl border overflow-hidden mb-6"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--ch-border)" }}>
          <h3 className="text-[15px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Output CreatorHub.id
          </h3>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {OUTPUT_FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "#EFF6FF", color: "#2563EB" }}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[12px] font-bold" style={{ color: "var(--ch-text)" }}>{f.title}</p>
                  <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer note */}
      <div className="rounded-xl border p-4 flex items-start gap-3"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "#EFF6FF", color: "#2563EB" }}>
          <Info className="w-4 h-4" />
        </div>
        <p className="text-[12px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>
          Dashboard ini menggambarkan bagaimana CreatorHub.id mengelola aset, distribusi, dan pemanfaatan ulang konten program secara terpusat.
        </p>
      </div>
    </div>
  );
}

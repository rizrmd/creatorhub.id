import { Globe, Landmark, MapPin, Info, ChevronRight } from "lucide-react";

const LEVEL_PROGRAMS = [
  {
    title: "Internasional",
    icon: Globe,
    color: "#3B82F6",
    bg: "linear-gradient(135deg, #1E3A5F 0%, #0F2942 100%)",
    criteria: "Kegiatan strategis yang dapat memperkuat pengembangan ekosistem ekonomi kreatif baik lintas maupun tiap subsektor.",
    duration: "September – Desember 2026",
    desc: "Promosi branding Creative by Indonesia melalui aktivasi pada kegiatan level internasional terkurasi.",
  },
  {
    title: "Provinsi",
    icon: Landmark,
    color: "#10B981",
    bg: "linear-gradient(135deg, #064E3B 0%, #022C22 100%)",
    criteria: "Lokasi di 15 provinsi prioritas dan daerah yang telah berkomitmen untuk pembentukan kelembagaan daerah.",
    duration: "Diprioritaskan Oktober 2026, bersamaan dengan perayaan Oktoerekreasi, Hekrafnas, dan WCCE.",
    desc: "Kriteria kegiatan level nasional maupun internasional terkurasi pada tingkat provinsi.",
  },
  {
    title: "Kabupaten/Kota",
    icon: MapPin,
    color: "#F97316",
    bg: "linear-gradient(135deg, #7C2D12 0%, #431407 100%)",
    criteria: "Diajukan pada program yang telah dicanangkan oleh satker teknis maupun pengajuan proposal event di daerah.",
    duration: "September – Desember 2026",
    desc: "Kriteria event level daerah kabupaten/kota terkurasi.",
  },
];

const KEGIATAN = [
  { label: "Kegiatan Level\nInternasional", value: "10", sub: "kegiatan internasional", icon: Globe, color: "#3B82F6" },
  { label: "Kegiatan Level\nNasional", value: "100", sub: "kegiatan provinsi", icon: Landmark, color: "#10B981" },
  { label: "Kegiatan Level\nKabupaten/Kota", value: "175", sub: "kegiatan kabupaten/kota, berdasarkan kriteria KaTa Kreatif dan kegiatan kolaborasi satker teknis dengan pemerintah daerah", icon: MapPin, color: "#F97316" },
];

export default function CreativeHub() {
  return (
    <div className="p-4 md:p-6 min-h-screen" style={{ background: "var(--ch-bg)" }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[13px]" style={{ color: "var(--ch-primary)" }}>
        <span className="font-semibold cursor-pointer hover:underline">Creative Hub</span>
        <ChevronRight className="w-3.5 h-3.5" style={{ color: "var(--ch-text-muted)" }} />
        <span style={{ color: "var(--ch-text-muted)" }}>Flagship Program</span>
      </div>

      {/* Title Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-[36px] font-extrabold leading-tight mb-3"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          3. Flagship Program<br />
          <span style={{ color: "var(--ch-primary)" }}>Creative by Indonesia</span>
        </h1>
        <p className="text-sm max-w-2xl" style={{ color: "var(--ch-text-muted)" }}>
          Akselerasi promosi dan penguatan ekosistem ekonomi kreatif Indonesia di level internasional, nasional, dan daerah.
        </p>
      </div>

      {/* Level Aktivasi Program */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "rgba(59,130,246,0.15)" }}>
            <Globe className="w-3.5 h-3.5" style={{ color: "#3B82F6" }} />
          </div>
          <h2 className="text-[13px] font-extrabold uppercase tracking-wider" style={{ color: "#3B82F6" }}>
            Level Aktivasi Program
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LEVEL_PROGRAMS.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="rounded-2xl p-5 relative overflow-hidden flex flex-col"
                style={{ background: p.bg, border: `1px solid ${p.color}22`, minHeight: "280px" }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${p.color}22`, border: `1px solid ${p.color}33` }}>
                      <Icon className="w-5 h-5" style={{ color: p.color }} />
                    </div>
                    <h3 className="text-lg font-extrabold text-white">{p.title}</h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40" />
                </div>

                {/* Description */}
                <p className="text-[12px] text-white/70 leading-relaxed mb-4">{p.desc}</p>

                {/* Divider */}
                <div className="h-px mb-4" style={{ background: `${p.color}22` }} />

                {/* Kriteria */}
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: p.color }}>
                      Kriteria
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60 leading-relaxed">{p.criteria}</p>
                </div>

                {/* Durasi */}
                <div className="mt-auto">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: p.color }}>
                      Durasi
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60 leading-relaxed">{p.duration}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Jenis dan Jumlah Kegiatan */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "rgba(59,130,246,0.15)" }}>
            <Globe className="w-3.5 h-3.5" style={{ color: "#3B82F6" }} />
          </div>
          <h2 className="text-[13px] font-extrabold uppercase tracking-wider" style={{ color: "#3B82F6" }}>
            Jenis dan Jumlah Kegiatan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {KEGIATAN.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="rounded-2xl p-5 flex items-center gap-4"
                style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${k.color}15`, border: `1px solid ${k.color}22` }}>
                  <Icon className="w-6 h-6" style={{ color: k.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold whitespace-pre-line" style={{ color: "var(--ch-text-muted)" }}>
                    {k.label}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-3xl font-extrabold" style={{ color: k.color }}>{k.value}</p>
                  <p className="text-[9px] text-white/40 max-w-[140px] leading-tight mt-0.5">{k.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Note */}
      <div className="rounded-xl border p-4 flex items-start gap-3"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "rgba(59,130,246,0.1)" }}>
          <Info className="w-4 h-4" style={{ color: "#3B82F6" }} />
        </div>
        <p className="text-[12px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>
          Seluruh kegiatan merupakan bagian dari aktivasi Creative by Indonesia untuk memperkuat citra dan daya saing ekonomi kreatif Indonesia di tingkat global dan lokal.
        </p>
      </div>
    </div>
  );
}

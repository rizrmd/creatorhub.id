import { Briefcase, CheckSquare, Clock, AlertCircle } from "lucide-react";

const tasks = [
  { id: "1", brand: "ASUS", campaign: "ROG Phone Launch", deliverable: "Unboxing Reel 60s", due: "2026-06-28", status: "in-progress" as const },
  { id: "2", brand: "ASUS", campaign: "ROG Phone Launch", deliverable: "IG Story Announcement", due: "2026-06-27", status: "submitted" as const },
  { id: "3", brand: "Wardah", campaign: "Ramadan Glow",   deliverable: "Tutorial Reel", due: "2026-07-02", status: "pending" as const },
];

const statusConfig = {
  pending:     { label: "Belum Mulai",  bg: "#F1F5F9", fg: "#475569", icon: Clock },
  "in-progress": { label: "Dalam Proses",  bg: "#DBEAFE", fg: "#1D4ED8", icon: Briefcase },
  submitted:   { label: "Sudah Dikirim", bg: "#DCFCE7", fg: "#15803D", icon: CheckSquare },
  revision:    { label: "Perlu Revisi",   bg: "#FEE2E2", fg: "#B91C1C", icon: AlertCircle },
};

export default function CreatorWork() {
  return (
    <div className="p-6 space-y-5" style={{ background: "var(--ch-bg)" }}>
      <div>
        <h1 className="text-[28px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Pekerjaan Aktif
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Pantau dan kelola semua deliverables kampanye
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Deliverables", value: tasks.length, hue: 220 },
          { label: "Dalam Proses", value: tasks.filter(t => t.status === "in-progress").length, hue: 142 },
          { label: "Sudah Dikirim", value: tasks.filter(t => t.status === "submitted").length, hue: 28 },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border p-4 text-center"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <p className="text-[26px] font-extrabold"
              style={{ color: `hsl(${s.hue}, 70%, 45%)`, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {s.value}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {tasks.map((t) => {
          const cfg = statusConfig[t.status];
          const Icon = cfg.icon;
          return (
            <div key={t.id} className="rounded-xl border p-4 flex items-center gap-4"
              style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: cfg.bg, color: cfg.fg }}>
                <Icon style={{ width: 16, height: 16 }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>{t.deliverable}</p>
                <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>
                  {t.brand} · {t.campaign} · Due {new Date(t.due).toLocaleDateString("id-ID")}
                </p>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0"
                style={{ background: cfg.bg, color: cfg.fg }}>
                {cfg.label}
              </span>
              {t.status === "in-progress" && (
                <button className="px-3 py-1.5 rounded-lg text-white text-[12px] font-semibold shrink-0"
                  style={{ background: "var(--ch-primary)" }}>
                  Submit
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

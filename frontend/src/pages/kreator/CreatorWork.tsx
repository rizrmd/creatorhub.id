import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Briefcase, CheckSquare, Clock, AlertCircle, Search } from "lucide-react";
import { KREATOR_TASKS, type KreatorTask, type TaskStatus } from "@/data/kreatorData";
import { useKreatorData } from "@/context/KreatorDataContext";

function matchesTaskSearch(task: KreatorTask, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [task.brand, task.campaign, task.deliverable].some((field) => field.toLowerCase().includes(q));
}

const statusConfig: Record<TaskStatus, { label: string; bg: string; fg: string; icon: React.ElementType }> = {
  pending: { label: "Belum Mulai", bg: "#F1F5F9", fg: "#475569", icon: Clock },
  "in-progress": { label: "Dalam Proses", bg: "#DBEAFE", fg: "#1D4ED8", icon: Briefcase },
  submitted: { label: "Sudah Dikirim", bg: "#DCFCE7", fg: "#15803D", icon: CheckSquare },
  revision: { label: "Perlu Revisi", bg: "#FEE2E2", fg: "#B91C1C", icon: AlertCircle },
};

export default function CreatorWork() {
  const { stats } = useKreatorData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");

  useEffect(() => {
    if (!searchParams.has("search")) return;
    setSearch(searchParams.get("search") ?? "");
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const tasks = useMemo(
    () => KREATOR_TASKS.filter((task) => matchesTaskSearch(task, search)),
    [search],
  );

  const summary = [
    { label: "Total Deliverables", value: KREATOR_TASKS.length, hue: 220 },
    { label: "Dalam Proses", value: stats.inProgressJobCount, hue: 142 },
    { label: "Sudah Dikirim", value: KREATOR_TASKS.filter((t) => t.status === "submitted").length, hue: 28 },
  ];

  return (
    <div className="p-4 md:p-6 space-y-5" style={{ background: "var(--ch-bg)" }}>
      <div>
        <h1 className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Pekerjaan Aktif
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Pantau dan kelola semua deliverables kampanye
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summary.map((s) => (
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

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-soft)" }} />
        <input
          className="w-full rounded-xl border pl-9 pr-3 py-2.5 text-[13px] outline-none"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
          placeholder="Cari brand, kampanye, deliverable…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
        {tasks.length === 0 && (
          <div className="py-12 text-center" style={{ color: "var(--ch-text-soft)" }}>
            <p className="text-[14px] font-medium">
              {search.trim() ? `Tidak ada pekerjaan untuk "${search.trim()}"` : "Tidak ada pekerjaan"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
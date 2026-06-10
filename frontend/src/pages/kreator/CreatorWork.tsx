import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Briefcase, CheckSquare, Clock, AlertCircle, Search, Inbox } from "lucide-react";
import { KREATOR_TASKS, type KreatorTask, type TaskStatus } from "@/data/kreatorData";

const STATUS_TABS: { key: "all" | TaskStatus; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "Semua", icon: Inbox },
  { key: "pending", label: "Belum Mulai", icon: Clock },
  { key: "in-progress", label: "Dalam Proses", icon: Briefcase },
  { key: "submitted", label: "Sudah Dikirim", icon: CheckSquare },
  { key: "revision", label: "Perlu Revisi", icon: AlertCircle },
];

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const [tab, setTab] = useState<"all" | TaskStatus>("all");

  useEffect(() => {
    if (!searchParams.has("search")) return;
    setSearch(searchParams.get("search") ?? "");
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const searched = useMemo(
    () => KREATOR_TASKS.filter((task) => matchesTaskSearch(task, search)),
    [search],
  );

  const tasks = useMemo(
    () => (tab === "all" ? searched : searched.filter((task) => task.status === tab)),
    [searched, tab],
  );

  const counts = useMemo(() => ({
    all: searched.length,
    pending: searched.filter((t) => t.status === "pending").length,
    "in-progress": searched.filter((t) => t.status === "in-progress").length,
    submitted: searched.filter((t) => t.status === "submitted").length,
    revision: searched.filter((t) => t.status === "revision").length,
  }), [searched]);

  return (
    <div className="p-4 md:p-6 space-y-5" style={{ background: "var(--ch-bg)" }}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
            style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Pekerjaan Aktif
          </h1>
          <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
            Pantau dan kelola semua deliverables kampanye
          </p>
        </div>
        <div className="relative w-full sm:w-72 lg:w-80 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-soft)" }} />
          <input
            className="w-full rounded-xl border pl-9 pr-3 py-2.5 text-[13px] outline-none"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
            placeholder="Cari brand, kampanye, deliverable…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-0 border-b overflow-x-auto" style={{ borderColor: "var(--ch-border)" }}>
        {STATUS_TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-colors shrink-0 cursor-pointer"
              style={active
                ? { borderColor: "#16A34A", color: "#16A34A" }
                : { borderColor: "transparent", color: "var(--ch-text-muted)" }}
            >
              <Icon style={{ width: 13, height: 13 }} />
              {t.label}
              <span
                className="text-[11px] px-1.5 py-0.5 rounded-full"
                style={active ? { background: "#DCFCE7", color: "#15803D" } : { background: "var(--ch-bg)", color: "var(--ch-text-muted)" }}
              >
                {counts[t.key]}
              </span>
            </button>
          );
        })}
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
              {search.trim()
                ? `Tidak ada pekerjaan untuk "${search.trim()}"`
                : tab === "all"
                  ? "Tidak ada pekerjaan"
                  : "Tidak ada pekerjaan di kategori ini"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}